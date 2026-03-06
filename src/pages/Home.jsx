import { Link } from "react-router-dom";
import { ROUTES } from "../constants";

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/95 to-primary text-textWhite py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Đặt phòng khách sạn toàn Việt Nam
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Hệ thống đa chi nhánh. Tìm và đặt phòng nhanh chóng, giá tốt nhất.
          </p>
          <Link
            to={ROUTES.HOTELS}
            className="inline-block bg-secondary text-primary font-semibold px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Xem khách sạn
          </Link>
        </div>
      </section>

      {/* Search form placeholder */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-4xl mx-auto border border-gray-100">
          <h2 className="text-lg font-semibold text-textPrimary mb-4">Tìm kiếm phòng</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Địa điểm / Chi nhánh</label>
              <input
                type="text"
                placeholder="Thành phố hoặc tên khách sạn"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nhận phòng</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Trả phòng</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
                readOnly
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full bg-accent text-white font-medium py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Form tìm kiếm sẽ được kết nối logic ở bước sau.</p>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Vì sao chọn chúng tôi?</h2>
          <p className="text-gray-600">
            Hệ thống đặt phòng tập trung cho nhiều chi nhánh khách sạn trên toàn quốc.
            Đặt phòng dễ dàng, xác nhận nhanh, hỗ trợ 24/7.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
