import { RippleAPI } from 'ripple-lib';
import { GeneratedAddress, GenerateAddressOptions } from 'ripple-lib/dist/npm/offline/generate-address';

// Generate the actual address and secret
export default async function generateAddress({
  algorithm,
  test = true,
  includeClassicAddress = true,
}: GenerateAddressOptions): Promise<GeneratedAddress> {
  const api = new RippleAPI();

  // Note that we currently don't support taking a Uint8 entropy array as an input parameter
  return api.generateXAddress({ algorithm, test, includeClassicAddress });
}
