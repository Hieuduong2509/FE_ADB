import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, getHotelDetailPath } from "../constants";
import { getTrendingHotels } from "../data/pullmanData";
import { formatCurrency } from "../utils";

const experienceNotes = [
  "Tập trung vào riêng hệ thống Pullman để cảm giác duyệt phòng liền mạch hơn.",
  "Mỗi khách sạn đều có room spotlight rõ ràng để dẫn người dùng sang bước xem phòng.",
  "Giữ flow query string đơn giản để sau này nối API và state management dễ hơn.",
];

const staySignals = [
  { value: "03", label: "chi nhánh Pullman đang được làm UI" },
  { value: "09+", label: "hạng phòng mẫu để test luồng tìm kiếm" },
  { value: "06", label: "dịch vụ cộng thêm sẵn sàng cho bước booking" },
];

const Home = () => {
  const navigate = useNavigate();
  const trendingHotels = getTrendingHotels();
  const spotlightHotels = trendingHotels.slice(0, 3);

  const today = new Date();
  const defaultCheckIn = today.toISOString().split("T")[0];
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  const defaultCheckOut = nextDay.toISOString().split("T")[0];

  const [searchForm, setSearchForm] = useState({
    destination: spotlightHotels[0]?.city || "Đà Nẵng",
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    guests: "2 người",
    roomType: "Deluxe",
  });

  const handleFieldChange = (field) => (event) => {
    setSearchForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const nextSearchParams = new URLSearchParams({
      destination: searchForm.destination,
      checkIn: searchForm.checkIn,
      checkOut: searchForm.checkOut,
      guests: searchForm.guests,
      roomType: searchForm.roomType,
      amenity: "Tất cả",
    });

    navigate(`${ROUTES.HOTELS}?${nextSearchParams.toString()}`);
  };

  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-white/40">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(145deg,_#14323a_0%,_#204c4f_36%,_#f0dfbe_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(252,246,232,0.32),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(235,203,144,0.34),_transparent_18%)]" />

        <div className="container mx-auto grid gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#f8e2b4] backdrop-blur">
              Pullman curated stays
            </div>
            <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              Trang chủ mới tập trung vào những khách sạn Pullman đang hot thay vì một danh sách
              chung chung.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
              Từ đây người dùng có thể nhìn ngay các khách sạn nổi bật, kiểm tra nhanh nhu cầu lưu
              trú và chuyển thẳng sang trang tìm kiếm có bộ lọc phòng.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={ROUTES.HOTELS}
                className="rounded-full bg-[#f8deb0] px-6 py-3 text-sm font-semibold text-[#133039] transition hover:-translate-y-0.5 hover:bg-[#fde8c4]"
              >
                Mở trang tìm kiếm
              </Link>
              <Link
                to={ROUTES.BOOKING}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Xem layout booking
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {staySignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur"
                >
                  <div className="text-3xl font-semibold text-[#f8deb0]">{signal.value}</div>
                  <div className="mt-2 text-sm leading-6 text-white/74">{signal.label}</div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="rounded-[32px] border border-white/40 bg-[rgba(252,248,241,0.95)] p-5 shadow-[0_24px_80px_rgba(9,26,30,0.24)] backdrop-blur md:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                  Quick hotel search
                </p>
                <h2 className="mt-2 max-w-lg text-2xl font-semibold leading-tight text-textPrimary">
                  Chọn nơi ở, ngày lưu trú và loại phòng để sang thẳng trang tìm kiếm.
                </h2>
              </div>
              <div className="rounded-3xl bg-[#17363f] px-4 py-3 text-white">
                <div className="text-xs uppercase tracking-[0.2em] text-[#f4d7a2]">Đang hot</div>
                <div className="mt-1 text-lg font-semibold">
                  {spotlightHotels[0]?.name || "Pullman Hotels"}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Điểm đến</span>
                <select
                  value={searchForm.destination}
                  onChange={handleFieldChange("destination")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                >
                  {trendingHotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.city}>
                      {hotel.city}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Loại phòng</span>
                <select
                  value={searchForm.roomType}
                  onChange={handleFieldChange("roomType")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                >
                  <option>Superior</option>
                  <option>Deluxe</option>
                  <option>Executive</option>
                  <option>Suite</option>
                  <option>Family</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Nhận phòng</span>
                <input
                  type="date"
                  value={searchForm.checkIn}
                  onChange={handleFieldChange("checkIn")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Trả phòng</span>
                <input
                  type="date"
                  value={searchForm.checkOut}
                  onChange={handleFieldChange("checkOut")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-600">Số khách</span>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <select
                    value={searchForm.guests}
                    onChange={handleFieldChange("guests")}
                    className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                  >
                    <option>1 người</option>
                    <option>2 người</option>
                    <option>3 người</option>
                    <option>4 người</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-2xl bg-[#183b44] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#102d34]"
                  >
                    Tìm khách sạn
                  </button>
                </div>
              </label>
            </div>

            <div className="mt-6 rounded-[24px] bg-[#f3ebdc] p-4 text-sm leading-6 text-gray-700">
              Trang này chỉ mới dựng UI nhưng đã giữ đúng flow dữ liệu để sau đó bạn có thể nối API
              thật cho bước tìm kiếm, chọn phòng và đặt dịch vụ.
            </div>
          </form>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-accent">
              Hot Pullman now
            </p>
            <h2 className="mt-3 font-serif text-3xl text-textPrimary md:text-4xl">
              Danh sách khách sạn Pullman đang được đẩy mạnh trên trang chủ.
            </h2>
          </div>
          <Link
            to={ROUTES.HOTELS}
            className="inline-flex w-fit items-center rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-white"
          >
            Xem toàn bộ kết quả tìm kiếm
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {spotlightHotels.map((hotel) => (
            <article
              key={hotel.id}
              className="overflow-hidden rounded-[30px] border border-[#e5dbc9] bg-white shadow-[0_18px_48px_rgba(27,37,37,0.08)]"
            >
              <div className="relative h-64 bg-[linear-gradient(160deg,_#1d4247_0%,_#335b56_44%,_#d5b37b_100%)] p-6 text-white">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f8deb0]">
                    {hotel.badge}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/10 px-3 py-1 text-xs">
                    {hotel.trend}
                  </span>
                </div>
                <div className="mt-16 max-w-xs">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/70">
                    {hotel.city} · {hotel.area}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold leading-tight">{hotel.name}</h3>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <p className="text-sm leading-6 text-gray-600">{hotel.tagline}</p>

                <div className="flex flex-wrap gap-2">
                  {hotel.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-[#f6efe2] px-3 py-1 text-xs font-medium text-[#17363f]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[22px] bg-[#f8f4ed] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Giá từ / đêm
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-textPrimary">
                      {formatCurrency(hotel.priceFrom)}
                    </div>
                  </div>
                  <div className="rounded-[22px] bg-[#17363f] p-4 text-white">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">
                      Rating
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{hotel.rating}/5</div>
                    <div className="mt-1 text-sm text-white/70">{hotel.reviewCount} lượt review</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`${getHotelDetailPath(hotel.id)}?roomId=${hotel.rooms[0].id}&guests=2%20ng%C6%B0%E1%BB%9Di`}
                    className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
                  >
                    Xem phòng hot
                  </Link>
                  <Link
                    to={`${ROUTES.HOTELS}?destination=${encodeURIComponent(hotel.city)}&roomType=T%E1%BA%A5t%20c%E1%BA%A3&guests=2%20ng%C6%B0%E1%BB%9Di&amenity=T%E1%BA%A5t%20c%E1%BA%A3`}
                    className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
                  >
                    Tìm trong khách sạn này
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[32px] bg-[#17363f] p-8 text-white shadow-[0_18px_48px_rgba(27,37,37,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f8deb0]">
              Design direction
            </p>
            <h2 className="mt-3 font-serif text-3xl">
              UI được xoay về cảm giác premium resort và business stay của Pullman.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/76">
              Thay vì các khối placeholder rời rạc, trang chủ giờ có hero mạnh hơn, card khách sạn
              rõ thứ bậc và CTA dẫn đúng sang trang tìm kiếm hoặc xem chi tiết phòng.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {experienceNotes.map((note) => (
              <div
                key={note}
                className="rounded-[28px] border border-[#e5dbc9] bg-white p-6 shadow-[0_12px_36px_rgba(34,27,18,0.06)]"
              >
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Note
                </div>
                <p className="mt-4 text-sm leading-7 text-gray-700">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
