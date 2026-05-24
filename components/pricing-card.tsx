import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  smsVolume: string;
  features: string[];
}

export function PricingCard({
  title,
  price,
  smsVolume,
  features,
}: PricingCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          {title}
        </p>
        <p className="mt-4 text-4xl font-bold text-slate-900">{price}</p>
        <p className="mt-2 text-sm text-slate-500">{smsVolume}</p>

        <ul className="mt-6 space-y-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-slate-700"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
