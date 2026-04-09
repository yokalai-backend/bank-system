import pool from "@config/db";
import Errors from "@errors/errors";

export default async function transferHelper(
  userId: string,
  toUserId: string,
  amount: number,
): Promise<string> {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const exists = await client.query(
      `SELECT id FROM users WHERE user_id = $1 AND is_active = true FOR UPDATE`,
      [toUserId],
    ); // Find if the targeted user is exists or not

    if (exists.rowCount === 0)
      throw Errors.notFound("User not found", "USER_NOT_FOUND");

    const userBankBalance = await client.query(
      `SELECT balance FROM bank_balance WHERE user_id = $1 AND balance >= $2 FOR UPDATE`,
      [userId, amount],
    );

    if (userBankBalance.rowCount === 0)
      throw Errors.badRequest("Balance not enough", "INSUFFICIENT_BALANCE");

    const currentUserBalance = userBankBalance.rows[0].balance;

    await client.query(
      `UPDATE bank_balance SET balance = balance + $1 WHERE user_id = $2`,
      [currentUserBalance],
    ); //Transfer to the targeted user

    await client.query(`COMMIT`);

    return `Transfer completed, tranfered amount ${amount}`;
  } catch (error) {
    client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}
