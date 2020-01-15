import Conf from 'conf';

import { GeneratedAddress } from 'ripple-lib/dist/npm/offline/generate-address';

const config = new Conf();

export function saveAddress(alias: string, address_parts: GeneratedAddress): void {
  config.set(`address.${alias}`, address_parts);
}

export function getAddress(alias: string): GeneratedAddress {
  return config.get(`address.${alias}`);
}

export function getAllAddresses(): any {
  return config.get('address');
}

export function deleteAddress(alias: string): void {
  config.delete(`address.${alias}`);
}

export function setCurrentAddress(alias: string): void {
  const aliases = Object.keys(getAllAddresses());

  if (!aliases.includes(alias)) {
    console.error(
      'That is not a valid address alias. Please try running `xrp address list` to see what addresses you have saved.',
    );
    return;
  }

  config.set('default', alias);
  console.log(`Your current address is now ${alias}.`);
}
