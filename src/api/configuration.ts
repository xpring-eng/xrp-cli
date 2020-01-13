import Conf from 'conf';

import { GeneratedAddress } from 'ripple-lib/dist/npm/offline/generate-address';

const config = new Conf();

export function saveAddress(alias: string, address_parts: GeneratedAddress): void {
  config.set(`address.${alias}`, address_parts);
}

export function getAddress(alias: string): GeneratedAddress {
  return config.get(`address.${alias}`);
}

export function deleteAddress(alias: string): void {
  config.delete(`address.${alias}`);
}
