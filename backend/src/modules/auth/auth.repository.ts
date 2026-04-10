import { queryOne } from "@utils/shared/query";
import { Roles } from "@auth/auth.type";

const authRepo = {
  register: async (username: string, hashed: string, email: string) => {
    return await queryOne<{ id: string }>(
      `INSERT INTO users (username, hash, email) VALUES ($1, $2, $3) RETURNING id`,
      [username, hashed, email],
    );
  }, // Register account

  login: async (email: string) =>
    queryOne<{
      id: string;
      username: string;
      hash: string;
      role: Roles;
    }>(
      `SELECT id, username, hash, role FROM users WHERE email = $1 AND is_active = true`,
      [email],
    ),
};

export default authRepo;
