const AdminSidebar = ({
  sectionLinks,
  activeSection,
  onChangeSection,
  hotelOptions,
  selectedHotelId,
  setSelectedHotelId,
  selectedHotel,
  filteredRoomTypesCount,
}) => (
  <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
    <div className="rounded-[28px] border border-[#ded3c3] bg-white p-5 shadow-[0_18px_40px_rgba(32,28,24,0.06)]">
      <div className="text-xs uppercase tracking-[0.22em] text-accent">Section map</div>
      <div className="mt-4 space-y-2">
        {sectionLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => onChangeSection(link.id)}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
              activeSection === link.id
                ? "bg-[#17363f] text-white shadow-[0_10px_24px_rgba(23,54,63,0.12)]"
                : "border border-[#eee2d0] bg-[#fcfaf6] text-textPrimary hover:border-[#d2bea0] hover:bg-[#f8f1e5]"
            }`}
          >
            <span>{link.label}</span>
            <span className={activeSection === link.id ? "text-[#f6ddb0]" : "text-accent"}>
              {activeSection === link.id ? "Đang mở" : "Mở"}
            </span>
          </button>
        ))}
      </div>
    </div>

    <div className="rounded-[28px] border border-[#ded3c3] bg-[#17363f] p-5 text-white shadow-[0_18px_40px_rgba(13,33,38,0.16)]">
      <div className="text-xs uppercase tracking-[0.22em] text-[#f6ddb0]">Bộ lọc nhanh</div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm text-white/72">Khách sạn đang xem</span>
        <select
          value={selectedHotelId}
          onChange={(event) => setSelectedHotelId(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6ddb0] focus:ring-4 focus:ring-[#f6ddb0]/10"
        >
          {hotelOptions.map((hotel) => (
            <option key={hotel.id} value={hotel.id} className="text-textPrimary">
              {hotel.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 rounded-[22px] border border-white/10 bg-white/8 p-4">
        <div className="text-sm font-semibold">{selectedHotel?.name}</div>
        <div className="mt-1 text-sm text-white/68">{selectedHotel?.city}</div>
        <div className="mt-3 text-xs uppercase tracking-[0.18em] text-[#f6ddb0]">
          Focus room types
        </div>
        <div className="mt-2 text-2xl font-semibold">{filteredRoomTypesCount}</div>
      </div>
    </div>

    <div className="rounded-[28px] border border-[#ded3c3] bg-[#f5ecde] p-5">
      <div className="text-xs uppercase tracking-[0.22em] text-accent">Quy ước vận hành</div>
      <div className="mt-3 space-y-3 text-sm leading-6 text-gray-700">
        <p>Base price là giá gốc theo room type trước khi cộng seasonal uplift.</p>
        <p>Facilities là dịch vụ add-on khi booking, còn amenities là tiện nghi hiển thị trên phòng.</p>
        <p>Holiday rules áp dụng theo hotel và theo category hoặc toàn bộ room type.</p>
      </div>
    </div>
  </aside>
);

export default AdminSidebar;
