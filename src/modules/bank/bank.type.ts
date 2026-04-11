export type Transactions = "withdraw" | "deposit" | "transfer";

export type BalanceHistory = {
  balanceBefore: number;
  balanceAfter: number;
};
