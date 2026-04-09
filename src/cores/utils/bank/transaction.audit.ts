import { queryOne } from "@utils/shared/query";
import { Transactions, BalanceHistory } from "@bank/bank.type";

export default async function transactionAudit(
  userId: string,
  type: Transactions,
  balanceHistory: BalanceHistory,
): Promise<void> {
  const { balanceBefore, balanceAfter } = balanceHistory;

  await queryOne(
    `INSERT INTO transactions (user_id, type, balance_before, balance_after) VALUES ($1, $2, $3, $4)`,
    [userId, type, balanceBefore, balanceAfter],
  );
}
