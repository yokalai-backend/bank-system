import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import env from "@config/env";
import Errors from "@errors/errors";
import { queryOne } from "@utils/shared/query";
import { NewTokens } from "@auth/auth.type";

export default async function RefreshTokenHelper(
  token: string,
): Promise<NewTokens> {
  console.log(token);
  try {
    const { id, jti } = jwt.verify(token, env.REFRESH_TOKEN) as {
      id: string;
      jti: string;
    };

    const deleted = await queryOne(
      `DELETE FROM refreshtokens 
       WHERE jti = $1 AND user_id = $2 
       RETURNING jti`,
      [jti, id],
    );

    if (!deleted) {
      await queryOne(`DELETE FROM refreshtokens WHERE user_id = $1`, [id]);

      throw Errors.authorization("Token reuse detected", "TOKEN_REUSE");
    }

    const user = await queryOne(
      `SELECT id, username, role 
       FROM users 
       WHERE id = $1 AND is_active = true`,
      [id],
    );

    if (!user) throw Errors.authorization("User not found", "USER_NOT_FOUND");

    const newAccessToken = jwt.sign({ ...user }, env.ACCESS_TOKEN, {
      expiresIn: "2m",
    });

    const newJti = crypto.randomUUID();

    const newRefreshToken = jwt.sign({ id, jti: newJti }, env.REFRESH_TOKEN, {
      expiresIn: "7d",
    });

    await queryOne(`INSERT INTO refreshtokens (user_id, jti) VALUES ($1, $2)`, [
      id,
      newJti,
    ]);

    return { newAccessToken, newRefreshToken };
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw Errors.authorization("Token expired", "REFRESH_TOKEN_EXPIRED");

    if (error instanceof JsonWebTokenError)
      throw Errors.authorization("Token invalid", "REFRESH_TOKEN_INVALID");

    throw error;
  }
}
