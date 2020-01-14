import * as api from 'ripple-address-codec';

export interface Addresses {
  xAddress: string;
  classicAddress: string;
}

// We assume we are passed a valid address here
export function convertAddress(address: string, is_test_address = true): Addresses {
  if (api.isValidXAddress(address)) {
    const { classicAddress } = api.xAddressToClassicAddress(address);

    return {
      xAddress: address,
      classicAddress,
    };
  }

  return {
    xAddress: api.classicAddressToXAddress(address, false, is_test_address),
    classicAddress: address,
  };
}
