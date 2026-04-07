import { z } from "zod";

export const withdrawlSchema = z.object({
  amount: z.coerce.number().min(1, { error: "Minimum amount value is 1" }),
});
