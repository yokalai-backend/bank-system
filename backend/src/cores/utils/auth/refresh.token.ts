import { queryOne } from "@utils/shared/query";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { NewTokens, Roles } from "@auth/auth.type";
import env from "@config/env";
import Errors from "@errors/errors";

export default async function refreshTokenHelper(
  refreshToken: string,
): Promise<NewTokens> {
  try {
    const { id, jti } = jwt.verify(refreshToken, env.REFRESH_TOKEN) as {
      id: string;
      jti: string;
    };

    const user = await queryOne<{ username: string; role: Roles }>(
      `SELECT username, role FROM users WHERE id = $1 AND is_active = true`,
      [id],
    );

    if (!user)
      throw Errors.authorization("Refresh token regenerate request declined");

    const revoke = await queryOne<{ id: string }>(
      `DELETE FROM refreshtokens WHERE user_id = $1 AND jti = $2 RETURNING id`,
      [id, jti],
    );

    if (!revoke) {
      await queryOne(`DELETE FROM refreshtokens WHERE user_id = $1`, [id]); // Force log out for all devices

      throw Errors.authorization("Token reuse detected", "TOKEN_REUSE");
    }

    const newJti = randomUUID();

    const newRefreshToken = jwt.sign({ id, jti: newJti }, env.REFRESH_TOKEN, {
      expiresIn: "7d",
    });

    await queryOne<void>(
      `INSERT INTO refreshtokens (user_id, jti) VALUES ($1, $2)`,
      [id, newJti],
    ); // Rotation

    const newAccessToken = jwt.sign(
      {
        id,
        username: user.username,
        role: user.role,
      },
      env.ACCESS_TOKEN,
      { expiresIn: "50m" },
    );

    return { newAccessToken, newRefreshToken };
  } catch (error: any) {
    if (error instanceof TokenExpiredError)
      throw Errors.authorization(
        "Refresh token is expired",
        "REFRESH_TOKEN_EXPIRED",
      );

    if (error instanceof JsonWebTokenError)
      throw Errors.authorization(
        "Refresh token is invalid",
        "REFRESH_TOKEN_INVALID",
      );

    throw error;
  }
}
