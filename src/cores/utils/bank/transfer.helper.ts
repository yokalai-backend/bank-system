import pool from "@config/db";
import Errors from "@errors/errors";
import balance from "@utils/bank/balance.history";
import transactionAudit from "@utils/bank/transaction.audit";

export default async function transferHelper(
  userId: string,
  toUserId: string,
  amount: number,
): Promise<string> {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const exists = await client.query(
      `SELECT id FROM users WHERE id = $1 AND is_active = true FOR UPDATE`,
      [toUserId],
    ); // Find if the targeted user is exists or not

    if (exists.rowCount === 0)
      throw Errors.notFound("User not found", "USER_NOT_FOUND");

    if (exists.rows[0].id === userId)
      throw Errors.badRequest("User can't transfer itself");

    const userBankBalance = await client.query(
      `UPDATE bank_balance SET balance = balance - $1 WHERE user_id = $2 AND balance >= $1 RETURNING balance`,
      [amount, userId],
    );

    if (userBankBalance.rowCount === 0)
      throw Errors.badRequest("Balance not enough", "INSUFFICIENT_BALANCE");

    await client.query(
      `UPDATE bank_balance SET balance = balance + $1 WHERE user_id = $2`,
      [amount, toUserId],
    ); //Transfer to the targeted user

    //Save logs
    const currentUserBalance = userBankBalance.rows[0].balance;

    const history = balance(amount, currentUserBalance, "transfer");

    await transactionAudit(userId, "transfer", history); //ERROR

    await client.query(`COMMIT`);

    return `Transfer completed, tranfered amount of ${amount}`;
  } catch (error) {
    client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}
