import { MapPin, RefreshCw, Sparkles, UsersRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getApiError } from "../../api/client.js";
import { getMatches } from "../../api/matches.js";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setMatches(await getMatches());
    } catch (err) {
      setError(getApiError(err, "Could not load matches"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Roommate Matches</h1>
          <p className="mt-2 text-sm text-stone-600">Matches use your profile, distance, and preference overlap.</p>
        </div>
        <Button variant="secondary" onClick={load}>
          <RefreshCw className="h-4 w-4" />
          Recalculate
        </Button>
      </div>

      {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="rounded-lg bg-white p-8 text-center text-sm text-stone-600">Finding compatible roommates...</div> : null}

      {!loading && matches.length === 0 ? (
        <EmptyState icon={UsersRound} title="No matches yet" body="Save your profile with latitude and longitude, then recalculate matches." />
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((match, index) => (
          <Card key={`${match.name}-${index}`} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-ink">{match.name}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
                  <MapPin className="h-4 w-4" />
                  {Number(match.distance || 0).toFixed(1)} km away
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-coral text-lg font-black text-white">
                {match.compatibility}
              </div>
            </div>

            <div className="mt-5 h-2 rounded-full bg-stone-100">
              <div className="h-2 rounded-full bg-moss" style={{ width: `${Math.min(match.compatibility, 100)}%` }} />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                <Sparkles className="h-4 w-4 text-coral" />
                Reasons
              </div>
              <div className="flex flex-wrap gap-2">
                {(match.reason || []).map((reason) => (
                  <span key={reason} className="rounded-md bg-mint px-2 py-1 text-xs font-medium text-moss">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
