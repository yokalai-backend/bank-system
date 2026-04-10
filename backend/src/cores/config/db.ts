import { Pool } from "pg";
import env from "./env";

const pool = new Pool({
  user: env.DB_USERNAME,
  host: env.DB_HOST,
  database: env.DATABASE,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
  max: 100,
  connectionTimeoutMillis: 2000,
  idleTimeoutMillis: 3000,
});

export default pool;
