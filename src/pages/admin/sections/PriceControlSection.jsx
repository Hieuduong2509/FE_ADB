import { formatCurrency } from "../../../utils";

const PriceControlSection = ({
  filteredRoomTypes,
  getHolidayPercentForRoomType,
  updateRoomTypePrice,
  startRoomTypeEdit,
}) => (
  <section
    id="price-control"
    className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
  >
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Giá loại phòng
        </div>
        <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
          Chỉnh base price ngay trên từng room type
        </h2>
      </div>
      <div className="rounded-[24px] bg-[#17363f] px-5 py-4 text-white">
        <div className="text-xs uppercase tracking-[0.18em] text-[#f6ddb0]">
          Giá dự báo cao điểm
        </div>
        <div className="mt-2 text-lg font-semibold">
          Dùng mức uplift đang active để preview selling price
        </div>
      </div>
    </div>

    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      {filteredRoomTypes.map((roomType) => {
        const holidayPercent = getHolidayPercentForRoomType(roomType);
        const sellingPrice = Math.round(roomType.basePrice * (1 + holidayPercent / 100));

        return (
          <div
            key={roomType.id}
            className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent">
                  {roomType.hotelName}
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-textPrimary">{roomType.name}</h3>
                <div className="mt-2 text-sm text-gray-600">
                  {roomType.category} · {roomType.size} · {roomType.capacity} khách
                </div>
              </div>
              <button
                type="button"
                onClick={() => startRoomTypeEdit(roomType)}
                className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
              >
                Sửa chi tiết
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Base price</span>
                <input
                  type="number"
                  min="0"
                  value={roomType.basePrice}
                  onChange={(event) => updateRoomTypePrice(roomType.id, event.target.value)}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {formatCurrency(roomType.basePrice)} / đêm
                </div>
              </label>

              <div className="rounded-[24px] bg-[#17363f] p-4 text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-[#f6ddb0]">
                  Holiday preview
                </div>
                <div className="mt-3 text-3xl font-semibold">{holidayPercent}%</div>
                <div className="mt-2 text-sm text-white/74">
                  Giá sau uplift: {formatCurrency(sellingPrice)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default PriceControlSection;
