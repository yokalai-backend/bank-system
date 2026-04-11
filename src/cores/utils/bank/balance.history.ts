import { BalanceHistory, Transactions } from "@bank/bank.type";

export default function balance(
  amount: number,
  balanceAfterTransaction: number,
  type: Transactions,
): BalanceHistory {
  let balanceBefore: number;

  if (type === "withdraw" || type === "transfer") {
    balanceBefore = Number(balanceAfterTransaction) + amount;
  } else if (type === "deposit") {
    balanceBefore = Number(balanceAfterTransaction) - amount;
  } else {
    balanceBefore = 0;
  }

  return {
    balanceBefore,
    balanceAfter: balanceAfterTransaction,
  };
}
