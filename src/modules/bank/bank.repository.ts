import withdrawlHelper from "@utils/bank/withdrawl.helper";
import { queryOne } from "@utils/shared/query";
import { cache } from "@redis/cache";
import depositHelper from "@utils/bank/deposit.helper";
import transferHelper from "@utils/bank/transfer.helper";
import addBalanceHelper from "@utils/bank/addBalance.helper";

const bankRepo = {
  mybalance: async (userId: string) =>
    await cache(`balance:${userId}`, 20, async () =>
      queryOne<{ balance: string }>(
        `SELECT balance FROM bank_balance WHERE user_id = $1`,
        [userId],
      ),
    ),

  withdrawl: async (userId: string, amount: number) =>
    withdrawlHelper(userId, amount),

  deposit: async (userId: string, amount: number) =>
    depositHelper(userId, amount),

  transfer: async (userId: string, toUserId: string, amount: number) =>
    transferHelper(userId, toUserId, amount),

  addBalance: async (
    userId: string,
    amount: number,
    method: "wallet" | "bank",
  ) => addBalanceHelper(userId, amount, method),
};

export default bankRepo;
