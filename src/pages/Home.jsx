import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";

const featuredHotels = [
  {
    id: "pullman-danang-beach-resort",
    name: "Pullman Danang Beach Resort",
    location: "Đà Nẵng",
    price: "2.850.000đ",
    tag: "View biển",
    desc: "Khu nghỉ dưỡng sát biển với hồ bơi lớn, không gian sang trọng và buffet sáng cao cấp.",
  },
  {
    id: "pullman-saigon-centre",
    name: "Pullman Saigon Centre",
    location: "TP. Hồ Chí Minh",
    price: "3.250.000đ",
    tag: "Trung tâm",
    desc: "Lựa chọn phù hợp cho khách công tác, hội nghị và lịch trình ngay trung tâm thành phố.",
  },
  {
    id: "pullman-hanoi",
    name: "Pullman Hanoi",
    location: "Hà Nội",
    price: "2.650.000đ",
    tag: "Phổ biến",
    desc: "Thiết kế hiện đại, phù hợp cho chuyến đi cuối tuần hoặc lưu trú doanh nhân.",
  },
];

const highlights = [
  "Chỉ tập trung cho một brand duy nhất là Pullman để giao diện nhất quán hơn",
  "Cho phép chọn điểm đến Pullman, ngày ở và loại phòng ngay trên trang chủ",
  "Chuyển thẳng sang bước booking trước khi tích hợp dữ liệu thật",
];

const quickStats = [
  { value: "3", label: "Khách sạn Pullman mẫu" },
  { value: "4.8/5", label: "Điểm trải nghiệm giả lập" },
  { value: "24/7", label: "Hỗ trợ đặt phòng" },
];

