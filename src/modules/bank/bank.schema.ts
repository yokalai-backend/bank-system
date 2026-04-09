import { z } from "zod";

export const transactionAmount = z.object({
  amount: z.coerce.number().min(1, { error: "Minimum amount value is 1" }),
});

export const transferTo = z.object({
  id: z.uuid({ error: "UUID invalid" }),
});
