import userRepo from "@user/user.repository";
import Errors from "@errors/errors";
import { UserOutProps, userParser } from "@utils/shared/user.parser";
import { UpdateUserProps } from "./user.schema";

export async function meService(userId: string): Promise<UserOutProps> {
  const user = await userRepo.me(userId);
  console.log(user);
  if (!user) throw Errors.notFound("User not found", "USER_NOT_FOUND");

  return userParser.parse(user);
}

export async function myBalanceService(
  userId: string,
): Promise<{ balance: string }> {
  const userBalance = await userRepo.mybalance(userId);

  if (!userBalance) throw Errors.notFound("User not found", "USER_NOT_FOUND");

  return userBalance;
}

export async function updateMeService(
  userId: string,
  updateProps: UpdateUserProps,
): Promise<string> {
  return await userRepo.updateMe(userId, updateProps);
}
