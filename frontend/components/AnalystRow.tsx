import type { Analyst } from "@/lib/mockData";

type Props = {
  analyst: Analyst;
  onCopy?: (analyst: Analyst) => void;
};

export function AnalystRow({ analyst, onCopy }: Props) {
  const initial = analyst.handle.slice(0, 1).toUpperCase();
  const pickLabel =
    analyst.pick === "home" ? "Home bias" : analyst.pick === "away" ? "Away bias" : "Draw bias";

  return (
    <div className="analyst-row">
      <div className="avatar">{initial}</div>
      <div className="analyst-copy">
        <strong>{analyst.handle}</strong>
        <span>{analyst.wallet}</span>
        <span className="analyst-pick">{pickLabel}</span>
      </div>
      <div className="percent">
        <strong>{analyst.confidence}%</strong>
        <span>
          {analyst.winRate} win rate · {analyst.pnl}
        </span>
        {onCopy ? (
          <button type="button" className="ghost-sm analyst-copy-btn" onClick={() => onCopy(analyst)}>
            Copy
          </button>
        ) : null}
      </div>
    </div>
  );
}
