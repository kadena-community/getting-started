import {
  createTransaction,
  ChainId,
  signWithChainweaver,
  addSignatures,
  IPactCommand,
  IUnsignedCommand,
  ICommand,
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
import { input } from '@inquirer/prompts';

const NETWORK_ID = process.env.CHAINWEB_NETWORK || 'fast-development';
const CHAIN_ID = (process.env.CHAINWEB_CHAIN || '0') as ChainId;

const sender00Pk =
  '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca';
const sender00Sk =
  '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898';

type SignFunction = (
  transaction: IUnsignedCommand,
) => Promise<ICommand | IUnsignedCommand>;

const getSignFunction = (
  account: string,
  signManually: boolean,
): SignFunction => {
  if (account === 'sender00') {
    return signTransaction({
      publicKey: sender00Pk,
      secretKey: sender00Sk,
    });
  }

  if (signManually) {
    // @ts-ignore
    return async (tx) => {
      const parsedTx: IPactCommand = JSON.parse(tx.cmd);
      // @ts-ignore pubkey is not part of the sigs array, this is needed to be able to use it in Chainweaver
      tx.sigs = [{ pubKey: parsedTx.signers[0].pubKey }];
      console.log(
        '1. To sign this transaction, open https://chainweaver.kadena.network',
      );
      console.log('2. Open the "SigBuilder" tab');
      console.log(
        '3. Copy and Paste the following transaction into the "Signature Builder" field',
      );
      console.log(`\n${JSON.stringify(tx)}\n`);
      console.log(
        `4. Make sure the "Hash" is "${tx.hash}". This ensures that you're singing the same transaction`,
      );
      console.log(
        '5. In the "Details" tab, verify that your public key is in the "Signers" section',
      );
      console.log("and you're not signing for something malicious");
      console.log('6. Click "Sign"');
      console.log(
        '7. the whole JSON and paste it here (or just value of the "sig" key-value pair)',
      );

      const txString = await input({
        message: 'Please enter the Chainweaver result, or just the signature',
        transformer(answer) {
          try {
            return answer;
          } catch (e) {
            return JSON.stringify(
              addSignatures(tx, {
                sig: answer,
                pubKey: parsedTx.signers[0].pubKey,
              }),
            );
          }
        },
      });
      return JSON.parse(txString);
    };
  } else {
    return signWithChainweaver;
  }
};

export function deploy(args: {
  keys?: string[];
  predicate: string;
  file?: string;
  signManually: boolean;
}) {
  const account = args.keys ? `k:${args.keys[0]}` : 'sender00';
  const publicKey = args.keys ? args.keys[0] : sender00Pk;
  console.log(`Deploying with account: ${account}\nPublic Key: ${publicKey}`);

  return asyncPipe(
    composePactCommand(
      execution(
        args.file ||
          `(namespace 'free)
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
      addSigner(publicKey),
    ),
    createTransaction,
    getSignFunction(account, args.signManually),
    assertTransactionSigned,
    submit,
    inspect('submit'),
    listen,
    inspect('fund result'),
  )(undefined);
}
