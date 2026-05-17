import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "../constants";
import { formatCurrency, formatDateLabel } from "../utils";
import { getBookingPaymentStatusApi } from "../utils/auth";

const STATUS_LABELS = {
  PAID: "Payment successful",
  PENDING: "Waiting for payment",
  FAILED: "Payment failed",
  CANCELLED: "Payment cancelled",
  CONFIRMED: "Booking confirmed",
};

const statusTone = (status) => {
  switch (status) {
    case "PAID":
    case "CONFIRMED":
      return {
        badge: "bg-green-100 text-green-700",
        card: "border-green-200 bg-green-50",
      };
    case "FAILED":
    case "CANCELLED":
      return {
        badge: "bg-red-100 text-red-700",
        card: "border-red-200 bg-red-50",
      };
    case "PENDING":
    default:
      return {
        badge: "bg-amber-100 text-amber-700",
        card: "border-amber-200 bg-amber-50",
      };
  }
};

const BookingConfirm = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const initialStatus = searchParams.get("status") || "PENDING";
  const method = searchParams.get("method") || "vnpay";
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeoutId = null;
    let isCancelled = false;

    const loadStatus = async () => {
      if (!bookingId) {
        setErrorMessage("Missing bookingId to track payment status.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getBookingPaymentStatusApi(bookingId);
        if (isCancelled) {
          return;
        }

        setPaymentInfo(data);
        setErrorMessage("");
        setIsLoading(false);

        const currentStatus = String(data?.payment_status || "").toUpperCase();
        if (currentStatus === "PENDING" && method === "vnpay") {
          timeoutId = window.setTimeout(() => {
            void loadStatus();
          }, 3000);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setErrorMessage(error.message || "Unable to fetch payment status.");
        setIsLoading(false);
      }
    };

    void loadStatus();

    return () => {
      isCancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [bookingId, method]);

  const normalizedStatus = useMemo(() => {
    const backendStatus = String(paymentInfo?.payment_status || "").toUpperCase();
    return backendStatus || String(initialStatus || "PENDING").toUpperCase();
  }, [initialStatus, paymentInfo]);

  const tone = statusTone(normalizedStatus);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Booking payment result
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-textPrimary">
                {STATUS_LABELS[normalizedStatus] || normalizedStatus}
              </h1>
            </div>
            <div className={`rounded-full px-4 py-2 text-sm font-semibold ${tone.badge}`}>
              {normalizedStatus}
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-[#f0c8c0] bg-[#fff3f0] px-4 py-3 text-sm text-[#9f4738]">
              {errorMessage}
            </div>
          ) : null}

          <div className={`mt-6 rounded-[24px] border p-5 ${tone.card}`}>
            <div className="text-sm text-gray-600">
              {method === "vnpay"
                ? normalizedStatus === "PENDING"
                  ? "Waiting for VNPay callback. This page updates automatically."
                  : "The result below is synced from the backend after callback/IPN processing."
                : "Booking has been created with pay-at-hotel method."}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Booking code</div>
              <div className="mt-2 text-lg font-semibold text-textPrimary">
                {paymentInfo?.booking_number || bookingId || "N/A"}
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-400">Method</div>
              <div className="mt-2 text-sm font-semibold text-textPrimary">
                {paymentInfo?.payment_method || method}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Amount</div>
              <div className="mt-2 text-lg font-semibold text-textPrimary">
                {formatCurrency(Number(paymentInfo?.amount ?? paymentInfo?.final_amount ?? 0))}
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-400">Status booking</div>
              <div className="mt-2 text-sm font-semibold text-textPrimary">
                {paymentInfo?.booking_status || "N/A"}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-[#ece2d3] bg-white p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Stay details</div>
            <div className="mt-3 text-lg font-semibold text-textPrimary">
              {paymentInfo?.hotel_name || "Hotel"}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {paymentInfo?.room_type_name || "Room type"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              {paymentInfo?.checkin_date ? formatDateLabel(paymentInfo.checkin_date) : "--"}
              {" → "}
              {paymentInfo?.checkout_date ? formatDateLabel(paymentInfo.checkout_date) : "--"}
            </div>
          </div>

          {isLoading ? (
            <div className="mt-6 text-sm text-gray-500">Syncing payment status...</div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <Link
              to={ROUTES.BOOKING_HISTORY}
              className="rounded-2xl bg-[#17363f] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#102d34]"
            >
              View booking history
            </Link>
            <Link
              to={ROUTES.HOME}
              className="rounded-2xl border border-[#d9ccb8] px-6 py-3 text-center text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;

