import * as commander from 'commander';

import { GENERATE_HELP, getAddressSettings } from './prompts/generate-address-prompt';
import { ADD_ADDRESS_HELP, getAddressInputs } from './prompts/add-address-prompt';
import generateAddress from './api/generate-address';
import { getAllAddresses, saveAddress } from './configuration';
import { convertAddress } from './api/convert-address';

// Set up the CLI sub-command correctly, so it can process a --help flag
const program = new commander.Command();

program.name('xrp address');
program.description('Use to interact with your XRP addresses');

program
  .command('generate')
  .description('Generate a new XRP address')
  .action(generate)
  .on('--help', () => console.log(GENERATE_HELP));

program
  .command('list')
  .description('list all of your current XRP addresses')
  .action(list);

program
  .command('add')
  .description('Add your own address/secret combination')
  .action(add)
  .on('--help', () => console.log(ADD_ADDRESS_HELP));

program.parse(process.argv);

/*
 * Invoke the actual generation of a wallet and asking prompt questions
 */
async function generate(): Promise<void> {
  console.log('Note that currently we only support generating TestNet/DevNet addresses.\n');

  const { algorithm, alias } = await getAddressSettings();
  const { xAddress, classicAddress, secret } = await generateAddress({ algorithm });

  saveAddress(alias, { xAddress, classicAddress, secret });

  console.log(`
    Your address alias is ${alias}.
    Your X-Address is ${xAddress}.
    Your classic address is ${classicAddress}.
    Your secret is ${secret}.
  `);
}

// List all addresses stored in local configuration
function list(): void {
  const addresses = getAllAddresses();

  if (!addresses) {
    console.log('You have not generated any addresses yet!');
    return;
  }

  Object.keys(addresses).forEach((alias) => {
    console.log(`
${alias}:
  X-Address:         ${addresses[alias].xAddress}
  Classic Address:   ${addresses[alias]?.classicAddress}
  Secret:            ${addresses[alias].secret}`);
  });

  console.log('\n');
}

// Add a new address
async function add(): Promise<void> {
  console.log('Note that currently we only support adding TestNet/DevNet addresses.\n');

  const { alias, address, secret } = await getAddressInputs();
  const { xAddress, classicAddress } = convertAddress(address);
  saveAddress(alias, { xAddress, classicAddress, secret });

  console.log(`Your address has been saved as ${alias}.`);
}