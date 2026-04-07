import updateMeHelper from "@utils/user/udpate.me.helper";
import { queryOne } from "@utils/shared/query";
import { UpdateUserProps } from "./user.schema";
import { UserOutProps } from "@utils/shared/user.parser";

const userRepo = {
  me: async (userId: string) =>
    queryOne<UserOutProps>(
      `SELECT id, username, role, created_at FROM users WHERE id = $1 AND is_active = true`,
      [userId],
    ),

  mybalance: async (userId: string) =>
    queryOne<{ balance: string }>(
      `SELECT w.balance FROM users u INNER JOIN user_wallet w ON u.id = w.user_id WHERE w.user_id = $1 AND u.is_active = true`,
      [userId],
    ),

  updateMe: async (
    userId: string,
    { username, password }: UpdateUserProps,
  ): Promise<string> => updateMeHelper(userId, username, password),
};

export default userRepo;
