import bankRepo from "@bank/bank.repository";

export async function myBalanceService(
  userId: string,
): Promise<{ balance: string } | null> {
  return await bankRepo.mybalance(userId);
}

export async function witdrawlService(
  userId: string,
  amount: number,
): Promise<string> {
  return await bankRepo.withdrawl(userId, amount); // Withdraw from the bank into your own wallet
}

export async function depositService(
  userId: string,
  amount: number,
): Promise<string> {
  return await bankRepo.deposit(userId, amount);
}

export async function transferService(
  userId: string,
  toUserId: string,
  amount: number,
): Promise<string> {
  return await bankRepo.transfer(userId, toUserId, amount);
}

export async function addBalanceService(
  userId: string,
  amount: number,
  method: "wallet" | "bank",
): Promise<string> {
  return await bankRepo.addBalance(userId, amount, method);
}

export async function exsName5() {
  // Code goes here
}
