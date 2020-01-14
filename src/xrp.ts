#!/usr/bin/env node
import * as commander from 'commander';

const xrp_cli = new commander.Command();
xrp_cli.version('0.0.1');

xrp_cli.command('address <generate | list>', 'Interact with addresses. Generate new ones or list existing ones.');

xrp_cli.parse(process.argv);
