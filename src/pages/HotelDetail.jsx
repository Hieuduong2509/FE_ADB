import { Link, useParams, useSearchParams } from "react-router-dom";
import { ROUTES, getHotelDetailPath } from "../constants";
import { findHotelById, findRoomById } from "../data/pullmanData";
import { formatCurrency } from "../utils";

const HotelDetail = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const hotel = findHotelById(hotelId);

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-[28px] border border-dashed border-[#d9ccb8] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-textPrimary">Không tìm thấy khách sạn</h1>
          <p className="mt-3 text-gray-600">
            ID khách sạn hiện không có trong dữ liệu mô phỏng của giao diện.
          </p>
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

  const selectedRoom = findRoomById(hotel, searchParams.get("roomId"));
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || `${selectedRoom?.capacity || 2} người`;

  const buildRoomQuery = (roomId) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("roomId", roomId);
    nextSearchParams.set("destination", hotel.city);
    nextSearchParams.set("roomType", findRoomById(hotel, roomId)?.category || "Tất cả");
    nextSearchParams.set("guests", guests);

    return `?${nextSearchParams.toString()}`;
  };

  const bookingSearchParams = new URLSearchParams({
    hotelId: hotel.id,
    hotelName: hotel.name,
    roomId: selectedRoom?.id || "",
    destination: hotel.city,
    roomType: selectedRoom?.category || "Tất cả",
    guests,
  });

  if (checkIn) {
    bookingSearchParams.set("checkIn", checkIn);
  }

  if (checkOut) {
    bookingSearchParams.set("checkOut", checkOut);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <Link
        to={`${ROUTES.HOTELS}${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:underline"
      >
        ← Quay lại kết quả tìm kiếm
      </Link>

      <section className="mt-4 overflow-hidden rounded-[34px] border border-[#dfd4c3] bg-white shadow-[0_22px_60px_rgba(28,34,31,0.1)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[linear-gradient(155deg,_#17363f_0%,_#274d4f_42%,_#d9b57e_100%)] p-6 text-white md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f8deb0]">
                {hotel.badge}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs">
                Rating {hotel.rating}/5
              </span>
            </div>
            <p className="mt-10 text-sm uppercase tracking-[0.24em] text-white/68">
              {hotel.city} · {hotel.area}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight">{hotel.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78">{hotel.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">Địa chỉ</div>
                <div className="mt-2 text-sm leading-6">{hotel.address}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">Giá từ</div>
                <div className="mt-2 text-xl font-semibold">{formatCurrency(hotel.priceFrom)}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">Phù hợp</div>
                <div className="mt-2 text-sm leading-6">{hotel.tagline}</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Chi tiết phòng
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-textPrimary">{selectedRoom?.name}</h2>
            <p className="mt-4 text-sm leading-7 text-gray-600">{selectedRoom?.intro}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-[#faf5ec] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Loại phòng</div>
                <div className="mt-2 text-xl font-semibold text-textPrimary">
                  {selectedRoom?.category}
                </div>
              </div>
              <div className="rounded-[24px] bg-[#17363f] p-4 text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">Giá / đêm</div>
                <div className="mt-2 text-xl font-semibold">{formatCurrency(selectedRoom?.price)}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[selectedRoom?.size, selectedRoom?.bed, selectedRoom?.view, `${guests}`]
                .filter(Boolean)
                .map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#eadfce] bg-[#fffaf3] px-4 py-2 text-sm font-medium text-[#17363f]"
                  >
                    {item}
                  </span>
                ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`${ROUTES.BOOKING}?${bookingSearchParams.toString()}`}
                className="rounded-full bg-[#17363f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
              >
                Đặt phòng này
              </Link>
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
            Chọn hạng phòng
          </p>
          <div className="mt-5 space-y-4">
            {hotel.rooms.map((room) => {
              const isSelectedRoom = room.id === selectedRoom?.id;

              return (
                <Link
                  key={room.id}
                  to={`${getHotelDetailPath(hotel.id)}${buildRoomQuery(room.id)}`}
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
                        {room.category}
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{room.name}</h3>
                    </div>
                    <div className="text-lg font-semibold">{formatCurrency(room.price)}</div>
                  </div>
                  <p className={`mt-3 text-sm leading-7 ${isSelectedRoom ? "text-white/78" : "text-gray-600"}`}>
                    {room.intro}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Trong phòng có gì
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-textPrimary">
              Amenities của {selectedRoom?.name}
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {selectedRoom?.amenities.map((amenity) => (
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
              Tiện ích khách sạn
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {hotel.overviewAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-[#f3ebdc] px-4 py-2 text-sm font-medium text-[#17363f]"
                >
                  {amenity}
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
