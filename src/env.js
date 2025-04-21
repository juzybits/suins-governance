import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "production"]),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_VITE_NETWORK: z
      .enum(["mainnet", "testnet", "devnet", "localnet"])
      .default("mainnet"),
      // only for development on localnet:
      NEXT_PUBLIC_VITE_votingPkgId: z.string(),
      NEXT_PUBLIC_VITE_governanceObjId: z.string(),
      NEXT_PUBLIC_VITE_stakingConfigId: z.string(),
      NEXT_PUBLIC_VITE_statsId: z.string(),
      NEXT_PUBLIC_VITE_coinType: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VITE_NETWORK: process.env.NEXT_PUBLIC_VITE_NETWORK,
    // only for development on localnet:
    NEXT_PUBLIC_VITE_votingPkgId: process.env.NEXT_PUBLIC_VITE_votingPkgId,
    NEXT_PUBLIC_VITE_governanceObjId: process.env.NEXT_PUBLIC_VITE_governanceObjId,
    NEXT_PUBLIC_VITE_stakingConfigId: process.env.NEXT_PUBLIC_VITE_stakingConfigId,
    NEXT_PUBLIC_VITE_statsId: process.env.NEXT_PUBLIC_VITE_statsId,
    NEXT_PUBLIC_VITE_coinType: process.env.NEXT_PUBLIC_VITE_coinType,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
