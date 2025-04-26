"use client";

import Link from "next/link";
import { PanelRecentProposals } from "@/components/staking/PanelRecentProposals";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { ConnectWalletButton } from "../WalletConnet/ConnectWallet";

export function HomeContent() {
  return (
    <>
      <PanelHero />
      <PanelRecentProposals />
      <PanelNotes />
      <PanelFAQ />
    </>
  );
}

function PanelHero() {
  const currAcct = useCurrentAccount();
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const isLoggedOut = (!currAcct && !isConnecting) ?? isDisconnected;

  return (
    <div className="panel">
      <h1>Stake Your SuiNS Tokens & Earn Votes</h1>
      <h2>
        Participate in governance, earn rewards, and shape the future of SuiNS
      </h2>
      {isLoggedOut ? (
        <>
          <ConnectWalletButton />
        </>
      ) : (
        <>
          <Link href="/stake">Stake</Link>
          <Link href="/vote">Vote</Link>
        </>
      )}
    </div>
  );
}

function PanelNotes() {
  return (
    <div className="panel">
      <h2>Important Notes</h2>
      <ul>
        <li>
          During active governance votes, staked tokens cannot be unstaked
        </li>
        <li>Multiple staking positions can be managed independently</li>
        <li>Lock periods cannot be shortened once set</li>
        <li>Maximum lock period is 12 months</li>
      </ul>
    </div>
  );
}

function PanelFAQ() {
  return (
    <div className="panel">
      <h2>FAQ</h2>

      <h3>How does staking work?</h3>
      <div>
        <p>
          Stake your tokens with flexibility to unstake anytime (after cooldown
          period)
        </p>
        <br />
        <div>
          <h4>KEY FEATURES:</h4>
          <ul>
            <li>Start with 1:1 Votes (1 NS = 1 Vote)</li>
            <li>Earn +10% Votes every 30 days</li>
            <li>Maximum multiplier of 2.85x after 360 days</li>
            <li>3-day cooldown period for unstaking</li>
            <li>Stack multiple staking positions independently</li>
          </ul>
        </div>

        <br />
        <div>
          <h4>VOTES GROWTH TABLE:</h4>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Votes Multiplier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 (Day 1-30)</td>
                <td>1x</td>
              </tr>
              <tr>
                <td>2 (Day 31-60)</td>
                <td>1.10x</td>
              </tr>
              <tr>
                <td>3 (Day 61-90)</td>
                <td>1.21x</td>
              </tr>
              <tr>
                <td>12 (Day 331-360)</td>
                <td>2.85x</td>
              </tr>
              <tr>
                <td>13 (Day 361-390)</td>
                <td>2.85x</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr />

      <h3>How does token locking work?</h3>
      <div>
        <p>Lock your tokens for higher immediate Votes multipliers</p>

        <br />
        <div>
          <h4>KEY FEATURES:</h4>
          <ul>
            <li>Immediate Votes boost based on lock duration</li>
            <li>Up to 3x multiplier for 12-month locks</li>
            <li>Tokens convert to regular staking after lock period</li>
            <li>Create multiple locked positions with different durations</li>
          </ul>
        </div>

        <br />
        <div>
          <h4>LOCK DURATION BENEFITS:</h4>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Immediate Multiplier</th>
                <th>Additional Benefits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 Month</td>
                <td>1.10x</td>
                <td>Minimum commitment for enhanced Votes</td>
              </tr>
              <tr>
                <td>2 Months</td>
                <td>1.33x</td>
                <td>Quarterly commitment bonus</td>
              </tr>
              <tr>
                <td>6 Months</td>
                <td>1.77x</td>
                <td>Mid-term commitment with significant boost</td>
              </tr>
              <tr>
                <td>12 Months</td>
                <td>3.00x</td>
                <td>Maximum multiplier with 0.15 bonus</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr />

      <h3>Votes & rewards</h3>
      <div>
        <p>Understanding how it works</p>

        <br />
        <div>
          <h4>KEY FEATURES:</h4>
          <ul>
            <li>Each governance proposal has its own reward pool</li>
            <li>Your share of rewards is proportional to your Votes</li>
            <li>
              Rewards are distributed automatically after proposal completion
            </li>
            <li>Earned rewards can be restaked to compound your Votes</li>
          </ul>
        </div>

        <br />
        <div>
          <h4>EXAMPLE SCENARIOS:</h4>
          <table>
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Tokens Staked</th>
                <th>Lock Period</th>
                <th>Votes</th>
                <th>Reward Share</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Staking</td>
                <td>1000 NS</td>
                <td>None</td>
                <td>1000 votes</td>
                <td>1x share</td>
              </tr>
              <tr>
                <td>6mo Staking</td>
                <td>1000 NS</td>
                <td>None (6mo elapsed)</td>
                <td>1770 votes</td>
                <td>1.77x share</td>
              </tr>
              <tr>
                <td>12mo Staking</td>
                <td>1000 NS</td>
                <td>12 Months</td>
                <td>3000 votes</td>
                <td>3x share</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
