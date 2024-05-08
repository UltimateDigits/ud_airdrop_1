import { useEffect, useState } from 'react';
import {
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp';
import clsx from 'clsx';
import { useAccount } from "wagmi";
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

type TExtensionState = {
  data?: {
    accounts: InjectedAccountWithMeta[],
    defaultAccount: InjectedAccountWithMeta,
  }
  loading: boolean
  error: null | Error
}

const initialExtensionState: TExtensionState = {
  data: undefined,
  loading: false,
  error: null
};

const MANTA_PREFIX = 77;

export const Connect = () => {
  const { address, isConnected } = useAccount();

  const [state, setState] = useState<TExtensionState>(initialExtensionState);

  const handleConnect = () => {
    setState({ ...initialExtensionState, loading: true });

    web3Enable('polkadot-extension-dapp-example')
      .then((injectedExtensions) => {
        if (!injectedExtensions.length) {
          return Promise.reject(new Error('NO_INJECTED_EXTENSIONS'));
        }

        return web3Accounts();
      })
      .then((accounts) => {
        if (!accounts.length) {
          return Promise.reject(new Error('NO_ACCOUNTS'));
        }
        const defaultAccount = accounts[0];
        setState({
          error: null,
          loading: false,
          data: {
            accounts: accounts,
            defaultAccount: defaultAccount,
          }
        });
      })
      .catch((error: Error) => {
        console.error('Error', error);
        setState({ error, loading: false, data: undefined });
      });
  };

  useEffect(() => {
    const get_data = async () => {
      try {
        if (state.data?.defaultAccount) {
          // Convert to Manta Atlantic address
          const mantaAddress = encodeAddress(
            decodeAddress(state.data.defaultAccount.address),
            MANTA_PREFIX
          );
          console.log("Manta Address",mantaAddress);

          const checkRes = await fetch(`/api/user/check-polka-address`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-middleware-auth": process.env.KEY || "",
            },
            body: JSON.stringify({
              polka_address: mantaAddress,
            }),
          });

          const checkData = await checkRes.json();
          if (checkData.exists) {
            throw new Error("address is already linked");
          }

          const res = await fetch(`/api/user/${address}`);
          const userData = await res.json();

          await fetch(`/api/user/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: userData.address,
              polka_address: mantaAddress,
            }),
          });
          console.log("data", userData.address);
        }
      } catch (error: any) {
        console.error('Error with connect', error);
        alert("address is already linked with another account");
        setState({ error: error instanceof Error ? error : new Error(String(error)), loading: false, data: undefined });
      }
    };

    if (isConnected && state.data) {
      get_data();
    }
  }, [address, isConnected, state.data]);

  if (state.error) {
    return (
      <span className="text-red-500 font-bold tracking-tight">
        Error with connect: {state.error.message}
      </span>
    );
  }

  return state.data
    ? <>{beautifyAddress(state.data.defaultAccount.address)}!</>
    : <button
      disabled={state.loading}
      className={
        clsx(
          'inline-block rounded-lg px-4 py-1.5',
          'text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-amber-600',
          state.loading ? 'cursor-not-allowed bg-gradient-to-r from-violet-400 to-violet-600' : 'bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 hover:ring-violet-600'
        )
      }
      onClick={handleConnect}
    >
      {state.loading ? 'Connecting...' : 'Connect MANTA wallet'}
    </button>;
};

function beautifyAddress(address: string) {
  return `${address.slice(0, 3)}...${address.slice(-3)}`;
}
