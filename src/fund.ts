import { createTransaction, ChainId } from '@kadena/client';
import {
  composePactCommand,
  execution,
  setMeta,
  addData,
  addSigner,
  setNetworkId,
} from '@kadena/client/fp';
import {
  assertTransactionSigned,
  asyncPipe,
  inspect,
  listen,
  signTransaction,
  submit,
} from './helpers';

const NETWORK_ID = process.env.CHAINWEB_NETWORK || 'fast-development';
const CHAIN_ID = (process.env.CHAINWEB_CHAIN || '0') as ChainId;

const sender00Pk =
  '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca';
const sender00Sk =
  '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898';

export function fund(keyset: { keys: string[]; predicate: string }) {
  const account = `k:${keyset.keys[0]}`;
  const publicKey = keyset.keys[0];
  console.log(`Funding account:  ${account}\nPublic Key: ${publicKey}`);

  return asyncPipe(
    composePactCommand(
      execution(
        `(coin.transfer-create "sender00" "${account}" (read-keyset 'ks) 100.0)`
      ),
      setMeta({
        gasLimit: 1000,
        chainId: CHAIN_ID,
        senderAccount: 'sender00',
      }),
      setNetworkId(NETWORK_ID),
      addData('ks', { keys: [publicKey], pred: 'keys-all' }),
      addSigner(sender00Pk, (withCap) => [
        withCap('coin.GAS'),
        withCap('coin.TRANSFER', 'sender00', account, 100),
      ])
    ),
    createTransaction,
    signTransaction({
      publicKey: sender00Pk,
      secretKey: sender00Sk,
    }),
    assertTransactionSigned,
    submit,
    inspect('submit'),
    listen,
    inspect('fund result')
  )(undefined);
}
