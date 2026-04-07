import { config } from "dotenv";
config();

import { z } from "zod";

const env = z.object({
  DB_USERNAME: z.string(),
  DB_HOST: z.string(),
  DATABASE: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number(),
  ACCESS_TOKEN: z.string().min(20),
  REFRESH_TOKEN: z.string().min(20),
});

export default env.parse(process.env);
