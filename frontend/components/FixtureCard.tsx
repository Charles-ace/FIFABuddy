import type { FootballFixture } from "@/lib/football";

type Props = {
  fixture: FootballFixture;
  active?: boolean;
  onSelect?: () => void;
  poolLabel?: string;
};

export function FixtureCard({ fixture, active, onSelect, poolLabel = "48.2K USDT" }: Props) {
  const liveHome = fixture.liveScore?.home;
  const liveAway = fixture.liveScore?.away;
  const score =
    typeof liveHome === "number" && typeof liveAway === "number"
      ? `${liveHome} - ${liveAway}`
      : fixture.score
        ? `${fixture.score[0]} - ${fixture.score[1]}`
        : "v";

  const statusLabel =
    fixture.status === "LIVE"
      ? `LIVE ${fixture.liveScore?.minute ?? fixture.minute ?? ""}'`
      : fixture.status;

  const centerCaption =
    fixture.status === "LIVE" ? "In play" : "Pre-match";

  return (
    <button
      type="button"
      className={`fixture-card ${active ? "fixture-card-active" : ""}`}
      onClick={onSelect}
    >
      <div className="fixture-top">
        <div className="fixture-meta">
          <strong>{fixture.round.toUpperCase()}</strong>
          <span>
            {fixture.date} · {fixture.time} · {fixture.venue}
          </span>
        </div>
        <div className={`status-pill status-pill-${fixture.status.toLowerCase()}`}>
          <span className="status-dot" />
          {statusLabel}
        </div>
      </div>

      <div className="fixture-players">
        <div className="team">
          <strong>{fixture.home}</strong>
          <span>Home side</span>
        </div>
        <div className="score-box">
          <strong>{score}</strong>
          <span>{centerCaption}</span>
        </div>
        <div className="team team-away">
          <strong>{fixture.away}</strong>
          <span>Away side</span>
        </div>
      </div>

      <div className="fixture-foot">
        <div className="mini-odds">
          <span className="odd">1 {fixture.odds.home}</span>
          <span className="odd">X {fixture.odds.draw}</span>
          <span className="odd">2 {fixture.odds.away}</span>
        </div>
        <span className="pool-depth">Pool depth: {poolLabel}</span>
      </div>
    </button>
  );
}
