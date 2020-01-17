import live_api from './live-connection';
import { getAddress, saveAddress } from '../configuration';

export default async function updateAddress(alias: string): Promise<void> {
  await live_api.connect();

  const address = getAddress(alias);

  try {
    const accountInfo = await live_api.getAccountInfo(address);

    for (const [key, value] of Object.entries(accountInfo)) {
      address[key] = value;
    }

    saveAddress(alias, address);
  } catch (e) {
    // Swallow "Account not found." errors
    if (e?.data?.error_message !== 'Account not found.') {
      console.error(`${address}: ${e?.data?.error_message}`);
    }
  } finally {
    // Clean up and close the connection
    live_api.disconnect();
  }
}
