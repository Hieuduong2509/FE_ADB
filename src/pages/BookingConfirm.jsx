import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "../constants";
import { formatCurrency, formatDateLabel } from "../utils";

/**
 * Trang xác nhận đặt phòng (sau khi submit form đặt phòng).
 * Sau này sẽ hiển thị mã đặt phòng, chi tiết từ API.
 */
const BookingConfirm = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const hotelName = searchParams.get("hotelName");
  const roomTypeName = searchParams.get("roomTypeName");
  const totalAmount = Number(searchParams.get("totalAmount") || 0);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-textPrimary mb-2">Đặt phòng thành công</h1>
        <p className="text-gray-600 mb-8">
          Booking đã được tạo trên backend.
        </p>
        <div className="mb-8 rounded-xl border border-[#e5dbc9] bg-white p-5 text-left shadow-sm">
          <div className="text-sm text-gray-600">Mã booking: {bookingId || "N/A"}</div>
          <div className="mt-2 text-lg font-semibold text-textPrimary">{hotelName}</div>
          <div className="mt-1 text-sm text-gray-600">{roomTypeName}</div>
          <div className="mt-3 text-sm text-gray-600">
            {formatDateLabel(checkIn)} → {formatDateLabel(checkOut)}
          </div>
          <div className="mt-3 text-lg font-semibold text-textPrimary">
            Tổng tiền: {formatCurrency(totalAmount)}
          </div>
        </div>
        <Link
          to={ROUTES.HOME}
          className="inline-block bg-accent text-white font-medium px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirm;
