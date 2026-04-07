import { queryOne } from "@utils/shared/query";

export default async function addUserWallet(userId: string): Promise<void> {
  await queryOne(`INSERT INTO bank_balance (user_id) VALUES ($1)`, [userId]);
}
