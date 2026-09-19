import Image from "next/image";
import { SITE } from "@/content/site";

/** The logo mark and wordmark, linking home. The image is decorative: the wordmark names the link. */
export function HomeLink() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-2.5 justify-self-start rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
    >
      <Image src="/brand/fluxiq-logo.webp" alt="" width={32} height={32} className="size-8 rounded-full" />
      <span className="font-display text-lg font-bold tracking-tight text-white">
        {SITE.wordmark.lead}
        <span className="bg-linear-to-r from-cyan-300 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          {SITE.wordmark.accent}
        </span>
      </span>
    </a>
  );
}
