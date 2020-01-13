import test from 'ava';

import generateAddress from '../../src/api/generate-address';

test('It generates a valid testnet address', async (t) => {
  const { xAddress: x_address } = await generateAddress({});

  t.true(x_address[0] === 'T');
});

test('It generates a valid mainnet address', async (t) => {
  const { xAddress: x_address } = await generateAddress({ test: false });

  t.true(x_address[0] === 'X');
});

test('It generates a valid address using ed25519', async (t) => {
  const { xAddress: x_address } = await generateAddress({ algorithm: 'ed25519' });

  t.true(x_address[0] === 'T');
});

test('It can return the classic address', async (t) => {
  const { classicAddress: classic_address } = await generateAddress({});

  t.true(classic_address[0] === 'r');
  t.true(classic_address.length >= 25);
  t.true(classic_address.length <= 35);
});
