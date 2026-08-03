import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import type { SiteContent } from "@/lib/site-overrides";

export function OfferStrip({ offers }: { offers: SiteContent["ru"]["offers"] | SiteContent["en"]["offers"] }) {
  const items = [offers.trial, offers.testDiscount, offers.referral];
  return (
    <aside className="relative z-30 mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8" aria-label={offers.title}>
      <div className="rounded-[20px] border border-[#f3a51d]/35 bg-[#fff9e8]/92 px-4 py-3 shadow-[0_12px_34px_rgba(31,45,70,0.07)] backdrop-blur sm:px-5">
        <div className="flex flex-col gap-2 text-sm font-bold text-[#42506a] lg:flex-row lg:items-center lg:gap-5">
          <p className="shrink-0 font-black text-[#9b5f08]">{offers.title}</p>
          {items.map((item) => (
            <p key={item} className="flex items-start gap-2 lg:items-center">
              <CheckCircle size={17} weight="fill" className="mt-0.5 shrink-0 text-[#087bd3] lg:mt-0" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
}
