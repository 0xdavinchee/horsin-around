"use client";

import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia } from "viem/chains";
import { http } from "wagmi";
// Replace this with your app's required chains
import { PrivyProvider } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export const config = createConfig({
  chains: [sepolia], // Pass your required chains as an array
  transports: {
    [sepolia.id]: http(),
    // For each of your required chains, add an entry to `transports` with
    // a key of the chain's `id` and a value of `http()`
  },
});

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = new QueryClient();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      onSuccess={() => router.push("/dashboard")}
      config={{
        supportedChains: [sepolia],
        embeddedWallets: {
          createOnLogin: "users-without-wallets", // defaults to 'off'
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
