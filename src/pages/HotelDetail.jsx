import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ROUTES, getHotelDetailPath } from "../constants";
import { formatCurrency } from "../utils";
import { getClientHotelDetailApi } from "../utils/auth";
import { buildSearchParams, createSearchFiltersFromParams } from "../utils/search";

const HotelDetail = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const filters = useMemo(
    () => createSearchFiltersFromParams(searchParams),
    [searchParamsKey],
  );
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadHotel = async () => {
      setIsLoading(true);
      try {
        const data = await getClientHotelDetailApi(hotelId, filters);
        setHotel(data);
        setErrorMessage("");
      } catch (error) {
        setHotel(null);
        setErrorMessage(error.message || "Không tải được chi tiết khách sạn.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadHotel();
  }, [filters, hotelId, searchParamsKey]);

  const selectedRoomTypeId = searchParams.get("roomTypeId");
  const selectedRoomType =
    hotel?.roomTypes.find((roomType) => String(roomType.roomTypeId) === String(selectedRoomTypeId)) ||
    hotel?.roomTypes[0] ||
    null;

  const buildRoomQuery = (roomTypeId) =>
    `?${buildSearchParams({
      ...filters,
      destination: hotel?.cityAddress || filters.destination,
      roomType: hotel?.roomTypes.find((roomType) => roomType.roomTypeId === roomTypeId)?.name || "Tất cả",
      roomTypeId,
    }).toString()}`;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-[28px] border border-dashed border-[#d9ccb8] bg-white p-8 text-center">
          Đang tải chi tiết khách sạn...
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-[28px] border border-dashed border-[#d9ccb8] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-textPrimary">Không tìm thấy khách sạn</h1>
          <p className="mt-3 text-gray-600">{errorMessage || "Dữ liệu khách sạn hiện không khả dụng."}</p>
          <Link
            to={ROUTES.HOTELS}
            className="mt-6 inline-flex rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white"
          >
            Quay lại trang tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <Link
        to={`${ROUTES.HOTELS}?${buildSearchParams(filters).toString()}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:underline"
      >
        ← Quay lại kết quả tìm kiếm
      </Link>

      <section className="mt-4 overflow-hidden rounded-[34px] border border-[#dfd4c3] bg-white shadow-[0_22px_60px_rgba(28,34,31,0.1)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[linear-gradient(155deg,_#17363f_0%,_#274d4f_42%,_#d9b57e_100%)] p-6 text-white md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f8deb0]">
                {hotel.countryName}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs">
                {hotel.starRating} sao
              </span>
            </div>
            <p className="mt-10 text-sm uppercase tracking-[0.24em] text-white/68">
              {hotel.cityAddress}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight">{hotel.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78">{hotel.description}</p>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Chi tiết loại phòng
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-textPrimary">{selectedRoomType?.name}</h2>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              {selectedRoomType?.servicesText || "Đây là loại phòng đang còn khả dụng trong khoảng ngày bạn chọn."}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-[#faf5ec] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Giá trung bình / đêm</div>
                <div className="mt-2 text-xl font-semibold text-textPrimary">
                  {formatCurrency(selectedRoomType?.averageNightlyRate || 0)}
                </div>
              </div>
              <div className="rounded-[24px] bg-[#17363f] p-4 text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">Tổng kỳ nghỉ</div>
                <div className="mt-2 text-xl font-semibold">{formatCurrency(selectedRoomType?.stayTotal || 0)}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#eadfce] bg-[#fffaf3] px-4 py-2 text-sm font-medium text-[#17363f]">
                {selectedRoomType?.availableRoomCount || 0} phòng trống
              </span>
              <span className="rounded-full border border-[#eadfce] bg-[#fffaf3] px-4 py-2 text-sm font-medium text-[#17363f]">
                {filters.guests}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {selectedRoomType ? (
                <Link
                  to={`${ROUTES.BOOKING}?${buildSearchParams({
                    ...filters,
                    hotelId: hotel.id,
                    roomType: selectedRoomType.name,
                    roomTypeId: selectedRoomType.roomTypeId,
                  }).toString()}`}
                  className="rounded-full bg-[#17363f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
                >
                  Đặt loại phòng này
                </Link>
              ) : null}
              <Link
                to={ROUTES.HOTELS}
                className="rounded-full border border-[#d9ccb8] px-6 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
              >
                Tìm phòng khác
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            Chọn loại phòng
          </p>
          <div className="mt-5 space-y-4">
            {hotel.roomTypes.map((roomType) => {
              const isSelectedRoom = roomType.roomTypeId === selectedRoomType?.roomTypeId;

              return (
                <Link
                  key={roomType.roomTypeId}
                  to={`${getHotelDetailPath(hotel.id)}${buildRoomQuery(roomType.roomTypeId)}`}
                  className={`block rounded-[24px] border p-5 transition ${
                    isSelectedRoom
                      ? "border-[#17363f] bg-[#17363f] text-white shadow-[0_12px_30px_rgba(23,54,63,0.18)]"
                      : "border-[#ece2d3] bg-[#fffdf9] hover:border-[#d3c1a6]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div
                        className={`text-xs uppercase tracking-[0.18em] ${
                          isSelectedRoom ? "text-[#f8deb0]" : "text-accent"
                        }`}
                      >
                        {roomType.availableRoomCount} phòng còn
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{roomType.name}</h3>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(roomType.averageNightlyRate)}
                    </div>
                  </div>
                  <p className={`mt-3 text-sm leading-7 ${isSelectedRoom ? "text-white/78" : "text-gray-600"}`}>
                    {roomType.servicesText || "Loại phòng này có thể được đặt trực tiếp từ booking flow."}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Trong loại phòng có gì
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-textPrimary">
              Amenities của {selectedRoomType?.name}
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {selectedRoomType?.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="rounded-[22px] border border-[#ece2d3] bg-[#fffcf7] px-4 py-4 text-sm font-medium text-gray-700"
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Dịch vụ cộng thêm
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {(selectedRoomType?.services || []).map((service) => (
                <span
                  key={service.id}
                  className="rounded-full bg-[#f3ebdc] px-4 py-2 text-sm font-medium text-[#17363f]"
                >
                  {service.name} · {formatCurrency(service.price)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelDetail;