const Home = () => {
  const navigate = useNavigate();
  const today = new Date();
  const defaultCheckIn = today.toISOString().split("T")[0];
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  const defaultCheckOut = nextDay.toISOString().split("T")[0];

  const [bookingForm, setBookingForm] = useState({
    destination: "Đà Nẵng",
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    guests: "2 người",
    roomType: "Deluxe",
  });

  const handleFieldChange = (field) => (event) => {
    setBookingForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      destination: bookingForm.destination,
      checkIn: bookingForm.checkIn,
      checkOut: bookingForm.checkOut,
      guests: bookingForm.guests,
      roomType: bookingForm.roomType,
    });

    navigate(`${ROUTES.BOOKING}?${params.toString()}`);
  };

  return (
    <div className="overflow-hidden">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(235,203,144,0.34),_transparent_20%),linear-gradient(135deg,_rgba(96,86,74,0.98),_rgba(47,42,36,0.95))]" />
        <div className="container mx-auto grid gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-20">
          <div className="text-textWhite">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm tracking-[0.18em] text-secondary uppercase">
              Pullman Booking Experience
            </span>
            <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              Đặt phòng Pullman cho kỳ nghỉ và công tác với một luồng booking gọn, sang và rõ ràng.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 md:text-lg">
              Trang chủ hiện được định hướng lại cho đúng một thương hiệu Pullman, với form chọn
              nhanh, các khách sạn nổi bật và nút đi thẳng sang bước đặt phòng.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(ROUTES.BOOKING)}
                className="rounded-full bg-secondary px-6 py-3 font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f4d8a9]"
              >
                Booking ngay
              </button>
              <Link
                to={ROUTES.HOTELS}
                className="rounded-full border border-white/25 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                Xem khách sạn Pullman
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <div className="text-2xl font-bold text-secondary">{item.value}</div>
                  <div className="mt-1 text-sm text-white/70">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 top-8 hidden h-28 w-28 rounded-full bg-secondary/25 blur-2xl lg:block" />
            <form
              onSubmit={handleBookingSubmit}
              className="rounded-[28px] border border-white/10 bg-white p-5 shadow-[0_24px_80px_rgba(19,16,12,0.28)] md:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Tìm nhanh phòng Pullman
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-textPrimary">
                    Chọn khách sạn, ngày ở và chuyển sang bước booking
                  </h2>
                </div>
                <div className="hidden rounded-2xl bg-primary px-4 py-3 text-right text-textWhite md:block">
                  <div className="text-xs uppercase tracking-[0.2em] text-secondary">Khởi điểm</div>
                  <div className="text-lg font-semibold">2.650.000đ</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">Điểm đến</span>
                  <select
                    value={bookingForm.destination}
                    onChange={handleFieldChange("destination")}
                    className="w-full rounded-2xl border border-gray-200 bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>Đà Nẵng</option>
                    <option>Hà Nội</option>
                    <option>TP. Hồ Chí Minh</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">Loại phòng</span>
                  <select
                    value={bookingForm.roomType}
                    onChange={handleFieldChange("roomType")}
                    className="w-full rounded-2xl border border-gray-200 bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>Superior</option>
                    <option>Deluxe</option>
                    <option>Executive Suite</option>
                    <option>Family Room</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">Nhận phòng</span>
                  <input
                    type="date"
                    value={bookingForm.checkIn}
                    onChange={handleFieldChange("checkIn")}
                    className="w-full rounded-2xl border border-gray-200 bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">Trả phòng</span>
                  <input
                    type="date"
                    value={bookingForm.checkOut}
                    onChange={handleFieldChange("checkOut")}
                    className="w-full rounded-2xl border border-gray-200 bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-gray-600">Số khách</span>
                  <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <select
                      value={bookingForm.guests}
                      onChange={handleFieldChange("guests")}
                      className="w-full rounded-2xl border border-gray-200 bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                    >
                      <option>1 người</option>
                      <option>2 người</option>
                      <option>3 người</option>
                      <option>4 người</option>
                      <option>Gia đình 5+</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#b86506]"
                    >
                      Kiểm tra và booking
                    </button>
                  </div>
                </label>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f8f3ea] p-4 text-sm text-gray-600">
                Bạn đang chọn thử luồng UI. Khi bấm nút, hệ thống sẽ chuyển sang trang booking và
                giữ lại thông tin bằng query string để mô phỏng trải nghiệm booking của Pullman.
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
              Pullman Experience
            </p>
            <h2 className="mt-3 font-serif text-3xl text-textPrimary md:text-4xl">
              Một landing page đúng tinh thần Pullman thay vì danh sách nhiều brand lẫn nhau.
            </h2>
            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#e8dfd0] bg-white/80 p-4 text-gray-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredHotels.map((hotel) => (
              <article
                key={hotel.id}
                className="group overflow-hidden rounded-[26px] border border-[#e8dfd0] bg-white shadow-[0_14px_40px_rgba(34,27,18,0.08)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative h-52 bg-[linear-gradient(160deg,_rgba(96,86,74,0.92),_rgba(235,203,144,0.72))] p-5 text-textWhite">
                  <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-secondary">
                    {hotel.tag}
                  </div>
                  <div className="mt-16 text-sm text-white/70">{hotel.location}</div>
                  <h3 className="mt-2 text-2xl font-semibold">{hotel.name}</h3>
                </div>
                <div className="p-5">
                  <p className="min-h-[72px] text-sm leading-6 text-gray-600">{hotel.desc}</p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                        Giá từ / đêm
                      </div>
                      <div className="mt-1 text-xl font-bold text-textPrimary">{hotel.price}</div>
                    </div>
                    <Link
                      to={`${ROUTES.BOOKING}?destination=${encodeURIComponent(hotel.location)}&roomType=Deluxe&guests=${encodeURIComponent("2 người")}`}
                      className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-textWhite transition-colors group-hover:bg-accent"
                    >
                      Đặt ngay
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-[32px] bg-primary px-6 py-8 text-textWhite md:px-10 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-secondary">Sẵn sàng demo</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                Bắt đầu từ giao diện Pullman trước, rồi nối dữ liệu thật ở bước sau.
              </h2>
              <p className="mt-4 max-w-2xl text-white/75">
                Trang chủ hiện đã xoay về một brand duy nhất: chọn khách sạn Pullman, ngày ở, số
                khách, xem gợi ý chi nhánh và đi thẳng sang booking ngay.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={ROUTES.BOOKING}
                className="rounded-full bg-secondary px-6 py-3 font-semibold text-primary transition hover:bg-[#f4d8a9]"
              >
                Mở trang booking
              </Link>
              <Link
                to={ROUTES.HOTELS}
                className="rounded-full border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10"
              >
                Xem khách sạn Pullman
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
