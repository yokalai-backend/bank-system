import pool from "@config/db";
import Errors from "@errors/errors";
import redisClient from "@redis/redis";
import transactionAudit from "./transaction.audit";
import balance from "./balance.history";

export default async function withdrawlHelper(
  userId: string,
  amount: number,
): Promise<string> {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const updateBankBalance = await client.query(
      `UPDATE bank_balance SET balance = balance - $1, 
      updated_at = NOW() WHERE 
      user_id = $2 AND balance >= $1 RETURNING id, balance`,
      [amount, userId],
    );

    if (updateBankBalance.rowCount === 0)
      throw Errors.badRequest(
        "Bank account's balance does not enough",
        "INSUFFICIENT_BALANCE",
      );

    await client.query(
      `UPDATE user_wallet SET balance = balance + $1 WHERE user_id = $2 RETURNING id`,
      [amount, userId],
    );

    // Save progress in audit
    const currentBalance = updateBankBalance.rows[0].balance;

    const history = balance(amount, currentBalance, "withdraw");

    await transactionAudit(client, userId, "withdraw", history);

    await client.query("COMMIT");

    await redisClient.del(`balance:${userId}`);

    return `Withdrawal successfull, received amount of money ${amount}`;
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}
