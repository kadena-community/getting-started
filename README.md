# 10 minute quickstart with Kadena

Welcome to the world of Kadena, a powerful blockchain platform that combines
scalability with simplicity. In this guide, we'll walk you through the essential
steps to kickstart your journey with Kadena. Whether you're a seasoned
blockchain developer or a newcomer to the space, you'll find the process
intuitive and efficient.

Here we run Devnet and deploy a "Hello World" smart-contract on Kadena
blockchain in 10 minutes

## Start fat-container `kadena/devnet`

1. Create docker volume

   ```jsx
   docker volume create kadena_devnet
   ```

2. start kadena-devnet fat-container

   ```jsx
   docker run -it -p 8080:8080 -v kadena_devnet:/data --name devnet kadena/devnet
   # restart with
   docker start devnet
   ```

## Monitor the blockchain

In the fat-container we expose an explorer that connects to the devnet

1. Go to http://localhost:8080/explorer/

Here you can see the blocks that are mined, and the transactions that are
executed

In Kadena a block is mined every 30 seconds. However, to optimize development
workflow, the devnet mines a block in 5 seconds.

## Chainweaver wallet

1. Download and install Chainweaver:
   https://github.com/kadena-io/chainweaver/releases  
   Or use the web version: https://chainweaver.kadena.network
2. Launch Chainweaver and create your mnemonic key

## Add devnet to Chainweaver

1. Click "Settings" tab in the bottom left
2. Select "Network"
3. Fill in the network name: "Devnet"
4. Open the network you created "> Devnet"
5. Add a node: "127.0.0.1:8080", the red dot on the right, should become green
   now.

## Create keys to sign transactions

1. Go to "Keys" on the left and click "+ Generate" on the top-right. This is
   your first key-pair.
2. To show the balance of this account, click "Add k: Account".
3. Go back to the "Accounts" tab on the left. Notice that the "Balance (KDA)"
   says "Does not exist".

In Kadena, keys and accounts do not represent the same thing. An account needs
to be created before it can be used.

## Fund your account

> Note: we use [NodeJS](https://nodejs.dev/en/learn/how-to-install-nodejs/)
> (personal recommendation to
> [install with `n`](https://github.com/tj/n#readme)) and run `npm install` in
> the root of this project
>
> 1. install nodejs
> 2. run `npm install`

Before we can create an account, you need to have KDA to pay for the gas-fees
(transaction fee).

We can gain KDA by funding it from a pre-installed "devnet" account called
"sender00".

In this process, we’ll submit a transaction that creates an account based on the
"keys" and "predicate" that you supply. The combination of `keys` + `predicate`
makes a `keyset`, which is used to `guard` your account.

1. Send money from "sender00" to your account. Copy your account name from the
   "Accounts" tab and fill it in the command

   ```jsx
   npm run start -- fund --keys "<your-key>" --predicate "keys-all"
   ```

2. Open the Block Explorer http://localhost:8080/explorer/ to monitor the
   transaction
3. In Chainweaver, click "Refresh" to update the account balances

## Deploy a contract

We're going to deploy a simple `hello world` smart contract using "sender00". To
do this simply run:

```
npm run start -- deploy
```

You can also deploy the same `hello world` contract using your newly created
account:

```
npm run start -- deploy --keys "<your-key>" --predicate "keys-all"
```

Now we can try to execute the `say-hello` function using chainweaver. First
navigate to the contracts tab:

![image](https://github.com/kadena-community/getting-started/assets/1508400/0f2d192f-6a75-4a9b-ba5d-e87ff51edaf4)

Then click on the module explorer from the right side tab:

![image](https://github.com/kadena-community/getting-started/assets/1508400/af74e8e4-199e-4f6b-a199-f5f2f1ac9ec5)

Then search for the `hello-world` contract:

![image](https://github.com/kadena-community/getting-started/assets/1508400/5b253553-8e3c-43a7-8e23-a0309675d5d7)

View the contract to see all available methods:

![image](https://github.com/kadena-community/getting-started/assets/1508400/8b360ae2-260d-4eed-8c6f-f742d427d49d)

Click on `call` to see the necessary arguments:

![image](https://github.com/kadena-community/getting-started/assets/1508400/808ddb40-cab9-4eba-aa15-35d823f020a8)

Notice how the raw command is prepared by chainweaver, make sure to fill in
`sender00` for the account. If you don't fill in any account, chainweaver will
warn you that no account has been selected for the transaction:

![image](https://github.com/kadena-community/getting-started/assets/1508400/02677a89-17ed-4a83-812b-b2fc40896018)

Then click on preview and ignore the
`A 'Gas Payer' has not been selected for this transaction` message. We are only
performing a lookup and will not be submitting this transaction. Scrolll all the
way down and see the result of the method:

![image](https://github.com/kadena-community/getting-started/assets/1508400/c2c3eba1-a87b-48c6-b01a-4ab5b2e0b643)

Now let's copy the `Raw Command` and close the window. Paste the `Raw Command`
in the editor:

![image](https://github.com/kadena-community/getting-started/assets/1508400/d205e7aa-1b66-4fa9-8c00-2c1560c9bb2a)

Click on `Deploy` and fill in account to `sender00` and click on Preview once
more:

![image](https://github.com/kadena-community/getting-started/assets/1508400/7e76d1f5-188e-4631-8c4b-ba5047bc350d)

NOTE: if you do not fill in any account you will be presented with the following
message:

![image](https://github.com/kadena-community/getting-started/assets/1508400/3747b8a8-3c34-496d-8da4-5933d0fc83a4)
