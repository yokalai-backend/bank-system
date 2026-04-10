import { Transactions, BalanceHistory } from "@bank/bank.type";

export default async function transactionAudit(
  client: any,
  userId: string,
  type: Transactions,
  balanceHistory: BalanceHistory,
): Promise<void> {
  const { balanceBefore, balanceAfter } = balanceHistory;

  console.log(balanceBefore, balanceAfter);

  await client.query(
    `INSERT INTO transactions (user_id, type, balance_before, balance_after) VALUES ($1, $2, $3, $4)`,
    [userId, type, balanceBefore, balanceAfter],
  );
}
