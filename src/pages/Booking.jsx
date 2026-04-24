import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "../constants";

/**
 * Trang đặt phòng (luồng đặt phòng).
 * Sau này sẽ nhận state/params: hotelId, roomId, checkIn, checkOut và gọi API.
 */
const Booking = () => {
  const [searchParams] = useSearchParams();
  const bookingSummary = {
    destination: searchParams.get("destination") || "Đà Nẵng",
    checkIn: searchParams.get("checkIn") || "Chưa chọn",
    checkOut: searchParams.get("checkOut") || "Chưa chọn",
    guests: searchParams.get("guests") || "2 người",
    roomType: searchParams.get("roomType") || "Deluxe",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-2">Booking Pullman</h1>
      <p className="text-gray-600 mb-8">
        Trang đặt phòng sẽ hiển thị tóm tắt đơn Pullman, form thông tin khách và bước xác nhận.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-white rounded-[28px] border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-textPrimary mb-4">Thông tin booking</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Điểm đến</div>
              <div className="mt-2 text-lg font-semibold text-textPrimary">
                {bookingSummary.destination}
              </div>
            </div>
            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Loại phòng</div>
              <div className="mt-2 text-lg font-semibold text-textPrimary">
                {bookingSummary.roomType}
              </div>
            </div>
            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Nhận phòng</div>
              <div className="mt-2 text-lg font-semibold text-textPrimary">
                {bookingSummary.checkIn}
              </div>
            </div>
            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Trả phòng</div>
              <div className="mt-2 text-lg font-semibold text-textPrimary">
                {bookingSummary.checkOut}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-[#dfd4c1] p-4 text-sm text-gray-600">
            Số khách: <span className="font-medium text-textPrimary">{bookingSummary.guests}</span>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              to={ROUTES.BOOKING_CONFIRM}
              className="bg-accent text-white font-medium px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Tiếp tục xác nhận
            </Link>
            <Link
              to={ROUTES.HOME}
              className="border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quay lại chọn phòng
            </Link>
          </div>
        </div>

        <aside className="bg-primary text-textWhite rounded-[28px] p-6 shadow-sm">
          <div className="text-sm uppercase tracking-[0.2em] text-secondary">Tạm tính</div>
          <div className="mt-3 text-3xl font-bold">2.350.000đ</div>
          <p className="mt-3 text-sm text-white/75">
            Đây là block UI minh họa cho Pullman. Bước sau có thể thay bằng tính giá thật theo
            phòng, ngày ở và dịch vụ cộng thêm.
          </p>

          <div className="mt-6 space-y-3 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Phòng {bookingSummary.roomType}</span>
              <span>1.850.000đ</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phụ thu cuối tuần</span>
              <span>350.000đ</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Thuế & phí</span>
              <span>150.000đ</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Booking;
