import { formatCurrency } from "../../../utils";

const HolidayRulesSection = ({
  pricingDraft,
  setPricingDraft,
  submitPricing,
  editingPricingId,
  editingPricingType,
  resetPricingEditor,
  seasonalRules,
  specificDatePricing,
  startPricingEdit,
  deletePricing,
  hotelOptions,
  roomTypes,
  isLoading,
  isSubmitting,
  errorMessage,
}) => {
  const availableRoomTypes = roomTypes.filter(
    (roomType) => String(roomType.hotelId) === String(pricingDraft.hotelId),
  );
  const selectedRoomType =
    availableRoomTypes.find((roomType) => String(roomType.id) === String(pricingDraft.roomTypeId)) ||
    availableRoomTypes[0] ||
    null;
  const basePrice = Number(selectedRoomType?.basePrice || 0);
  const specificPercent = Number(pricingDraft.specificPercent || 0);
  const specificChangeAmount = Math.round((basePrice * specificPercent) / 100);
  const estimatedSpecificRate =
    pricingDraft.specificDirection === "decrease"
      ? Math.max(basePrice - specificChangeAmount, 0)
      : basePrice + specificChangeAmount;
  const isDecreasePreview = pricingDraft.specificDirection === "decrease";

  return (
    <section
      id="holiday-rules"
      className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Pricing rules
          </div>
          <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
            Tạo pricing theo đơn ngày hoặc dải ngày
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Đơn ngày dùng phần trăm tăng hoặc giảm dựa trên base price của room type. Dải ngày
            dùng seasonal multiplier để áp trên toàn khoảng ngày.
          </p>

          <form onSubmit={submitPricing} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Loại pricing</span>
                <select
                  value={pricingDraft.type}
                  onChange={(event) =>
                    setPricingDraft((currentDraft) => ({
                      ...currentDraft,
                      type: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                >
                  <option value="single_day">Đơn ngày</option>
                  <option value="date_range">Dải ngày</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Hotel</span>
                <select
                  value={pricingDraft.hotelId}
                  onChange={(event) =>
                    setPricingDraft((currentDraft) => {
                      const nextHotelId = event.target.value;
                      const nextRoomTypes = roomTypes.filter(
                        (roomType) => String(roomType.hotelId) === String(nextHotelId),
                      );

                      return {
                        ...currentDraft,
                        hotelId: nextHotelId,
                        roomTypeId: nextRoomTypes[0]?.id || "",
                      };
                    })
                  }
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                >
                  {hotelOptions.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {pricingDraft.type === "single_day" ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">Room type</span>
                    <select
                      value={pricingDraft.roomTypeId}
                      onChange={(event) =>
                        setPricingDraft((currentDraft) => ({
                          ...currentDraft,
                          roomTypeId: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                    >
                      {availableRoomTypes.map((roomType) => (
                        <option key={roomType.id} value={roomType.id}>
                          {roomType.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">
                      Ngày áp dụng
                    </span>
                    <input
                      type="date"
                      value={pricingDraft.specificDate}
                      onChange={(event) =>
                        setPricingDraft((currentDraft) => ({
                          ...currentDraft,
                          specificDate: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">Hướng áp giá</span>
                    <select
                      value={pricingDraft.specificDirection}
                      onChange={(event) =>
                        setPricingDraft((currentDraft) => ({
                          ...currentDraft,
                          specificDirection: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                    >
                      <option value="increase">Tăng giá</option>
                      <option value="decrease">Giảm giá</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">
                      Phần trăm thay đổi theo base price
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="0.1"
                      value={pricingDraft.specificPercent}
                      onChange={(event) =>
                        setPricingDraft((currentDraft) => ({
                          ...currentDraft,
                          specificPercent: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                    />
                  </label>
                </div>

                <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent">Admin preview</div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div className="rounded-[18px] bg-white px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-gray-400">Base price</div>
                      <div className="mt-2 text-lg font-semibold text-textPrimary">
                        {formatCurrency(basePrice)}
                      </div>
                    </div>
                    <div className="rounded-[18px] bg-white px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-gray-400">Thay đổi</div>
                      <div
                        className={`mt-2 text-lg font-semibold ${
                          isDecreasePreview ? "text-[#1f7a4f]" : "text-[#8b5e34]"
                        }`}
                      >
                        {isDecreasePreview ? "-" : "+"}
                        {specificPercent}% · {isDecreasePreview ? "-" : "+"}
                        {formatCurrency(specificChangeAmount)}
                      </div>
                    </div>
                    <div className="rounded-[18px] bg-white px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-gray-400">Giá sau rule</div>
                      <div className="mt-2 text-lg font-semibold text-textPrimary">
                        {formatCurrency(estimatedSpecificRate)}
                      </div>
                    </div>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">Notes</span>
                  <textarea
                    rows="3"
                    value={pricingDraft.specificNote}
                    onChange={(event) =>
                      setPricingDraft((currentDraft) => ({
                        ...currentDraft,
                        specificNote: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                    placeholder="Ví dụ: đêm countdown, concert, lễ lớn"
                  />
                </label>
              </>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">
                      Start date
                    </span>
                    <input
                      type="date"
                      value={pricingDraft.startDate}
                      onChange={(event) =>
                        setPricingDraft((currentDraft) => ({
                          ...currentDraft,
                          startDate: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">
                      End date
                    </span>
                    <input
                      type="date"
                      value={pricingDraft.endDate}
                      onChange={(event) =>
                        setPricingDraft((currentDraft) => ({
                          ...currentDraft,
                          endDate: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-600">Multiplier</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pricingDraft.multiplier}
                    onChange={(event) =>
                      setPricingDraft((currentDraft) => ({
                        ...currentDraft,
                        multiplier: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Tăng khoảng {Math.max(0, (Number(pricingDraft.multiplier) - 1) * 100).toFixed(0)}%
                    so với base price.
                  </div>
                </label>
              </>
            )}

            {errorMessage ? (
              <div className="rounded-2xl border border-[#f0c8c0] bg-[#fff3f0] px-4 py-3 text-sm text-[#9f4738]">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingPricingId
                  ? editingPricingType === "single_day"
                    ? "Lưu đơn ngày"
                    : "Lưu dải ngày"
                  : pricingDraft.type === "single_day"
                    ? "Tạo đơn ngày"
                    : "Tạo dải ngày"}
              </button>
              {editingPricingId ? (
                <button
                  type="button"
                  onClick={resetPricingEditor}
                  className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
                >
                  Cancel editing
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-textPrimary">Dải ngày</h3>
              <div className="text-sm text-gray-500">{seasonalRules.length} rule</div>
            </div>
            <div className="mt-4 space-y-4">
              {isLoading ? (
                <div className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5 text-sm text-gray-500">
                  Loading seasonal pricing...
                </div>
              ) : seasonalRules.length ? (
                seasonalRules.map((rule) => (
                  <div
                    key={`seasonal-${rule.id}`}
                    className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-accent">
                          {rule.hotelName}
                        </div>
                        <h4 className="mt-2 text-xl font-semibold text-textPrimary">
                          {rule.startDate} → {rule.endDate}
                        </h4>
                      </div>
                      <div className="rounded-full bg-[#17363f] px-4 py-2 text-sm font-semibold text-white">
                        x{rule.multiplier}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => startPricingEdit(rule)}
                        className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePricing(rule.id, rule.type)}
                        className="rounded-full border border-[#e7c5bf] px-4 py-2 text-sm font-medium text-[#aa4f3d] transition hover:bg-[#fff2ee]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-[#e3d6c1] bg-[#fffaf1] p-5 text-sm text-gray-500">
                  Chưa có dải ngày nào cho khách sạn đang chọn.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-textPrimary">Đơn ngày</h3>
              <div className="text-sm text-gray-500">{specificDatePricing.length} rule</div>
            </div>
            <div className="mt-4 space-y-4">
              {isLoading ? (
                <div className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5 text-sm text-gray-500">
                  Loading specific date pricing...
                </div>
              ) : specificDatePricing.length ? (
                specificDatePricing.map((rule) => (
                  <div
                    key={`specific-${rule.id}`}
                    className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-accent">
                          {rule.hotelName}
                        </div>
                        <h4 className="mt-2 text-xl font-semibold text-textPrimary">
                          {rule.roomTypeName}
                        </h4>
                        <div className="mt-2 text-sm text-gray-600">{rule.specificDate}</div>
                      </div>
                      <div
                        className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                          rule.specificDirection === "decrease" ? "bg-[#2b6c4c]" : "bg-[#8b5e34]"
                        }`}
                      >
                        {rule.specificDirection === "decrease" ? "-" : "+"}
                        {rule.specificPercent}%
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-[18px] bg-white px-4 py-3 text-sm text-gray-700">
                        Base price: {formatCurrency(rule.basePrice)}
                      </div>
                      <div className="rounded-[18px] bg-white px-4 py-3 text-sm text-gray-700">
                        {rule.specificDirection === "decrease" ? "Giảm" : "Tăng"}:{" "}
                        {rule.specificDirection === "decrease" ? "-" : "+"}
                        {formatCurrency(rule.changeAmount)}
                      </div>
                      <div className="rounded-[18px] bg-white px-4 py-3 text-sm font-semibold text-textPrimary">
                        Giá sau rule: {formatCurrency(rule.estimatedRate)}
                      </div>
                    </div>

                    {rule.specificNote ? (
                      <div className="mt-4 rounded-2xl bg-[#f7efe2] px-4 py-3 text-sm text-gray-600">
                        {rule.specificNote}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => startPricingEdit(rule)}
                        className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePricing(rule.id, rule.type)}
                        className="rounded-full border border-[#e7c5bf] px-4 py-2 text-sm font-medium text-[#aa4f3d] transition hover:bg-[#fff2ee]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-[#e3d6c1] bg-[#fffaf1] p-5 text-sm text-gray-500">
                  Chưa có đơn ngày nào cho khách sạn đang chọn.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HolidayRulesSection;

