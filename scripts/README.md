## Setup

```shell
cd scripts/
cp .env.example .env.local
# Edit .env.local
```

## Usage

```shell
# Find addresses who voted on proposals 1-5, and how much NS they voted with.
bun src/fetch-events.ts > data/events.json

# Analyze the output of `fetch-events.ts`.
bun src/analyze-events.ts data/events.json

# Generate airdrop config from voter data and predefined rewards.
bun src/generate-airdrop-config.ts data/events.json > data/airdrop-config.json

# Analyze the output of `generate-airdrop-config.ts`.
bun src/analyze-airdrop-config.ts data/airdrop-config.json

# Airdrop staked NS to users according to given config.
bun src/execute-airdrop.ts -n localnet -c data/airdrop-config.json -o data/airdrop-output.json
```
