import pool from "@config/db";
import Errors from "@errors/errors";

export default async function addBalanceHelper(
  userId: string,
  amount: number,
  method: "wallet" | "bank",
) {
  const updateMethod =
    method === "wallet"
      ? "user_wallet"
      : method === "bank"
        ? "bank_balance"
        : "invalid";

  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const updateBalance = await client.query(
      `UPDATE ${updateMethod} SET balance = balance + $1 WHERE user_id = $2`,
      [amount, userId],
    );

    if (updateBalance.rowCount === 0)
      throw Errors.badRequest("Invalid request");

    await client.query(`COMMIT`);

    return `User ${method} balance has been updated`;
  } catch (error) {
    await client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}
