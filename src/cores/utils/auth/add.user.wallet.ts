import { queryOne } from "@utils/shared/query";

export default async function addUserWallet(userId: string): Promise<void> {
  await queryOne(`INSERT INTO user_wallet (user_id) VALUES ($1)`, [userId]);
}
