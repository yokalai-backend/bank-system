import withdrawlHelper from "@utils/bank/withdrawl.helper";
import { queryOne } from "@utils/shared/query";

const bankRepo = {
  mybalance: async (userId: string) =>
    queryOne<{ balance: string }>(
      `SELECT b.balance FROM users u INNER JOIN bank_balance b ON u.id = b.user_id WHERE b.user_id = $1 AND u.is_active = true`,
      [userId],
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
