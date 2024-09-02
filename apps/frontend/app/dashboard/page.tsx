"use client";

import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  createSmartAccountClient,
  ENTRYPOINT_ADDRESS_V07,
  walletClientToSmartAccountSigner,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import { useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
} from "viem";
import { sepolia } from "viem/chains"; // Replace this with the chain used by your application
import { useAccount, useBalance, useWalletClient } from "wagmi";

const PRIVY = "privy";

export default function DashboardPage() {
  const router = useRouter();
  const { wallets } = useWallets();
  const { address } = useAccount();
  const balance = useBalance({ address, query: { structuralSharing: false } });
  console.log("balance", balance.data);
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === PRIVY
  );
  // const account = useAccount();
  const [smartAccountClient, setSmartAccountClient] = useState<any>();
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | undefined
  >();
  const [smartAccountReady, setSmartAccountReady] = useState(false);

  const account = useAccount();
  const { data: walletClient } = useWalletClient();
  const { setActiveWallet } = useSetActiveWallet();

  const {
    ready,
    authenticated,
    user,
    createWallet,
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
  } = usePrivy();

  useEffect(() => {
    if (embeddedWallet) setActiveWallet(embeddedWallet);
  }, [embeddedWallet]);
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const createSmartWallet = async (eoa: ConnectedWallet) => {
      const eip1193provider = await eoa.getEthereumProvider();
      const privyClient = createWalletClient({
        account: eoa.address as any,
        chain: sepolia, // Replace this with the chain used by your application
        transport: custom(eip1193provider),
      });

      const customSigner = walletClientToSmartAccountSigner(privyClient);

      setSmartAccountClient(privyClient);

      // Create a viem public client for RPC calls
      const publicClient = createPublicClient({
        chain: sepolia, // Replace this with the chain of your app
        transport: http(),
      });

      const safeAccount = await signerToSafeSmartAccount(publicClient, {
        signer: customSigner,
        safeVersion: "1.4.1",
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      });
      console.log(
        `Smart account address: https://sepolia.etherscan.io/address/${safeAccount.address}`
      );

      const pimlicoPaymaster = createPimlicoPaymasterClient({
        chain: sepolia,
        transport: http(process.env.NEXT_PUBLIC_PIMLICO_PAYMASTER_URL),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      });

      const pimlicoBundler = createPimlicoBundlerClient({
        transport: http(process.env.NEXT_PUBLIC_PIMLICO_PAYMASTER_URL),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      });

      const smartAccountClient = createSmartAccountClient({
        account: safeAccount,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        chain: sepolia,
        bundlerTransport: http(process.env.NEXT_PUBLIC_PIMLICO_BUNDLER_URL, {
          timeout: 30_000, // Custom timeout
        }),
        middleware: {
          sponsorUserOperation: pimlicoPaymaster.sponsorUserOperation,
          gasPrice: async () =>
            (await pimlicoBundler.getUserOperationGasPrice()).fast,
        },
      });

      const smartAccountAddress = smartAccountClient.account?.address;
      console.log("smartAccountAddress",smartAccountAddress);

      setSmartAccountClient(smartAccountClient);
      setSmartAccountAddress(smartAccountAddress);
      setSmartAccountReady(true);
    };

    if (embeddedWallet) createSmartWallet(embeddedWallet);
  }, [embeddedWallet]);

  console.log({ embeddedWallet });

  // console.log("balancee", balance.data)

  const sendIt = async () => {
    console.log("smartAccountAddress");
    const txHash = await smartAccountClient.sendTransaction({
      to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      value: parseEther("0.000069420"),
    });

    console.log(
      `User operation included: https://sepolia.etherscan.io/tx/${txHash}`
    );
  };

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;
  const hasPrivyWallet = user?.wallet?.walletClient === PRIVY;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  return (
    <>
      <Head>
        <title>Privy Auth Demo</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        {ready && authenticated ? (
          <>
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-semibold">Privy Auth Demo</h1>
              <button
                onClick={logout}
                className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
              >
                Logout
              </button>
            </div>
            <div className="mt-12 flex gap-4 flex-wrap">
              {googleSubject ? (
                <button
                  onClick={() => {
                    unlinkGoogle(googleSubject);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Google
                </button>
              ) : (
                <button
                  onClick={() => {
                    linkGoogle();
                  }}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                >
                  Link Google
                </button>
              )}

              {twitterSubject ? (
                <button
                  onClick={() => {
                    unlinkTwitter(twitterSubject);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Twitter
                </button>
              ) : (
                <button
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                  onClick={() => {
                    linkTwitter();
                  }}
                >
                  Link Twitter
                </button>
              )}

              {discordSubject ? (
                <button
                  onClick={() => {
                    unlinkDiscord(discordSubject);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Discord
                </button>
              ) : (
                <button
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                  onClick={() => {
                    linkDiscord();
                  }}
                >
                  Link Discord
                </button>
              )}

              {email ? (
                <button
                  onClick={() => {
                    unlinkEmail(email.address);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink email
                </button>
              ) : (
                <button
                  onClick={linkEmail}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                >
                  Connect email
                </button>
              )}
              {!hasPrivyWallet && (
                <button
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                  disabled={!(ready && authenticated)}
                  onClick={createWallet}
                >
                  Create a wallet
                </button>
              )}
              <button
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                onClick={sendIt}
              >
                Send it
              </button>
              {wallet ? (
                <button
                  onClick={() => {
                    unlinkWallet(wallet.address);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink wallet
                </button>
              ) : (
                <button
                  onClick={linkWallet}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                >
                  Connect wallet
                </button>
              )}
              {phone ? (
                <button
                  onClick={() => {
                    unlinkPhone(phone.number);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink phone
                </button>
              ) : (
                <button
                  onClick={linkPhone}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                >
                  Connect phone
                </button>
              )}
            </div>

            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <textarea
              value={JSON.stringify(user, null, 2)}
              className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2"
              rows={20}
              disabled
            />
          </>
        ) : null}
      </main>
    </>
  );
}
