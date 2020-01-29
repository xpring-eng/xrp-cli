import * as commander from 'commander';
import { RippleAPI } from 'ripple-lib';
import ora from 'ora';
import { PAYMENT_HELP, getDirectPaymentTransactionSettings } from './prompts/payment-transaction-prompt';
import { getCurrentAddress, updateCurrentAddress } from './configuration';
import live_api from './api/live-connection';

// Set up the CLI sub-command correctly, so it can process a --help flag
const program = new commander.Command();

program.name('xrp send');
program.description('Use to send value using the XRP Ledger');

program
  .command('direct')
  .description('Send a direct XRP-to-XRP payment')
  .action(direct)
  .on('--help', () => console.log(PAYMENT_HELP));

program.parse(process.argv);

/*
 * Invoke the actual generation of a wallet and asking prompt questions
 */
async function direct(): Promise<void> {
  await live_api.connect();

  const api = new RippleAPI();
  const account = getCurrentAddress();

  const paymentSettings = await getDirectPaymentTransactionSettings();

  // Need to use a Live API to automatically get the correct ledger offset
  const prepare = await live_api.preparePayment(account.xAddress, paymentSettings, { maxLedgerVersionOffset: 5 });

  // Best practice is to sign transactions offline so we don't send our secrets over the network
  const { signedTransaction, id: transactionID } = api.sign(prepare.txJSON, account.secret);

  try {
    const { resultMessage } = await live_api.submit(signedTransaction);
    console.log(resultMessage);
  } catch (e) {
    if (e.data.resultCode === 'temREDUNDANT') {
      console.log('Done! You are trying to send money to yourself!');
      return;
    }

    console.log(JSON.stringify(e));
  }

  const spinner = ora('Waiting on validation...').start();
  const transaction = await reliableSend(live_api, transactionID, prepare.instructions.maxLedgerVersion);
  spinner.stop();

  const updatedAccount = await updateCurrentAddress();

  console.log(
    `\nSuccess! The delivered amount was ${transaction.outcome.deliveredAmount?.value} ${transaction.outcome.deliveredAmount?.currency}.`,
  );
  console.log(`Your new current balance is ${JSON.stringify(updatedAccount.xrpBalance)}`);

  await live_api.disconnect();
}

function delay(ms: number): Promise<any> {
  return new Promise((res) => setTimeout(res, ms));
}

async function reliableSend(api: RippleAPI, transactionID: string, maxLedgerVersion?: number): Promise<any> {
  await delay(3000);

  try {
    const transaction = await api.getTransaction(transactionID);
    return transaction;
  } catch (e) {
    const current_ledger = await api.getLedgerVersion();
    if (maxLedgerVersion && current_ledger < maxLedgerVersion) {
      return reliableSend(api, transactionID, maxLedgerVersion);
    }

    console.error(JSON.stringify(e));
  }

  return undefined;
}
