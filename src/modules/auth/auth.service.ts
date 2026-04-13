import authRepo from "@auth/auth.repository";
import bcrypt from "bcrypt";
import Errors from "@errors/errors";
import loginHelper from "@utils/auth/login";
import logoutHelper from "@utils/auth/logout";
import refreshTokenHelper from "@utils/auth/refresh.token";
import { LoginProps, RegisterProps } from "@auth/auth.schema";
import { NewTokens, Tokens } from "@auth/auth.type";
import addUserWallet from "@utils/auth/add.user.wallet";

export async function registerService({
  username,
  password,
  email,
}: RegisterProps): Promise<void> {
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await authRepo.register(username, hashed, email);

    await addUserWallet(user?.id!);
  } catch (error: any) {
    if (error.code === "23505") {
      throw Errors.conflict("Email already exists", "EMAIL_DUPLICATE");
    }

    throw error;
  }
}

export async function loginService({
  password,
  email,
}: LoginProps): Promise<Tokens> {
  const user = await authRepo.login(email);

  if (!user) {
    throw Errors.authorization(
      "Email or password is incorrect please try again",
      "INVALID_CREDENTIALS",
    );
  }

  const { id, username, hash, role } = user;

  const tokens = await loginHelper(
    { password: password, hashed: hash },
    { id, username, role },
  );

  return tokens;
}

export async function logoutService(refreshToken: string): Promise<void> {
  await logoutHelper(refreshToken); // Log out handled by helper
}

export async function refreshTokenService(token: string): Promise<NewTokens> {
  if (!token) {
    throw Errors.authorization("No refresh token provided", "NO_REFRESH_TOKEN");
  }

  return await refreshTokenHelper(token);
}
