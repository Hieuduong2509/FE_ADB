import { formatCurrency, formatDateLabel } from "../../../utils";

const BookingHistorySection = ({ bookings, isLoading, errorMessage }) => (
  <section
    id="booking-history"
    className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
  >
    <div>
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Booking history
      </div>
      <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
        Lịch sử đặt phòng toàn hệ thống
      </h2>
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

      {!isLoading && !bookings.length ? (
        <div className="rounded-[24px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
          Chưa có booking nào trong hệ thống.
        </div>
      ) : null}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-accent">
                {booking.hotel_name}
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-textPrimary">
                {booking.room_type_name}
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                {booking.first_name} {booking.last_name} · {booking.customer_email}
              </div>
            </div>
            <div className="rounded-full bg-[#17363f] px-4 py-2 text-sm font-semibold text-white">
              {formatCurrency(booking.final_amount || 0)}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div className="rounded-[20px] bg-white p-4 text-sm text-gray-700">
              {formatDateLabel(booking.checkin_date)} → {formatDateLabel(booking.checkout_date)}
            </div>
            <div className="rounded-[20px] bg-white p-4 text-sm text-gray-700">
              Booking: {booking.booking_status}
            </div>
            <div className="rounded-[20px] bg-white p-4 text-sm text-gray-700">
              Payment: {booking.payment_status}
            </div>
            <div className="rounded-[20px] bg-white p-4 text-sm text-gray-700">
              {booking.booking_number}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default BookingHistorySection;

