import test from 'ava';

import { validateAddressAlias } from '../../src/prompts/generate-address-prompt';

test('It validates a valid address alias', (t) => {
  t.is(validateAddressAlias('alias'), true);
});

test('It returns an error message on being given an empty string', (t) => {
  t.is(validateAddressAlias(''), 'The address alias is a required field.');
});

test('It returns an error message on being given null', (t) => {
  t.is(validateAddressAlias(null), 'The address alias is a required field.');
});

test('It returns an error message for a string with trailing whitespace', (t) => {
  t.is(validateAddressAlias('alias '), 'The address alias cannot contain whitespace.');
});

test('It returns an error message for a string with leading whitespace', (t) => {
  t.is(validateAddressAlias(' alias'), 'The address alias cannot contain whitespace.');
});

test('It returns an error message for a string containing whitespace', (t) => {
  t.is(validateAddressAlias('a b c'), 'The address alias cannot contain whitespace.');
});
