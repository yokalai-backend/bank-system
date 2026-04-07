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

export async function exsName2() {
  // Code goes here
}

export async function exsName3() {
  // Code goes here
}

export async function exsName4() {
  // Code goes here
}

export async function exsName5() {
  // Code goes here
}
