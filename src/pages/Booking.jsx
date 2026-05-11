import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES, getHotelDetailPath } from "../constants";
import { formatCurrency, formatDateLabel } from "../utils";
import {
  createBookingApi,
  getBookingQuoteApi,
  getClientHotelDetailApi,
  readAuthSession,
} from "../utils/auth";
import { buildSearchParams, createSearchFiltersFromParams } from "../utils/search";

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const filters = useMemo(
    () => createSearchFiltersFromParams(searchParams),
    [searchParamsKey],
  );
  const hotelId = searchParams.get("hotelId");
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestForm, setGuestForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(searchParams.get("roomTypeId") || "");
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const loadHotel = async () => {
      if (!hotelId) {
        setHotel(null);
        setIsLoading(false);
        setErrorMessage("Thiếu hotelId để bắt đầu booking.");
        return;
      }

      setIsLoading(true);
      try {
        const data = await getClientHotelDetailApi(hotelId, filters);
        setHotel(data);
        setSelectedRoomTypeId((current) => current || String(data?.roomTypes?.[0]?.roomTypeId || ""));
        setErrorMessage("");
      } catch (error) {
        setHotel(null);
        setErrorMessage(error.message || "Không tải được thông tin booking.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadHotel();
  }, [filters, hotelId, searchParamsKey]);

  const selectedRoomType =
    hotel?.roomTypes.find((roomType) => String(roomType.roomTypeId) === String(selectedRoomTypeId)) ||
    hotel?.roomTypes[0] ||
    null;

  const availableServices = useMemo(() => selectedRoomType?.services || [], [selectedRoomType]);

  useEffect(() => {
    setSelectedServiceIds((currentIds) =>
      currentIds.filter((serviceId) =>
        availableServices.some((service) => String(service.id) === String(serviceId)),
      ),
    );
  }, [availableServices]);

  useEffect(() => {
    const loadQuote = async () => {
      if (!selectedRoomTypeId) {
        setQuote(null);
        return;
      }

      try {
        const data = await getBookingQuoteApi({
          roomTypeId: String(selectedRoomTypeId),
          checkIn: filters.checkIn,
          checkOut: filters.checkOut,
          guests: filters.guests,
          serviceIds: selectedServiceIds.map((item) => String(item)),
        });
        setQuote(data);
        setErrorMessage("");
      } catch (error) {
        setQuote(null);
        setErrorMessage(error.message || "Không tính được báo giá booking.");
      }
    };

    void loadQuote();
  }, [filters.checkIn, filters.checkOut, filters.guests, selectedRoomTypeId, selectedServiceIds]);

  const toggleService = (serviceId) => {
    setSelectedServiceIds((currentIds) =>
      currentIds.includes(serviceId)
        ? currentIds.filter((id) => id !== serviceId)
        : [...currentIds, serviceId],
    );
  };

  const handleGuestFieldChange = (field) => (event) => {
    setGuestForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleCreateBooking = async () => {
    const session = readAuthSession();
    if (!session?.accessToken) {
      setErrorMessage("Vui lòng đăng nhập trước khi xác nhận booking.");
      navigate(ROUTES.LOGIN);
      return;
    }

    if (!quote) {
      setErrorMessage("Báo giá booking chưa sẵn sàng.");
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createBookingApi(
        {
          roomTypeId: String(selectedRoomTypeId),
          checkIn: filters.checkIn,
          checkOut: filters.checkOut,
          guests: filters.guests,
          serviceIds: selectedServiceIds.map((item) => String(item)),
          countParent: Number(String(filters.guests).match(/\d+/)?.[0] || 1),
          countChild: 0,
          ...guestForm,
        },
        session.accessToken,
      );

      navigate(
        `${ROUTES.BOOKING_CONFIRM}?${buildSearchParams({
          bookingId: booking.id,
          hotelName: quote.hotelName,
          roomTypeName: quote.roomTypeName,
          totalAmount: quote.totalAmount,
          checkIn: quote.checkIn,
          checkOut: quote.checkOut,
        }).toString()}`,
      );
    } catch (error) {
      setErrorMessage(error.message || "Không tạo được booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-[#d9ccb8] bg-white p-10 text-center">
          Đang tải booking...
        </div>
      </div>
    );
  }

  if (!hotel || !selectedRoomType) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-[#d9ccb8] bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold text-textPrimary">Không thể mở booking</h1>
          <p className="mt-3 text-sm text-gray-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <section className="rounded-[34px] border border-[#dfd4c3] bg-[linear-gradient(140deg,_#17363f_0%,_#214d4f_42%,_#ecd5a8_100%)] p-6 text-white shadow-[0_22px_60px_rgba(28,34,31,0.12)] md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f8deb0]">
              Real booking
            </p>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl">
              Booking đang lấy giá thực từ room type, seasonal pricing và special date pricing.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              Khi bạn đổi loại phòng hoặc thêm dịch vụ, báo giá sẽ được gọi lại từ backend.
            </p>
          </div>

          <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60">Tạm tính</div>
            <div className="mt-2 text-3xl font-semibold">{formatCurrency(quote?.totalAmount || 0)}</div>
            <div className="mt-2 text-sm text-white/72">
              {quote?.stayNights || 0} đêm · {filters.guests}
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
                <h2 className="mt-2 text-2xl font-semibold text-textPrimary">{hotel.name}</h2>
              </div>
              <Link
                to={`${getHotelDetailPath(hotel.id)}?${buildSearchParams({
                  ...filters,
                  hotelId: hotel.id,
                  roomType: selectedRoomType.name,
                  roomTypeId: selectedRoomType.roomTypeId,
                }).toString()}`}
                className="rounded-full border border-[#d9ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
              >
                Xem lại chi tiết phòng
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#faf5ec] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Loại phòng đã chọn</div>
                <div className="mt-2 text-xl font-semibold text-textPrimary">{selectedRoomType.name}</div>
                <div className="mt-2 text-sm text-gray-600">{selectedRoomType.servicesText}</div>
              </div>
              <div className="rounded-[24px] bg-[#17363f] p-4 text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">Giá trung bình / đêm</div>
                <div className="mt-2 text-xl font-semibold">
                  {formatCurrency(quote?.nightlyBreakdown?.[0]?.rate || selectedRoomType.averageNightlyRate)}
                </div>
                <div className="mt-2 text-sm text-white/70">{selectedRoomType.availableRoomCount} phòng còn</div>
              </div>
              <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Ngày ở</div>
                <div className="mt-2 text-lg font-semibold text-textPrimary">
                  {formatDateLabel(filters.checkIn)} → {formatDateLabel(filters.checkOut)}
                </div>
                <div className="mt-2 text-sm text-gray-600">{quote?.stayNights || 0} đêm lưu trú</div>
              </div>
              <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Số khách</div>
                <div className="mt-2 text-lg font-semibold text-textPrimary">{filters.guests}</div>
                <div className="mt-2 text-sm text-gray-600">{hotel.cityAddress}</div>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Chọn loại phòng
            </p>
            <div className="mt-5 grid gap-4">
              {hotel.roomTypes.map((roomType) => {
                const isSelected = String(roomType.roomTypeId) === String(selectedRoomTypeId);

                return (
                  <button
                    key={roomType.roomTypeId}
                    type="button"
                    onClick={() => setSelectedRoomTypeId(String(roomType.roomTypeId))}
                    className={`rounded-[24px] border p-5 text-left transition ${
                      isSelected
                        ? "border-[#17363f] bg-[#17363f] text-white shadow-[0_12px_30px_rgba(23,54,63,0.16)]"
                        : "border-[#ece2d3] bg-[#fffcf7] hover:border-[#d8c6ac]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className={`text-xs uppercase tracking-[0.2em] ${isSelected ? "text-[#f8deb0]" : "text-accent"}`}>
                          {roomType.availableRoomCount} phòng còn
                        </div>
                        <h3 className="mt-2 text-xl font-semibold">{roomType.name}</h3>
                        <p className={`mt-3 text-sm leading-7 ${isSelected ? "text-white/78" : "text-gray-600"}`}>
                          {roomType.servicesText}
                        </p>
                      </div>
                      <div className="min-w-[160px]">
                        <div className="text-sm opacity-80">Tổng kỳ nghỉ</div>
                        <div className="mt-2 text-2xl font-semibold">{formatCurrency(roomType.stayTotal)}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Chọn thêm dịch vụ
            </p>

            <div className="mt-5 grid gap-4">
              {availableServices.map((service) => {
                const isSelected = selectedServiceIds.includes(String(service.id));

                return (
                  <label
                    key={service.id}
                    className={`flex cursor-pointer gap-4 rounded-[24px] border p-5 transition ${
                      isSelected
                        ? "border-[#17363f] bg-[#17363f] text-white shadow-[0_12px_30px_rgba(23,54,63,0.16)]"
                        : "border-[#ece2d3] bg-[#fffcf7] hover:border-[#d8c6ac]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleService(String(service.id))}
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
                            {service.pricingType}
                          </div>
                          <h3 className="mt-2 text-xl font-semibold">{service.name}</h3>
                        </div>
                        <div className="text-lg font-semibold">{formatCurrency(service.price)}</div>
                      </div>
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
                  value={guestForm.fullName}
                  onChange={handleGuestFieldChange("fullName")}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Email</span>
                <input
                  type="email"
                  value={guestForm.email}
                  onChange={handleGuestFieldChange("email")}
                  placeholder="guest@email.com"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Số điện thoại</span>
                <input
                  type="tel"
                  value={guestForm.phone}
                  onChange={handleGuestFieldChange("phone")}
                  placeholder="09xx xxx xxx"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Ghi chú</span>
                <input
                  type="text"
                  value={guestForm.note}
                  onChange={handleGuestFieldChange("note")}
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
            <div className="mt-2 text-xl font-semibold">{hotel.name}</div>
            <div className="mt-2 text-sm text-white/72">{hotel.cityAddress}</div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[20px] border border-[#e7c5bf] bg-[#fff2ee] px-4 py-3 text-sm text-[#aa4f3d]">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{quote?.roomTypeName}</span>
              <span className="font-semibold text-textPrimary">{formatCurrency(quote?.roomTotal || 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Điều chỉnh bởi pricing rules</span>
              <span className={`font-semibold ${Number(quote?.pricingAdjustmentTotal || 0) >= 0 ? "text-[#8b5e34]" : "text-[#1f7a4f]"}`}>
                {Number(quote?.pricingAdjustmentTotal || 0) >= 0 ? "+" : ""}
                {formatCurrency(quote?.pricingAdjustmentTotal || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Dịch vụ đã chọn</span>
              <span className="font-semibold text-textPrimary">{formatCurrency(quote?.serviceTotal || 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Thuế và phí ước tính</span>
              <span className="font-semibold text-textPrimary">{formatCurrency(quote?.taxesAndFees || 0)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] bg-[#faf5ec] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Tổng cộng</div>
            <div className="mt-2 text-3xl font-semibold text-textPrimary">
              {formatCurrency(quote?.totalAmount || 0)}
            </div>
            <div className="mt-2 text-sm text-gray-600">Báo giá này đang được trả trực tiếp từ backend.</div>
          </div>

          {Array.isArray(quote?.appliedPricingRules) && quote.appliedPricingRules.length ? (
            <div className="mt-6 rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-accent">Pricing rules đã áp dụng</div>
              <div className="mt-4 space-y-3">
                {quote.appliedPricingRules.map((rule) => (
                  <div key={rule.ruleId} className="rounded-[18px] bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-textPrimary">{rule.name}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {rule.actionSummary} · {rule.nightsApplied} đêm
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${Number(rule.impactAmount || 0) >= 0 ? "text-[#8b5e34]" : "text-[#1f7a4f]"}`}>
                        {Number(rule.impactAmount || 0) >= 0 ? "+" : ""}
                        {formatCurrency(rule.impactAmount || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {Array.isArray(quote?.nightlyBreakdown) && quote.nightlyBreakdown.length ? (
            <div className="mt-6 rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-accent">Nightly breakdown</div>
              <div className="mt-4 space-y-3">
                {quote.nightlyBreakdown.map((night) => (
                  <div key={night.date} className="rounded-[18px] bg-white px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-textPrimary">{night.date}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          Base {formatCurrency(night.baseRate || 0)}
                          {" → "}
                          Final {formatCurrency(night.adjustedRate || 0)}
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${Number(night.impactAmount || 0) >= 0 ? "text-[#8b5e34]" : "text-[#1f7a4f]"}`}>
                        {Number(night.impactAmount || 0) >= 0 ? "+" : ""}
                        {formatCurrency(night.impactAmount || 0)}
                      </div>
                    </div>
                    {Array.isArray(night.appliedRules) && night.appliedRules.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {night.appliedRules.map((rule) => (
                          <div
                            key={`${night.date}-${rule.ruleId}`}
                            className="rounded-full bg-[#f5ecde] px-3 py-2 text-xs text-textPrimary"
                          >
                            {rule.name} · {rule.actionSummary}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            {(quote?.services || []).length > 0 ? (
              quote.services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-[20px] border border-[#ece2d3] bg-[#fffcf7] px-4 py-3"
                >
                  <div className="text-sm font-semibold text-textPrimary">{service.name}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {service.pricingType} x {service.quantity}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-textPrimary">
                    {formatCurrency(service.total)}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#d9ccb8] px-4 py-4 text-sm text-gray-500">
                Chưa chọn dịch vụ cộng thêm.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCreateBooking}
              disabled={isSubmitting || !quote}
              className="rounded-2xl bg-[#17363f] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#102d34] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Đang tạo booking..." : "Tiếp tục xác nhận"}
            </button>
            <Link
              to={`${ROUTES.HOTELS}?${buildSearchParams(filters).toString()}`}
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
