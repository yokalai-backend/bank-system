import updateMeHelper from "@utils/user/udpate.me.helper";
import { queryOne } from "@utils/shared/query";
import { UpdateUserProps } from "./user.schema";
import { UserOutProps } from "@utils/shared/user.parser";

const userRepo = {
  me: async (userId: string) =>
    queryOne<UserOutProps>(
      `SELECT id, username, role, created_at FROM users WHERE id = $1`,
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
