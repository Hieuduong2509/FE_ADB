import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES, getHotelDetailPath } from "../constants";
import {
  bookingFacilities,
  filterHotels,
  findHotelById,
  findRoomById,
  pullmanHotels,
} from "../data/pullmanData";
import { calculateStayNights, formatCurrency, formatDateLabel } from "../utils";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");
  const roomType = searchParams.get("roomType") || "Tất cả";
  const destination = searchParams.get("destination") || "Tất cả";
  const guests = searchParams.get("guests") || "2 người";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const prefilteredHotels = filterHotels({
    destination,
    roomType,
    guests,
    amenity: "Tất cả",
  });

  const resolvedHotel =
    findHotelById(hotelId) || prefilteredHotels[0] || pullmanHotels[0];

  const roomFallback =
    resolvedHotel.rooms.find((room) => room.category === roomType) || resolvedHotel.rooms[0];

  const selectedRoom = roomId ? findRoomById(resolvedHotel, roomId) : roomFallback;
  const [selectedFacilities, setSelectedFacilities] = useState(["buffet-breakfast"]);

  const detailSearchParams = new URLSearchParams({
    roomId: selectedRoom?.id || "",
    destination: resolvedHotel.city,
    roomType: selectedRoom?.category || roomType,
    guests,
  });

  if (checkIn) {
    detailSearchParams.set("checkIn", checkIn);
  }

  if (checkOut) {
    detailSearchParams.set("checkOut", checkOut);
  }

  const stayNights = calculateStayNights(checkIn, checkOut);
  const roomSubtotal = (selectedRoom?.price || 0) * stayNights;
  const facilitySubtotal = bookingFacilities
    .filter((facility) => selectedFacilities.includes(facility.id))
    .reduce((total, facility) => total + facility.price, 0);
  const taxesAndFees = Math.round((roomSubtotal + facilitySubtotal) * 0.08);
  const estimatedTotal = roomSubtotal + facilitySubtotal + taxesAndFees;

  const toggleFacility = (facilityId) => {
    setSelectedFacilities((currentFacilities) =>
      currentFacilities.includes(facilityId)
        ? currentFacilities.filter((item) => item !== facilityId)
        : [...currentFacilities, facilityId],
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <section className="rounded-[34px] border border-[#dfd4c3] bg-[linear-gradient(140deg,_#17363f_0%,_#214d4f_42%,_#ecd5a8_100%)] p-6 text-white shadow-[0_22px_60px_rgba(28,34,31,0.12)] md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f8deb0]">
              Booking design
            </p>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl">
              Trang booking cho phép chọn thêm facilities trước khi nối API thật.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              Flow hiện tại giữ đúng mối quan hệ giữa khách sạn, loại phòng, ngày lưu trú và dịch vụ
              cộng thêm để sau này bạn gắn backend vào mà không phải làm lại UI.
            </p>
          </div>

          <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60">Tạm tính</div>
            <div className="mt-2 text-3xl font-semibold">{formatCurrency(estimatedTotal)}</div>
            <div className="mt-2 text-sm text-white/72">
              {stayNights} đêm · {guests}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Thông tin lưu trú
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-textPrimary">{resolvedHotel.name}</h2>
              </div>
              <Link
                to={`${getHotelDetailPath(resolvedHotel.id)}?${detailSearchParams.toString()}`}
                className="rounded-full border border-[#d9ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
              >
                Xem lại chi tiết phòng
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#faf5ec] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Phòng đã chọn</div>
                <div className="mt-2 text-xl font-semibold text-textPrimary">{selectedRoom?.name}</div>
                <div className="mt-2 text-sm text-gray-600">{selectedRoom?.intro}</div>
              </div>
              <div className="rounded-[24px] bg-[#17363f] p-4 text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">Giá / đêm</div>
                <div className="mt-2 text-xl font-semibold">{formatCurrency(selectedRoom?.price || 0)}</div>
                <div className="mt-2 text-sm text-white/70">{selectedRoom?.category}</div>
              </div>
              <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Ngày ở</div>
                <div className="mt-2 text-lg font-semibold text-textPrimary">
                  {formatDateLabel(checkIn)} → {formatDateLabel(checkOut)}
                </div>
                <div className="mt-2 text-sm text-gray-600">{stayNights} đêm lưu trú</div>
              </div>
              <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Số khách</div>
                <div className="mt-2 text-lg font-semibold text-textPrimary">{guests}</div>
                <div className="mt-2 text-sm text-gray-600">
                  {selectedRoom?.size} · {selectedRoom?.bed}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Chọn thêm facilities
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-textPrimary">
              Dịch vụ cộng thêm trong bước booking
            </h2>

            <div className="mt-5 grid gap-4">
              {bookingFacilities.map((facility) => {
                const isSelected = selectedFacilities.includes(facility.id);

                return (
                  <label
                    key={facility.id}
                    className={`flex cursor-pointer gap-4 rounded-[24px] border p-5 transition ${
                      isSelected
                        ? "border-[#17363f] bg-[#17363f] text-white shadow-[0_12px_30px_rgba(23,54,63,0.16)]"
                        : "border-[#ece2d3] bg-[#fffcf7] hover:border-[#d8c6ac]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFacility(facility.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#17363f]"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div
                            className={`text-xs uppercase tracking-[0.2em] ${
                              isSelected ? "text-[#f8deb0]" : "text-accent"
                            }`}
                          >
                            {facility.tag}
                          </div>
                          <h3 className="mt-2 text-xl font-semibold">{facility.title}</h3>
                        </div>
                        <div className="text-lg font-semibold">{formatCurrency(facility.price)}</div>
                      </div>
                      <p className={`mt-3 text-sm leading-7 ${isSelected ? "text-white/78" : "text-gray-600"}`}>
                        {facility.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Guest form
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Họ và tên</span>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Email</span>
                <input
                  type="email"
                  placeholder="guest@email.com"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Số điện thoại</span>
                <input
                  type="tel"
                  placeholder="09xx xxx xxx"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Ghi chú</span>
                <input
                  type="text"
                  placeholder="Ví dụ: nhận phòng muộn"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[30px] border border-[#dfd4c3] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)] xl:sticky xl:top-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Booking summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-textPrimary">Tóm tắt đặt phòng</h2>

          <div className="mt-6 rounded-[24px] bg-[#17363f] p-5 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">Khách sạn</div>
            <div className="mt-2 text-xl font-semibold">{resolvedHotel.name}</div>
            <div className="mt-2 text-sm text-white/72">{resolvedHotel.address}</div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {selectedRoom?.name} x {stayNights} đêm
              </span>
              <span className="font-semibold text-textPrimary">{formatCurrency(roomSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Facilities đã chọn</span>
              <span className="font-semibold text-textPrimary">
                {formatCurrency(facilitySubtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Thuế và phí ước tính</span>
              <span className="font-semibold text-textPrimary">
                {formatCurrency(taxesAndFees)}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] bg-[#faf5ec] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Tổng cộng</div>
            <div className="mt-2 text-3xl font-semibold text-textPrimary">
              {formatCurrency(estimatedTotal)}
            </div>
            <div className="mt-2 text-sm text-gray-600">Chưa submit API, chỉ tính theo mock data UI.</div>
          </div>

          <div className="mt-6 space-y-3">
            {selectedFacilities.length > 0 ? (
              bookingFacilities
                .filter((facility) => selectedFacilities.includes(facility.id))
                .map((facility) => (
                  <div
                    key={facility.id}
                    className="rounded-[20px] border border-[#ece2d3] bg-[#fffcf7] px-4 py-3"
                  >
                    <div className="text-sm font-semibold text-textPrimary">{facility.title}</div>
                    <div className="mt-1 text-sm text-gray-500">{facility.tag}</div>
                  </div>
                ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#d9ccb8] px-4 py-4 text-sm text-gray-500">
                Chưa chọn dịch vụ cộng thêm.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to={ROUTES.BOOKING_CONFIRM}
              className="rounded-2xl bg-[#17363f] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#102d34]"
            >
              Tiếp tục xác nhận
            </Link>
            <Link
              to={ROUTES.HOTELS}
              className="rounded-2xl border border-[#d9ccb8] px-5 py-3 text-center text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
            >
              Quay lại tìm kiếm
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Booking;
