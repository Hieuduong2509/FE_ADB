import { Link } from "react-router-dom";
import { getHotelDetailPath } from "../constants";

const Hotels = () => {
  const placeholderHotels = [
    { id: "pullman-hanoi", name: "Pullman Hanoi", location: "Hà Nội", branch: "City Escape" },
    {
      id: "pullman-saigon-centre",
      name: "Pullman Saigon Centre",
      location: "TP. Hồ Chí Minh",
      branch: "Business Stay",
    },
    {
      id: "pullman-danang-beach-resort",
      name: "Pullman Danang Beach Resort",
      location: "Đà Nẵng",
      branch: "Beach Retreat",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">
        Danh mục khách sạn Pullman
      </h1>
      <p className="text-gray-600 mb-8">
        Chọn một cơ sở Pullman để xem phòng, giá tham khảo và đi tiếp sang bước booking.
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
            <p className="text-sm text-gray-600">
              {hotel.location} · {hotel.branch}
            </p>
            <span className="inline-block mt-3 text-accent font-medium text-sm">Xem phòng →</span>
          </Link>
        ))}
      </div>

      <p className="text-center text-gray-500 mt-8 text-sm">
        Danh sách hiện đang là dữ liệu mẫu cho riêng brand Pullman và sẽ được lấy từ API sau.
      </p>
    </div>
  );
};

export default Hotels;
