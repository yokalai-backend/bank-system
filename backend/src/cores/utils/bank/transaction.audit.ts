import { Transactions, BalanceHistory } from "@bank/bank.type";

export default async function transactionAudit(
  client: any,
  userId: string,
  userEmail: string,
  type: Transactions,
  balanceHistory: BalanceHistory,
): Promise<void> {
  const { balanceBefore, balanceAfter } = balanceHistory;

  await client.query(
    `INSERT INTO transactions (user_id, type, balance_before, balance_after, user_email) VALUES ($1, $2, $3, $4, $5)`,
    [userId, type, balanceBefore, balanceAfter, userEmail],
  );
}
