import { Check, RefreshCw, TicketCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { acceptBooking, getOwnerBookings } from "../../api/bookings.js";
import { getApiError } from "../../api/client.js";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { formatDate } from "../../utils/formatters.js";

export const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setBookings(await getOwnerBookings());
    } catch (err) {
      setError(getApiError(err, "Could not load bookings"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onAccept = async (id) => {
    setActionId(id);
    setError("");
    try {
      await acceptBooking(id);
      await load();
    } catch (err) {
      setError(getApiError(err, "Could not accept booking"));
    } finally {
      setActionId("");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Owner Bookings</h1>
          <p className="mt-2 text-sm text-stone-600">Requests for PGs owned by the signed-in user.</p>
        </div>
        <Button variant="secondary" onClick={load}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="rounded-lg bg-white p-8 text-center text-sm text-stone-600">Loading bookings...</div> : null}

      {!loading && bookings.length === 0 ? (
        <EmptyState icon={TicketCheck} title="No booking requests" body="Booking requests for your PG listings will appear here." />
      ) : null}

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-ink">{booking.pg?.name || "PG"}</h2>
                  <span className="rounded-md bg-mint px-2 py-1 text-xs font-semibold capitalize text-moss">{booking.status}</span>
                  <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold capitalize text-stone-700">
                    {booking.paymentStatus}
                  </span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  Student: {booking.student?.name || "Unknown"} · Move-in: {formatDate(booking.moveInDate)}
                </p>
              </div>

              <Button onClick={() => onAccept(booking.id)} disabled={booking.status === "accepted" || actionId === booking.id}>
                <Check className="h-4 w-4" />
                {actionId === booking.id ? "Accepting" : "Accept"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
