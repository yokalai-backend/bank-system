import userRepo from "@user/user.repository";
import { UserOutProps, userParser } from "@utils/shared/user.parser";
import { UpdateUserProps } from "./user.schema";

export async function meService(userId: string): Promise<UserOutProps> {
  const user = await userRepo.me(userId);

  return userParser.parse(user);
}

export async function myWalletService(
  userId: string,
): Promise<{ balance: number } | null> {
  return await userRepo.myWallet(userId);
}

export async function updateMeService(
  userId: string,
  updateProps: UpdateUserProps,
): Promise<string> {
  return await userRepo.updateMe(userId, updateProps);
}
