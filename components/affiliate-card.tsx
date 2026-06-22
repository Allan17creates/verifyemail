import { Card } from "@/components/ui/Card";

export function AffiliateCard({
  name,
  description,
  href,
}: {
  name: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <span className="text-sm font-bold text-text">{name}</span>
      <p className="text-sm text-subtext">{description}</p>
      {/* AFFILIATE: {name} - [INSERT_AFFILIATE_LINK] */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="text-sm text-accent hover:underline"
      >
        Visit {name} →
      </a>
      <span className="text-xs text-subtext">
        Partner link, we earn a commission at no cost to you
      </span>
    </Card>
  );
}
