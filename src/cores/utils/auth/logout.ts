import jwt from "jsonwebtoken";
import env from "@config/env";
import Errors from "@errors/errors";
import { queryOne } from "@utils/query";

export default async function logoutHelper(refreshToken: string) {
  if (!refreshToken)
    throw Errors.badRequest("User already logout", "ALREADY_LOGOUT");

  const { id, jti } = jwt.verify(refreshToken, env.REFRESH_TOKEN, {
    ignoreExpiration: true,
  }) as {
    id: string;
    jti: string;
  };

  await queryOne<{ id: string }>(
    `DELETE FROM refreshtokens WHERE user_id = $1 AND jti = $2`,
    [id, jti],
  );
}
