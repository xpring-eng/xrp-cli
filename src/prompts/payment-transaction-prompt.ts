import * as inquirer from 'inquirer';
import { isValidXAddress } from 'ripple-address-codec';
import { xrpToDrops } from 'ripple-lib/dist/npm/common';
import { getCurrentAddress } from '../configuration';

export const PAYMENT_HELP = `
We assume you are sending from your currently selected address.
To switch addresses, type 'xrp use <address_alias>'.

Prompts:
  destination address: The X-Address you would like to send XRP.
  amount: The amount of XRP you would like to send.
`;

interface PaymentAnswers {
  destination_address: string;
  amount: number;
}

// Ask the user to specify how they want to send XRP
async function askDirectPaymentQuestions(): Promise<PaymentAnswers> {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'destination_address',
      message: 'What is the address you would like to send to?',
      validate(address): boolean | string {
        return isValidXAddress(address) || 'This does not appear to be a valid X-Address.';
      },
    },
    {
      type: 'number',
      name: 'amount',
      message: 'How much XRP would you like to send?',
    },
  ]);
}

export async function getDirectPaymentTransactionSettings() {
  const { destination_address, amount } = await askDirectPaymentQuestions();

  return {
    source: {
      address: getCurrentAddress().xAddress as string,
      amount: {
        currency: 'drops',
        value: xrpToDrops(amount),
      },
    },
    destination: {
      address: destination_address,
      minAmount: {
        currency: 'drops',
        // Only pay up to 100 drops in fees
        value: `${+xrpToDrops(amount) - 100}`,
      },
    },
  };
}
