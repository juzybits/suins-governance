# Staked NS Retroactive Airdrop Tools

CLI tools to find early proposal voters, calculate their rewards, and execute the airdrop.

## Setup

```shell
cd scripts/
bun i
cp .env.example .env.local # and edit
```

## Usage

```shell
# 1. Find addresses who voted on proposals 1-5, and how much NS they voted with.
bun src/fetch-events.ts > data/events.json

# 2. (optional) Review the output of `fetch-events.ts`.
bun src/analyze-events.ts data/events.json

# 3. Generate airdrop config from voter data and predefined rewards.
bun src/generate-airdrop-config.ts data/events.json > data/airdrop-config.json

# 4. (optional) Review the output of `generate-airdrop-config.ts`.
bun src/analyze-airdrop-config.ts data/airdrop-config.json

# 5. Airdrop staked NS to users according to given config. Must hold `StakingAdminCap`.
bun src/execute-airdrop.ts -n localnet -c data/airdrop-config.json -o data/airdrop-output.json
```

## Notes

On localnet (1000 MIST gas price), it costs ~0.0025 SUI to airdrop each staked NS object, that's 830 SUI to create and transfer all 326,548 `Batch` objects. It took about 10 minutes to complete the airdrop:

```
// data/airdrop-output.json:
{
  "status": "success",
  "network": "localnet",
  "startTime": "2025-08-12T13:31:35",
  "endTime": "2025-08-12T13:41:32",
  "totalBatches": 326548,
  "totalAmount": "4998896508000",
  "txRequired": 640,
  "nsBalanceBefore": "500000000000000",
  "nsBalanceAfter": "495001103492000",
  "nsBalanceUsed": "4998896508000",
  "suiBalanceBefore": "999834439040",
  "suiBalanceAfter": "169021896512",
  "suiBalanceUsed": "830812542528",
  ...
```
