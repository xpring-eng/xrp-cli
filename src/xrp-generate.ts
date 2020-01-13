import * as commander from 'commander';

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
  const { xAddress: x_address, classicAddress: classic_address, secret } = await generateAddress({ algorithm });

  console.log(`
    Your X-Address is ${x_address}.
    Your classic address is ${classic_address}.
    Your secret is ${secret}.
    Your address alias is ${alias}.
  `);
})();
