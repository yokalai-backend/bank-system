import { Tokens, User } from "@auth/auth.type";
import { randomUUID } from "crypto";
import { queryOne } from "@utils/shared/query";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Errors from "@errors/errors";
import env from "@config/env";

type LoginVerifying = { password: string; hashed: string };

export default async function loginHelper(
  { password, hashed }: LoginVerifying,
  jwtPayload: User,
): Promise<Tokens> {
  const verified = await bcrypt.compare(password, hashed);

  if (!verified)
    throw Errors.authorization(
      "Email or password is incorrect please try again",
      "INVALID_CREDENTIALS",
    );

  const { id, username, role } = jwtPayload;

  const accessToken = jwt.sign({ id, username, role }, env.ACCESS_TOKEN, {
    expiresIn: "5m",
  });

  const jti = randomUUID();

  const refreshToken = jwt.sign({ id, jti }, env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  await queryOne("INSERT INTO refreshtokens (user_id, jti) VALUES ($1, $2)", [
    id,
    jti,
  ]);

  return { accessToken, refreshToken };
}
