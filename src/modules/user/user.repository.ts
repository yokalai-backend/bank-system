import updateMeHelper from "@utils/user/udpate.me.helper";
import { queryOne } from "@utils/shared/query";
import { UpdateUserProps } from "./user.schema";
import { UserOutProps } from "@utils/shared/user.parser";

const userRepo = {
  me: async (userId: string) =>
    queryOne<UserOutProps>(
      `SELECT u.id, u.username, u.role, u.created_at, w.balance AS w_balance
      , b.balance AS b_balance FROM users u
      INNER JOIN user_wallet w ON w.user_id = u.id INNER JOIN bank_balance b ON b.user_id = u.id WHERE u.id = $1`,
      [userId],
    ),

  myWallet: async (userId: string) =>
    queryOne<{ balance: number }>(
      `SELECT balance FROM user_wallet WHERE user_id = $1`,
      [userId],
    ),

  updateMe: async (
    userId: string,
    { username, password }: UpdateUserProps,
  ): Promise<string> => updateMeHelper(userId, username, password),
};

export default userRepo;
