import { SuiClient } from "@mysten/sui/client";
import { SUINS_ENDPOINTS } from "@/constants/endpoints";
import { SuinsClient } from "@mysten/suins";

export enum Network {
  testnet = "testnet",
  mainnet = "mainnet",
}

export const DEFAULT_NETWORK: Network = Network.testnet;

export const clients: Record<Network, SuiClient> = {
  [Network.testnet]: new SuiClient({ url: SUINS_ENDPOINTS.testnet.fullNodes }),
  [Network.mainnet]: new SuiClient({
    url: SUINS_ENDPOINTS.mainnet.fullNodes,
  }),
};

export const suinsClients: Record<Network, SuinsClient> = {
  [Network.testnet]: new SuinsClient({
    client: clients[Network.testnet],
    network: Network.testnet,
  }),
  [Network.mainnet]: new SuinsClient({
    client: clients[Network.mainnet],
    network: Network.mainnet,
  }),
};
