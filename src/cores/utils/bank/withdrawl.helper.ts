import pool from "@config/db";
import Errors from "@errors/errors";
import redisClient from "@redis/redis";

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
      user_id = $2 AND balance >= $1 RETURNING id`,
      [amount, userId],
    );

    if (updateBankBalance.rowCount === 0)
      throw Errors.badRequest(
        "Bank account's balance does not enough",
        "INSUFFICIENT_BALANCE",
      );

    const updateWallet = await client.query(
      `UPDATE user_wallet SET balance = balance + $1 WHERE user_id = $2 RETURNING id`,
      [amount, userId],
    );

    if (updateWallet.rowCount === 0)
      throw Error("User wallet does not received"); // Safety purposes

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
