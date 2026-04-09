import { z } from "zod";

export const transaction = z.object({
  amount: z.coerce.number().min(1, { error: "Minimum amount value is 1" }),
});
