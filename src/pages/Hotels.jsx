import { Link } from "react-router-dom";
import { getHotelDetailPath } from "../constants";

/**
 * Trang danh sách khách sạn (đa chi nhánh).
 * Sau này sẽ lấy data từ API.
 */
const Hotels = () => {
  // Placeholder danh sách mẫu
  const placeholderHotels = [
    { id: "hanoi-1", name: "Khách sạn Hà Nội Center", location: "Hà Nội", branch: "Chi nhánh 1" },
    { id: "hcm-1", name: "Khách sạn Sài Gòn Riverside", location: "TP. Hồ Chí Minh", branch: "Chi nhánh 2" },
    { id: "danang-1", name: "Khách sạn Đà Nẵng Beach", location: "Đà Nẵng", branch: "Chi nhánh 3" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">
        Khách sạn đa chi nhánh
      </h1>
      <p className="text-gray-600 mb-8">
        Chọn chi nhánh khách sạn để xem phòng trống và đặt phòng.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderHotels.map((hotel) => (
          <Link
            key={hotel.id}
            to={getHotelDetailPath(hotel.id)}
            className="block bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-accent/30 transition-all"
          >
            <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">
              Ảnh khách sạn
            </div>
            <h2 className="font-semibold text-textPrimary mb-1">{hotel.name}</h2>
            <p className="text-sm text-gray-600">{hotel.location} · {hotel.branch}</p>
            <span className="inline-block mt-3 text-accent font-medium text-sm">
              Xem phòng →
            </span>
          </Link>
        ))}
      </div>

      <p className="text-center text-gray-500 mt-8 text-sm">
        Danh sách sẽ được lấy từ API (MongoDB/PostgreSQL) ở giai đoạn sau.
      </p>
    </div>
  );
};

export default Hotels;
