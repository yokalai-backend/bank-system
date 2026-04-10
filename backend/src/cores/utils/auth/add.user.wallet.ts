import { queryOne } from "@utils/shared/query";

export default async function addUserWallet(userId: string): Promise<void> {
  await queryOne(`INSERT INTO bank_balance (user_id) VALUES ($1)`, [userId]);
  await queryOne(`INSERT INTO user_wallet (user_id) VALUES ($1)`, [userId]);
}

// Added both e-money, first from the bank itself second is the user's own money
