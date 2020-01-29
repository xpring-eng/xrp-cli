import Conf from 'conf';
import updateAddress from './api/update-address';

const config = new Conf();

export function saveAddress(alias: string, address_parts: any): void {
  config.set(`address.${alias}`, address_parts);
}

export function getAddress(alias: string): any {
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

export function getCurrentAddress(): any {
  const alias = config.get('default');
  return getAddress(alias);
}

export async function updateCurrentAddress(): Promise<any> {
  const alias = config.get('default');

  await updateAddress(alias);
  return getAddress(alias);
}
