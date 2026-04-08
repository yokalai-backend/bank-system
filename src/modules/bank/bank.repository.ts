import withdrawlHelper from "@utils/bank/withdrawl.helper";
import { queryOne } from "@utils/shared/query";
import { cache } from "@redis/cache";

const bankRepo = {
  mybalance: async (userId: string) =>
    await cache(`balance:${userId}`, 20, async () =>
      queryOne<{ balance: string }>(
        `SELECT balance FROM bank_balance WHERE user_id = $1`,
        [userId],
      ),
    ),

  withdrawl: async (userId: string, amount: number): Promise<string> =>
    withdrawlHelper(userId, amount),
  exf2: async () => {
    // Code goes here
  },
  exf3: async () => {
    // Code goes here
  },
  exf4: async () => {
    // Code goes here
  },
  exf5: async () => {
    // Code goes here
  },
};

export default bankRepo;
