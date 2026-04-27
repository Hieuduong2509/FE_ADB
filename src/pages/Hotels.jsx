import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getHotelDetailPath } from "../constants";
import {
  amenityOptions,
  destinationOptions,
  filterHotels,
  guestOptions,
  roomTypeOptions,
} from "../data/pullmanData";
import { formatCurrency } from "../utils";

const getInitialFilters = (searchParams) => ({
  destination: searchParams.get("destination") || "Tất cả",
  checkIn: searchParams.get("checkIn") || "",
  checkOut: searchParams.get("checkOut") || "",
  guests: searchParams.get("guests") || "2 người",
  roomType: searchParams.get("roomType") || "Tất cả",
  amenity: searchParams.get("amenity") || "Tất cả",
});

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(getInitialFilters(searchParams));

  const filteredHotels = filterHotels(filters);

  const handleFieldChange = (field) => (event) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: event.target.value,
    }));
  };

  const syncFiltersToUrl = (nextFilters) => {
    const nextSearchParams = new URLSearchParams();

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) {
        nextSearchParams.set(key, value);
      }
    });

    setSearchParams(nextSearchParams);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    syncFiltersToUrl(filters);
  };

  const handleReset = () => {
    const clearedFilters = {
      destination: "Tất cả",
      checkIn: "",
      checkOut: "",
      guests: "2 người",
      roomType: "Tất cả",
      amenity: "Tất cả",
    };

    setFilters(clearedFilters);
    syncFiltersToUrl(clearedFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <section className="rounded-[34px] border border-[#dfd4c3] bg-[linear-gradient(135deg,_rgba(17,47,53,1)_0%,_rgba(33,80,82,0.98)_48%,_rgba(242,224,191,0.9)_100%)] p-6 text-white shadow-[0_22px_60px_rgba(28,34,31,0.12)] md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f8deb0]">
              Search stays
            </p>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl">
              Trang tìm kiếm mới hiển thị đúng khách sạn có loại phòng người dùng đang tìm.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
              Bộ lọc hiện chưa gọi API nhưng đã mô phỏng đủ các trường quan trọng để chuyển tiếp
              sang xem chi tiết phòng và bước booking.
            </p>
          </div>

          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur md:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/60">Điểm đến</div>
              <div className="mt-2 text-xl font-semibold">{filters.destination}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/60">Số khách</div>
              <div className="mt-2 text-xl font-semibold">{filters.guests}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/60">Kết quả</div>
              <div className="mt-2 text-xl font-semibold">{filteredHotels.length} khách sạn</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <form
          onSubmit={handleSearchSubmit}
          className="rounded-[30px] border border-[#e5dbc9] bg-white p-5 shadow-[0_18px_42px_rgba(34,27,18,0.06)] md:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Bộ lọc tìm kiếm
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-textPrimary">Lọc theo nhu cầu ở</h2>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-[#daccb9] px-4 py-2 text-sm text-gray-600 transition hover:bg-[#faf6ef]"
            >
              Reset
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Điểm đến</span>
              <select
                value={filters.destination}
                onChange={handleFieldChange("destination")}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              >
                {destinationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Nhận phòng</span>
                <input
                  type="date"
                  value={filters.checkIn}
                  onChange={handleFieldChange("checkIn")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Trả phòng</span>
                <input
                  type="date"
                  value={filters.checkOut}
                  onChange={handleFieldChange("checkOut")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Số khách</span>
              <select
                value={filters.guests}
                onChange={handleFieldChange("guests")}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              >
                {guestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Loại phòng</span>
              <select
                value={filters.roomType}
                onChange={handleFieldChange("roomType")}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              >
                {roomTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Tiện nghi mong muốn</span>
              <select
                value={filters.amenity}
                onChange={handleFieldChange("amenity")}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              >
                {amenityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
          >
            Áp dụng bộ lọc
          </button>
        </form>

        <div className="space-y-5">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <article
                key={hotel.id}
                className="overflow-hidden rounded-[30px] border border-[#e4dac8] bg-white shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
              >
                <div className="grid gap-0 xl:grid-cols-[340px_1fr]">
                  <div className="h-full min-h-[260px] bg-[linear-gradient(160deg,_#17363f_0%,_#2d5b59_48%,_#dbc18d_100%)] p-6 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f8deb0]">
                        {hotel.badge}
                      </span>
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs">
                        {hotel.trend}
                      </span>
                    </div>
                    <p className="mt-10 text-sm uppercase tracking-[0.22em] text-white/68">
                      {hotel.city} · {hotel.area}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight">{hotel.name}</h2>
                    <p className="mt-4 text-sm leading-7 text-white/76">{hotel.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {hotel.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-white/12 bg-black/10 px-3 py-1 text-xs"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                          Có {hotel.matchedRooms.length} phòng phù hợp
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                          Giá từ {formatCurrency(hotel.priceFrom)}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Rating {hotel.rating}/5 · {hotel.reviewCount} lượt review
                        </div>
                      </div>
                      <div className="rounded-[22px] bg-[#f7f1e6] px-4 py-3 text-sm text-gray-700">
                        {filters.checkIn || "Chưa chọn ngày"} {filters.checkOut ? `→ ${filters.checkOut}` : ""}
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {hotel.matchedRooms.map((room) => {
                        const detailSearchParams = new URLSearchParams({
                          roomId: room.id,
                          guests: filters.guests,
                          roomType: room.category,
                          destination: hotel.city,
                        });

                        if (filters.checkIn) {
                          detailSearchParams.set("checkIn", filters.checkIn);
                        }

                        if (filters.checkOut) {
                          detailSearchParams.set("checkOut", filters.checkOut);
                        }

                        return (
                          <div
                            key={room.id}
                            className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-accent">
                                  {room.category}
                                </div>
                                <h3 className="mt-2 text-xl font-semibold text-textPrimary">
                                  {room.name}
                                </h3>
                                <p className="mt-2 text-sm leading-7 text-gray-600">{room.intro}</p>
                              </div>

                              <div className="rounded-[22px] bg-[#17363f] px-4 py-3 text-white md:min-w-[180px]">
                                <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">
                                  Giá / đêm
                                </div>
                                <div className="mt-2 text-2xl font-semibold">
                                  {formatCurrency(room.price)}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {[room.size, room.bed, `${room.capacity} khách`, room.view]
                                .filter(Boolean)
                                .map((item) => (
                                  <span
                                    key={item}
                                    className="rounded-full bg-[#f3ebdc] px-3 py-1 text-xs font-medium text-[#17363f]"
                                  >
                                    {item}
                                  </span>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {room.amenities.slice(0, 4).map((amenity) => (
                                <span key={amenity} className="text-sm text-gray-600">
                                  • {amenity}
                                </span>
                              ))}
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <Link
                                to={`${getHotelDetailPath(hotel.id)}?${detailSearchParams.toString()}`}
                                className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
                              >
                                Xem phòng
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[30px] border border-dashed border-[#d9ccb8] bg-white p-10 text-center shadow-[0_12px_28px_rgba(34,27,18,0.05)]">
              <h2 className="text-2xl font-semibold text-textPrimary">Chưa có kết quả phù hợp</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Hãy thử đổi loại phòng, giảm yêu cầu tiện nghi hoặc mở rộng điểm đến để xem thêm
                khách sạn Pullman.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hotels;
