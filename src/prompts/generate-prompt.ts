import * as inquirer from 'inquirer';

export const GENERATE_HELP = `
Prompts:
  algorithm:
    - 'secp256k1': The scheme used in bitcoin, The XRP Ledger uses these key types by default.
    - 'ed25519': A newer algorithm which has better performance and other convenient cryptographic properties.

  alias: This is how you will reference this address through the XRP CLI.
`;

export interface AddressSettings {
  readonly algorithm: 'ecdsa-secp256k1' | 'ed25519';
  readonly alias: string;
}

// Ask the user how they want their address generated and named
export async function getAddressSettings(): Promise<AddressSettings> {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'algorithm',
      message: 'Which digital signature algorithm would you like to generate an address with?',
      default: 'ecdsa-secp256k1',
      choices: ['ecdsa-secp256k1', 'ed25519'],
    },
    {
      type: 'input',
      name: 'alias',
      message: 'What is an alias you would like to reference this address by?',
      validate: validateAddressAlias,
    },
  ]);
}

export function validateAddressAlias(alias: string): boolean | string {
  // The string must be non-empty
  if (!alias) return 'The address alias is a required field.';

  // The string should have no whitespace
  const alias_is_valid = !/\s/.test(alias);
  return alias_is_valid || 'The address alias cannot contain whitespace.';
}
