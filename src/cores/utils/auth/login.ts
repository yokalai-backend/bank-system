import { Tokens, User } from "@auth/auth.type";
import { randomUUID } from "crypto";
import { queryOne } from "@utils/shared/query";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Errors from "@errors/errors";
import env from "@config/env";

type LoginVerifying = { userId: string; password: string; hashed: string };

export default async function loginHelper(
  { userId, password, hashed }: LoginVerifying,
  jwtPayload: User,
  prevToken: string,
): Promise<Tokens> {
  const verified = await bcrypt.compare(password, hashed);

  if (!verified)
    throw Errors.authorization(
      "Email or password is incorrect please try again",
      "INVALID_CREDENTIALS",
    );

  if (prevToken) {
    const userId = jwtPayload.id;
    const { jti } = jwt.verify(prevToken, env.REFRESH_TOKEN) as { jti: string };

    await queryOne(
      "DELETE FROM refreshtokens WHERE user_id = $1 AND jti = $2",
      [userId, jti],
    );
  } // DELETE PREVIOUS TOKEN IF THE USER ALREADY HAVE IT

  const accessToken = jwt.sign(jwtPayload, env.ACCESS_TOKEN, {
    expiresIn: "50m",
  });

  const jti = randomUUID();

  const refreshToken = jwt.sign({ id: jwtPayload.id, jti }, env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  await queryOne("INSERT INTO refreshtokens (user_id, jti) VALUES ($1, $2)", [
    userId,
    jti,
  ]);

  return {
    accessToken,
    refreshToken,
  };
} // Helps login by verify user, then generate access/refresh token.
