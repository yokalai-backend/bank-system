import bcrypt from "bcrypt";
import pool from "@config/db";
import Errors from "@errors/errors";

type UpdatedProps = { username?: string; password?: string };

function toReturn({ username, password }: UpdatedProps): any {
  if (username && password) return "Username and password has been updated";
  if (username) return "Username has been updated";
  if (password) return "Password has been updated";
}

export default async function updateMeHelper(
  userId: string,
  newUsername?: string,
  newPassword?: string,
): Promise<string> {
  const client = await pool.connect();

  const params = [];
  const values = [];
  let i = 1;

  if (newUsername) {
    params.push(`username = $${i++}`);
    values.push(newUsername);
  }

  if (newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);

    params.push(`hash = $${i++}`);
    values.push(hash);
  }

  values.push(userId);

  const sqlStr = `UPDATE users SET ${params.join(", ")} WHERE id = $${i++}`;

  try {
    await client.query(`BEGIN`);

    const user = await client.query(
      `SELECT id FROM users WHERE id = $1 FOR UPDATE NOWAIT`,
      [userId],
    ); // Lock the row so another device with the same user id won't be able to update at the same time
    if (user.rowCount === 0)
      throw Errors.notFound("User not found", "USER_NOT_FOUND");

    await client.query(sqlStr, values); // Update afterward

    await client.query(`COMMIT`);

    return toReturn({ username: newUsername, password: newPassword });
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}
