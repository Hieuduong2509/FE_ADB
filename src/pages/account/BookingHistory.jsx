import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { formatCurrency, formatDateLabel } from "../../utils";
import { getMyBookingHistoryApi, readAuthSession } from "../../utils/auth";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const session = readAuthSession();
    if (!session?.accessToken) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const response = await getMyBookingHistoryApi(session.accessToken);
        setItems(Array.isArray(response?.items) ? response.items : []);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.message || "Unable to load booking history.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadHistory();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Booking history
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-textPrimary">
              Your booking history
            </h1>
          </div>
          <Link
            to={ROUTES.HOTELS}
            className="rounded-full border border-[#d9ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
          >
            Book another stay
          </Link>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-[#e7c5bf] bg-[#fff2ee] px-4 py-3 text-sm text-[#aa4f3d]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="rounded-[24px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
              Loading booking history...
            </div>
          ) : null}

          {!isLoading && !items.length ? (
            <div className="rounded-[24px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
              You do not have any bookings yet.
            </div>
          ) : null}

          {items.map((booking) => (
            <div
              key={booking.id}
              className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-accent">
                    {booking.hotel_name}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-textPrimary">
                    {booking.room_type_name}
                  </h2>
                  <div className="mt-2 text-sm text-gray-600">
                    Booking code: {booking.booking_number}
                  </div>
                </div>
                <div className="rounded-full bg-[#17363f] px-4 py-2 text-sm font-semibold text-white">
                  {formatCurrency(booking.final_amount || 0)}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-[20px] bg-white p-4 text-sm text-gray-700">
                  {formatDateLabel(booking.checkin_date)} → {formatDateLabel(booking.checkout_date)}
                </div>
                <div className="rounded-[20px] bg-white p-4 text-sm text-gray-700">
                  Status: {booking.booking_status}
                </div>
                <div className="rounded-[20px] bg-white p-4 text-sm text-gray-700">
                  Payment: {booking.payment_status}
                </div>
              </div>

              {Array.isArray(booking.facilities) && booking.facilities.length ? (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent">Selected services</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {booking.facilities.map((facility) => (
                      <div
                        key={`${booking.id}-${facility.id}`}
                        className="rounded-full bg-[#f5ecde] px-3 py-2 text-sm text-textPrimary"
                      >
                        {facility.name} · {formatCurrency(facility.price || 0)}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BookingHistory;

