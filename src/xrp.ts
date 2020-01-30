#!/usr/bin/env node
import * as commander from 'commander';

import { setCurrentAddress } from './configuration';

const xrp_cli = new commander.Command();
xrp_cli.version('0.1.0');

// Subcommand for interacting with addresses
xrp_cli.command(
  'address <generate | list | add>',
  'Interact with addresses. Generate or add new addresses or list existing ones.',
);

// Subcommand for sending XRP
xrp_cli.command('send <direct>', 'Send value to another account.');

// Command for setting a saved address as your current address
xrp_cli
  .command('use <address_alias>')
  .description('Select a saved address to use as your current default.')
  .action(setCurrentAddress);

xrp_cli.parse(process.argv);
