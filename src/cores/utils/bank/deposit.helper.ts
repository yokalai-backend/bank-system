import pool from "@config/db";
import Errors from "@errors/errors";
import balance from "./balance.history";
import transactionAudit from "./transaction.audit";

export default async function depositHelper(
  userId: string,
  amount: number,
): Promise<string> {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const updateWallet = await client.query(
      `UPDATE user_wallet SET balance = balance - $1 WHERE user_id = $2 AND balance >= $1 RETURNING id`,
      [amount, userId],
    );

    if (updateWallet.rowCount === 0)
      throw Errors.badRequest("Balance not enough", "INSUFFICIENT_BALANCE");

    const updateBankBalance = await client.query(
      `UPDATE bank_balance SET balance = balance + $1, updated_at = NOW() WHERE user_id = $2 RETURNING balance`,
      [amount, userId],
    );

    //Save transaction history
    const currentBalance = updateBankBalance.rows[0].balance;

    const history = balance(amount, currentBalance, "deposit");

    await transactionAudit(client, userId, "deposit", history);

    await client.query(`COMMIT`);

    return `Deposit successfull with amount of ${amount}`;
  } catch (error) {
    await client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}
