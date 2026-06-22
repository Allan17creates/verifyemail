export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="w-full">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div
          className="h-full bg-accent transition-all duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-subtext">
        {value} / {max} processed ({pct}%)
      </p>
    </div>
  );
}
