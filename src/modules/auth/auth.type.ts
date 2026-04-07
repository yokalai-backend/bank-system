export type Roles = "user" | "admin";
export type Tokens = { accessToken: string; refreshToken: string };
export type NewTokens = { newAccessToken: string; newRefreshToken: string };

export interface User {
  id: string;
  username: string;
  role: Roles;
}
