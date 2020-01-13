import * as commander from 'commander';
import { saveAddress } from './api/configuration';

import { GENERATE_HELP, getAddressSettings } from './prompts/generate-prompt';
import generateAddress from './api/generate-address';

// Set up the CLI sub-command correctly, so it can process a --help flag
const program = new commander.Command();

program
  .name('xrp generate')
  .description('Use to generate a new XRP address')
  .on('--help', () => console.log(GENERATE_HELP))
  .parse(process.argv);

/*
 * Invoke the actual generation of a wallet and asking prompt questions
 */
(async function generate(): Promise<void> {
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
})();
