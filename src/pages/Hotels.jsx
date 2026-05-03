import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES, getHotelDetailPath } from "../constants";
import { formatCurrency } from "../utils";
import { getClientHotelsApi } from "../utils/auth";
import {
  buildSearchParams,
  createDefaultSearchFilters,
  createSearchFiltersFromParams,
  validateStayDates,
} from "../utils/search";

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => createSearchFiltersFromParams(searchParams));
  const [searchError, setSearchError] = useState("");
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [catalogHotels, setCatalogHotels] = useState([]);

  useEffect(() => {
    setFilters(createSearchFiltersFromParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const data = await getClientHotelsApi(createDefaultSearchFilters());
        setCatalogHotels(Array.isArray(data) ? data : []);
      } catch {
        setCatalogHotels([]);
      }
    };

    void loadCatalog();
  }, []);

  useEffect(() => {
    const loadHotels = async () => {
      setIsLoading(true);
      try {
        const data = await getClientHotelsApi(filters);
        setHotels(Array.isArray(data) ? data : []);
      } catch (error) {
        setSearchError(error.message || "Không tải được khách sạn.");
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadHotels();
  }, [filters]);

  const destinationOptions = ["Tất cả", ...new Set(catalogHotels.map((hotel) => hotel.cityAddress).filter(Boolean))];
  const roomTypeOptions = [
    "Tất cả",
    ...new Set(catalogHotels.flatMap((hotel) => hotel.matchedRoomTypes?.map((roomType) => roomType.name) || [])),
  ];
  const amenityOptions = [
    "Tất cả",
    ...new Set(
      catalogHotels.flatMap(
        (hotel) =>
          hotel.matchedRoomTypes?.flatMap((roomType) => roomType.amenities || []) || [],
      ),
    ),
  ];
  const guestOptions = ["1 người", "2 người", "3 người", "4 người"];

  const handleFieldChange = (field) => (event) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: event.target.value,
    }));
    setSearchError("");
  };

  const syncFiltersToUrl = (nextFilters) => {
    setSearchParams(buildSearchParams(nextFilters));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextError = validateStayDates(filters.checkIn, filters.checkOut);
    if (nextError) {
      setSearchError(nextError);
      return;
    }
    syncFiltersToUrl(filters);
  };

  const handleReset = () => {
    const clearedFilters = createDefaultSearchFilters();
    setFilters(clearedFilters);
    setSearchError("");
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
              Kết quả giờ được lấy trực tiếp từ database và lọc theo room type còn trống.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
              Mỗi khách sạn sẽ hiển thị đúng những loại phòng còn khả dụng trong khoảng ngày ở mà
              người dùng chọn.
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
              <div className="mt-2 text-xl font-semibold">{hotels.length} khách sạn</div>
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

          {searchError ? (
            <div className="mt-4 rounded-[22px] border border-[#e7c5bf] bg-[#fff2ee] px-4 py-3 text-sm text-[#aa4f3d]">
              {searchError}
            </div>
          ) : null}

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
          >
            Áp dụng bộ lọc
          </button>
        </form>

        <div className="space-y-5">
          {isLoading ? (
            <div className="rounded-[30px] border border-dashed border-[#d9ccb8] bg-white p-10 text-center shadow-[0_12px_28px_rgba(34,27,18,0.05)]">
              Đang tải kết quả tìm kiếm...
            </div>
          ) : null}

          {!isLoading && hotels.length > 0 ? (
            hotels.map((hotel) => (
              <article
                key={hotel.id}
                className="overflow-hidden rounded-[30px] border border-[#e4dac8] bg-white shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
              >
                <div className="grid gap-0 xl:grid-cols-[340px_1fr]">
                  <div className="h-full min-h-[260px] bg-[linear-gradient(160deg,_#17363f_0%,_#2d5b59_48%,_#dbc18d_100%)] p-6 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f8deb0]">
                        {hotel.countryName}
                      </span>
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs">
                        {hotel.starRating} sao
                      </span>
                    </div>
                    <p className="mt-10 text-sm uppercase tracking-[0.22em] text-white/68">
                      {hotel.cityAddress}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight">{hotel.name}</h2>
                    <p className="mt-4 text-sm leading-7 text-white/76">{hotel.description}</p>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                          Có {hotel.matchedRoomTypes.length} loại phòng phù hợp
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                          Giá từ {formatCurrency(hotel.priceFrom)}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Tổng kỳ nghỉ từ {formatCurrency(hotel.stayTotalFrom)}
                        </div>
                      </div>
                      <div className="rounded-[22px] bg-[#f7f1e6] px-4 py-3 text-sm text-gray-700">
                        {filters.checkIn} → {filters.checkOut}
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {hotel.matchedRoomTypes.map((roomType) => {
                        const detailSearchParams = buildSearchParams({
                          ...filters,
                          destination: hotel.cityAddress,
                          roomType: roomType.name,
                          roomTypeId: roomType.roomTypeId,
                        });
                        const bookingSearchParams = buildSearchParams({
                          ...filters,
                          hotelId: hotel.id,
                          roomType: roomType.name,
                          roomTypeId: roomType.roomTypeId,
                        });

                        return (
                          <div
                            key={roomType.roomTypeId}
                            className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-accent">
                                  {roomType.availableRoomCount} phòng còn trống
                                </div>
                                <h3 className="mt-2 text-xl font-semibold text-textPrimary">
                                  {roomType.name}
                                </h3>
                                <p className="mt-2 text-sm leading-7 text-gray-600">
                                  {roomType.servicesText || "Room type đang dùng dữ liệu thật từ DB."}
                                </p>
                              </div>

                              <div className="rounded-[22px] bg-[#17363f] px-4 py-3 text-white md:min-w-[180px]">
                                <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">
                                  Trung bình / đêm
                                </div>
                                <div className="mt-2 text-2xl font-semibold">
                                  {formatCurrency(roomType.averageNightlyRate)}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {roomType.amenities.slice(0, 4).map((amenity) => (
                                <span
                                  key={amenity}
                                  className="rounded-full bg-[#f3ebdc] px-3 py-1 text-xs font-medium text-[#17363f]"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <Link
                                to={`${getHotelDetailPath(hotel.id)}?${detailSearchParams.toString()}`}
                                className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
                              >
                                Xem chi tiết
                              </Link>
                              <Link
                                to={`${ROUTES.BOOKING}?${bookingSearchParams.toString()}`}
                                className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
                              >
                                Chọn phòng này
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
          ) : null}

          {!isLoading && !hotels.length ? (
            <div className="rounded-[30px] border border-dashed border-[#d9ccb8] bg-white p-10 text-center shadow-[0_12px_28px_rgba(34,27,18,0.05)]">
              <h2 className="text-2xl font-semibold text-textPrimary">Chưa có kết quả phù hợp</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Hãy thử đổi điểm đến, loại phòng hoặc tiện nghi để xem thêm khách sạn.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Hotels;
