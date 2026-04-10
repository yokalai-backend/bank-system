import pool from "@config/db";
import Errors from "@errors/errors";
import transactionAudit from "@utils/bank/transaction.audit";

export default async function transferHelper(
  userId: string,
  toUserId: string,
  amount: number,
): Promise<string> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. lock sender balance
    const senderRes = await client.query(
      `SELECT balance 
       FROM bank_balance 
       WHERE user_id = $1 
       FOR UPDATE`,
      [userId],
    );

    const senderBefore = Number(senderRes.rows[0].balance);

    if (senderBefore < amount) {
      throw Errors.badRequest("Balance not enough", "INSUFFICIENT_BALANCE");
    }

    // 2. lock receiver existence (optional lock if you want strict consistency)
    const receiverRes = await client.query(
      `SELECT id 
       FROM users 
       WHERE id = $1 AND is_active = true 
       FOR UPDATE`,
      [toUserId],
    );

    if (receiverRes.rowCount === 0) {
      throw Errors.notFound("Receiver not found", "USER_NOT_FOUND");
    }

    if (userId === toUserId) {
      throw Errors.badRequest("User can't transfer to itself");
    }

    // 3. calculate balances (source of truth = memory after lock)
    const senderAfter = senderBefore - amount;

    // 4. update sender
    await client.query(
      `UPDATE bank_balance 
       SET balance = $1 
       WHERE user_id = $2`,
      [senderAfter, userId],
    );

    // 5. update receiver (atomic add)
    await client.query(
      `UPDATE bank_balance 
       SET balance = balance + $1 
       WHERE user_id = $2`,
      [amount, toUserId],
    );

    // 6. audit sender history (correct chain)
    await transactionAudit(client, userId, "transfer", {
      balanceBefore: senderBefore,
      balanceAfter: senderAfter,
    });

    await client.query("COMMIT");

    return `Transfer completed: ${amount}`;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
