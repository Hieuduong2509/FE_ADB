import { Link } from "react-router-dom";
import { ROUTES } from "../constants";

/**
 * Trang đặt phòng (luồng đặt phòng).
 * Sau này sẽ nhận state/params: hotelId, roomId, checkIn, checkOut và gọi API.
 */
const Booking = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-2">Đặt phòng</h1>
      <p className="text-gray-600 mb-8">
        Trang đặt phòng sẽ hiển thị tóm tắt đơn, form thông tin khách và bước xác nhận.
      </p>

      <div className="max-w-xl bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-textPrimary mb-4">Thông tin đặt phòng (placeholder)</h2>
        <ul className="space-y-2 text-sm text-gray-600 mb-6">
          <li>• Khách sạn / Chi nhánh: (sẽ truyền từ trang chi tiết)</li>
          <li>• Loại phòng: (sẽ chọn từ danh sách phòng)</li>
          <li>• Nhận phòng / Trả phòng: (từ form tìm kiếm)</li>
        </ul>
        <div className="flex gap-3">
          <Link
            to={ROUTES.BOOKING_CONFIRM}
            className="bg-accent text-white font-medium px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Tiếp tục xác nhận
          </Link>
          <Link
            to={ROUTES.HOTELS}
            className="border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Booking;
