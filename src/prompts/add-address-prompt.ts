import * as inquirer from 'inquirer';

import { isValidAddress, isValidSecret } from 'ripple-lib/dist/npm/common/schema-validator';
import { validateAddressAlias } from './generate-address-prompt';

export const ADD_ADDRESS_HELP = `
Prompts:
  address: The classic address or X-Address for your account
  secret: The secret for your XRP account
  alias: This is how you will reference this address through the XRP CLI
`;

export interface AddressInputs {
  address: string;
  secret: string;
  alias: string;
}

// Ask the user how they want their address generated and named
export async function getAddressInputs(): Promise<AddressInputs> {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'address',
      message: 'What is your XRP address?',
      validate(address): boolean | string {
        return isValidAddress(address) || 'This does not appear to be a valid XRP address.';
      },
    },
    {
      type: 'input',
      name: 'secret',
      message: 'What is your XRP account secret?',
      validate(secret): boolean | string {
        return isValidSecret(secret) || 'This does not appear to be a valid XRP account secret.';
      },
    },
    {
      type: 'input',
      name: 'alias',
      message: 'What is an alias you would like to reference this address by?',
      validate: validateAddressAlias,
    },
  ]);
}
