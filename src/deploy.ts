import {
  createTransaction,
  ChainId,
  signWithChainweaver,
} from '@kadena/client';
import {
  composePactCommand,
  execution,
  setMeta,
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

const getSignFunction = (account: string) => {
  if (account === 'sender00')
    return signTransaction({
      publicKey: sender00Pk,
      secretKey: sender00Sk,
    });
  return signWithChainweaver;
};

export function deploy(keyset: { keys?: string[]; predicate: string }) {
  const account = keyset.keys ? `k:${keyset.keys[0]}` : 'sender00';
  const publicKey = keyset.keys ? keyset.keys[0] : sender00Pk;
  console.log(`Deploying with account: ${account}\nPublic Key: ${publicKey}`);

  return asyncPipe(
    composePactCommand(
      execution(
        `
        (namespace 'free)
        (module hello-world G
          (defcap G () true)
          (defun say-hello(name:string)
            (format "Hello, {}! ~ from: ${publicKey}" [name])
          )
         )`,
      ),
      setMeta({
        gasLimit: 100000,
        chainId: CHAIN_ID,
        senderAccount: account,
      }),
      setNetworkId(NETWORK_ID),
      addSigner(sender00Pk),
    ),
    createTransaction,
    getSignFunction(account),
    assertTransactionSigned,
    submit,
    inspect('submit'),
    listen,
    inspect('fund result'),
  )(undefined);
}
