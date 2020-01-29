import live_api from './live-connection';
import { getAddress, saveAddress } from '../configuration';

export default async function updateAddress(alias: string): Promise<void> {
  const account = getAddress(alias);

  try {
    await live_api.connect();
    const accountInfo = await live_api.getAccountInfo(account.classicAddress);

    for (const [key, value] of Object.entries(accountInfo)) {
      account[key] = value;
    }

    saveAddress(alias, account);
  } catch (e) {
    // Swallow "Account not found." errors
    if (e?.data?.error_message !== 'Account not found.') {
      console.error(`${account.classicAddress}: ${e?.data?.error_message}`);
    }
  }
}
