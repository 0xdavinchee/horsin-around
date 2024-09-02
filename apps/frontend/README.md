# Privy Auth `create-next-app` Starter

This is a template for integrating [**Privy Auth**](https://www.privy.io/) into a [NextJS](https://nextjs.org/) project. Check out the deployed app [here](https://create-next-app.privy.io/)!

This demo uses NextJS's [App Router](https://nextjs.org/docs/app). If you'd like to see an example using the [Pages Router](https://nextjs.org/docs/pages/building-your-application/routing), just change the branch of this repository to [`main`](https://github.com/privy-io/create-next-app/). 

## Setup

1. Clone this repository and open it in your terminal. 
```sh
git clone https://github.com/privy-io/create-next-app
```

2. To use the version of this demo with the [App Router](https://nextjs.org/docs/app), checkout the `app-router` branch locally:
```sh
git checkout app-router
```

3. Install the necessary dependencies (including [Privy Auth](https://www.npmjs.com/package/@privy-io/react-auth)) with `npm`.
```sh
npm i 
```

4. Initialize your environment variables by copying the `.env.example` file to an `.env.local` file. Then, in `.env.local`, [paste your Privy App ID from the console](https://docs.privy.io/guide/console/api-keys).
```sh
# In your terminal, create .env.local from .env.example
cp .env.example .env.local

# Add your Privy App ID to .env.local
NEXT_PUBLIC_PRIVY_APP_ID=<your-privy-app-id>
```

## Building locally

In your project directory, run `npm run dev`. You can now visit http://localhost:3000 to see your app and login with Privy!


## Check out:
- `components/privy-provider-wrapper.tsx` for how to wrap the `PrivyProvider` to be explicitly client-side rendered
- `app/layout.tsx` for how to use your wrapped `PrivyProvider` in your application's Root Layout
- `app/page.tsx` for how to use the `usePrivy` hook and implement a simple `login` button
- `app/dashboard/page.tsx` for how to use the `usePrivy` hook, fields like `ready`, `authenticated`, and `user`, and methods like `linkWallet` and `logout`


**Check out [our docs](https://docs.privy.io/) for more guidance around using Privy in your app!**
