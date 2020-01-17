import { RippleAPI } from 'ripple-lib';

const api = new RippleAPI({
  // The Websocket address for XRP Testnet
  // https://xrpl.org/xrp-testnet-faucet.html
  server: 'wss://s.altnet.rippletest.net:51233',
});

api.on('error', (code, message) => {
  console.error(`${code}: ${message}`);
});

api.on('connected', () => {
  // console.log('Connected to the XRP Testnet.');
});

api.on('disconnected', (code) => {
  if (code === 1000 || code === '1000') {
    // console.log('Disconnected from the XRP Testnet.');
  } else {
    console.log(`Disconnected from the XRP Testnet, with code ${code}. This may have been an error.`);
  }
});

export default api;
