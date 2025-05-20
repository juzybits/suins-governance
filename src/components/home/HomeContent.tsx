"use client";

import { HomeBg } from "./home-bg";
import { HomeRecentProposals } from "./home-recent-proposals";
import { HomeNotes } from "./home-notes";
import { HomeFAQ } from "./home-faq";
import { HomeHero } from "./home-hero";

export function HomeContent() {
  return (
    <main className="flex flex-col items-center gap-xl">
      <HomeBg />
      <HomeHero />
      <HomeRecentProposals />
      <HomeNotes />
      <HomeFAQ />
    </main>
  );
}
