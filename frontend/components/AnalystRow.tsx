import type { Analyst } from "@/lib/mockData";

type Props = {
  analyst: Analyst;
};

export function AnalystRow({ analyst }: Props) {
  const initial = analyst.handle.slice(0, 1).toUpperCase();

  return (
    <div className="analyst-row">
      <div className="avatar">{initial}</div>
      <div className="analyst-copy">
        <strong>{analyst.handle}</strong>
        <span>{analyst.wallet}</span>
      </div>
      <div className="percent">
        <strong>{analyst.confidence}%</strong>
        <span>
          {analyst.winRate} win rate · {analyst.pnl}
        </span>
      </div>
    </div>
  );
}
