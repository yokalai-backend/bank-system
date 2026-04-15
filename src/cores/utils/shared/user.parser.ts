import { z } from "zod";

export const userParser = z
  .object({
    id: z.uuid(),
    username: z.string(),
    role: z.enum(["user", "admin"]),
    created_at: z.date(),
    w_balance: z.coerce.number(),
    b_balance: z.coerce.number(),
  })
  .transform(({ created_at, w_balance, b_balance, ...rest }) => ({
    ...rest,
    createdAt: created_at,
    wallet: w_balance,
    bank: b_balance,
  }));

export type UserOutProps = z.infer<typeof userParser>;
