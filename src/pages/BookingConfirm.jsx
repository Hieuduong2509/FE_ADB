import { Link } from "react-router-dom";
import { ROUTES } from "../constants";

/**
 * Trang xác nhận đặt phòng (sau khi submit form đặt phòng).
 * Sau này sẽ hiển thị mã đặt phòng, chi tiết từ API.
 */
const BookingConfirm = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-textPrimary mb-2">Đặt phòng thành công</h1>
        <p className="text-gray-600 mb-8">
          Trang xác nhận. Sẽ hiển thị mã đặt phòng và thông tin chi tiết khi đã kết nối API.
        </p>
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
