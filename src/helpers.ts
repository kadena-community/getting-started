import { ITransactionDescriptor, IUnsignedCommand } from "@kadena/client";
import { addSignatures } from "@kadena/client";
import { ICommand } from "@kadena/client";
import { createClient, isSignedTransaction } from "@kadena/client";
import { sign } from "@kadena/cryptography-utils";

const PORT = Number(process.env.CHAINWEB_PORT || 8080);

const getClient = () =>
  createClient(
    ({ chainId, networkId }) =>
      `http://localhost:${PORT}/chainweb/0.0/${networkId}/chain/${chainId}/pact`
  );

export const submit = (tx: ICommand) => getClient().submit(tx);
export const listen = (tx: ITransactionDescriptor) => getClient().listen(tx);
export const signTransaction =
  ({ publicKey, secretKey }: { publicKey: string; secretKey: string }) =>
  async (tx: IUnsignedCommand) => {
    const { sig } = sign(tx.cmd, {
      publicKey,
      secretKey,
    });
    if (!sig) throw Error("Failed to sign transaction");
    return addSignatures(tx, { sig, pubKey: publicKey });
  };
export const assertTransactionSigned = (tx: IUnsignedCommand | ICommand) => {
  const signed = isSignedTransaction(tx);
  if (!signed) throw Error("Failed to sign transaction");
  return tx;
};

export const inspect =
  (tag: string): (<T>(data: T) => T) =>
  <T>(data: T): T => {
    console.log(tag, data);
    return data;
  };

export const asyncPipe =
  (...fns: any[]) =>
  (value: any) => {
    return fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value));
  };
