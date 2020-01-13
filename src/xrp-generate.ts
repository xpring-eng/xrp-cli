import * as commander from 'commander';
import * as inquirer from 'inquirer';

import { RippleAPI } from 'ripple-lib';
import { GeneratedAddress, GenerateAddressOptions } from 'ripple-lib/dist/npm/offline/generate-address';

// Define types
interface AddressSettings {
  readonly algorithm: 'ecdsa-secp256k1' | 'ed25519';
  readonly alias: string;
}

// Set up the CLI sub-command correctly, so it can process a --help flag
const generate = new commander.Command();

generate.name('xrp generate');
generate.on('--help', () => {
  console.log(`
Prompts:
  algorithm:
    - 'secp256k1': The scheme used in bitcoin, The XRP Ledger uses these key types by default.
    - 'ed25519': A newer algorithm which has better performance and other convenient cryptographic properties.

  alias: This is how you will reference this address through the XRP CLI.
  `);
});

generate.parse(process.argv);

/*
 * Invoke the actual generation of a wallet and asking prompt questions
 */
(async function main(): Promise<void> {
  console.log('Note that currently we only support generating TestNet/DevNet addresses.\n');

  const { algorithm, alias } = await getAddressSettings();
  const { xAddress: x_address, secret } = await generateAddress({ algorithm });

  console.log(`
    Your X-Address is ${x_address}.
    Your secret is ${secret}.
    Your address alias is ${alias}.
  `);
})();

// Ask the user how they want their address generated and named
async function getAddressSettings(): Promise<AddressSettings> {
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

function validateAddressAlias(alias: string): boolean | string {
  // The string must be non-empty
  if (!alias) return 'The address alias is a required field.';

  // The string should have no whitespace
  const alias_is_valid = !/\s/.test(alias);
  return alias_is_valid || 'Your address alias cannot contain whitespace.';
}

// Generate the actual address and secret
async function generateAddress({ algorithm, test = true }: GenerateAddressOptions): Promise<GeneratedAddress> {
  const api = new RippleAPI();

  // Note that we currently don't support taking a Uint8 entropy array as an input parameter
  return api.generateXAddress({ algorithm, test });
}

export { validateAddressAlias, generateAddress };
