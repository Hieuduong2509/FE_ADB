import { useParams, Link } from "react-router-dom";
import { ROUTES } from "../constants";

const HotelDetail = () => {
  const { hotelId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={ROUTES.HOTELS} className="text-accent hover:underline text-sm mb-4 inline-block">
        ← Quay lại danh sách khách sạn
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-48 md:h-64 bg-gray-100 flex items-center justify-center text-gray-400">
          Ảnh chi tiết khách sạn
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-textPrimary mb-2">
            Pullman Location: {hotelId || "—"}
          </h1>
          <p className="text-gray-600 mb-4">
            Trang chi tiết sẽ hiển thị thông tin khách sạn Pullman, loại phòng, giá theo đêm,
            tiện ích và nút booking nhanh.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={ROUTES.BOOKING}
              className="bg-accent text-white font-medium px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Đặt phòng
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        Các block tiếp theo: danh sách loại phòng, tiện nghi, bản đồ, form booking và chính sách
        riêng cho từng khách sạn Pullman.
      </div>
    </div>
  );
};

export default HotelDetail;
