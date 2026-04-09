import { BalanceHistory, Transactions } from "@bank/bank.type";

export default function balance(
  amount: number,
  balanceAfterTransaction: number,
  type: Transactions,
): BalanceHistory {
  const balanceBefore =
    type === "withdraw"
      ? Number(balanceAfterTransaction) + amount
      : type === "deposit"
        ? Number(balanceAfterTransaction) - amount
        : 0;

  return {
    balanceBefore,
    balanceAfter: balanceAfterTransaction,
  };
}
