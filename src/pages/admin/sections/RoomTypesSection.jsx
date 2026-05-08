import { formatCurrency } from "../../../utils";

const RoomTypesSection = ({
  hotelOptions,
  amenities,
  facilities,
  roomTypeDraft,
  setRoomTypeDraft,
  submitRoomType,
  editingRoomTypeId,
  resetRoomTypeEditor,
  toggleDraftCollectionValue,
  filteredRoomTypes,
  startRoomTypeEdit,
  deleteRoomType,
  isLoading,
  isSubmitting,
  errorMessage,
}) => {
  const availableFacilities = facilities.filter(
    (facility) => String(facility.hotelId) === String(roomTypeDraft.hotelId),
  );
  const availableAmenities = amenities.filter(
    (amenity) => String(amenity.hotelId) === String(roomTypeDraft.hotelId),
  );

  return (
    <section
      id="room-types"
      className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Room type manager
          </div>
          <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
            CRUD loại phòng và gắn amenities, facilities trực tiếp
          </h2>

          <form onSubmit={submitRoomType} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Khách sạn</span>
              <select
                value={roomTypeDraft.hotelId}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    hotelId: event.target.value,
                    amenities: [],
                    facilities: [],
                  }))
                }
                disabled={!hotelOptions.length || isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {!hotelOptions.length ? <option value="">Chưa có khách sạn</option> : null}
                {hotelOptions.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Tên loại phòng</span>
              <input
                type="text"
                value={roomTypeDraft.name}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    name: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Ví dụ: Deluxe Ocean Panorama"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Base price</span>
              <input
                type="number"
                min="0"
                value={roomTypeDraft.basePrice}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    basePrice: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">
                Mô tả / service text
              </span>
              <textarea
                rows="3"
                value={roomTypeDraft.servicesText}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    servicesText: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-600">Gắn amenities</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableAmenities.map((amenity) => {
                    const selected = roomTypeDraft.amenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleDraftCollectionValue("amenities", amenity.id)}
                        disabled={isSubmitting}
                        className={`rounded-full px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          selected
                            ? "bg-[#17363f] text-white"
                            : "border border-[#e7dcc8] bg-[#fcfaf6] text-textPrimary hover:bg-[#f5ecde]"
                        }`}
                      >
                        {amenity.name}
                      </button>
                    );
                  })}
                </div>
                {!availableAmenities.length ? (
                  <div className="mt-3 text-sm text-gray-500">
                    Khách sạn này chưa có amenity nào để gắn.
                  </div>
                ) : null}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600">Gắn facilities</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableFacilities.map((facility) => {
                    const selected = roomTypeDraft.facilities.includes(facility.id);
                    return (
                      <button
                        key={facility.id}
                        type="button"
                        onClick={() => toggleDraftCollectionValue("facilities", facility.id)}
                        disabled={isSubmitting}
                        className={`rounded-full px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          selected
                            ? "bg-[#c5811c] text-white"
                            : "border border-[#e7dcc8] bg-[#fcfaf6] text-textPrimary hover:bg-[#f5ecde]"
                        }`}
                      >
                        {facility.name}
                      </button>
                    );
                  })}
                </div>
                {!availableFacilities.length ? (
                  <div className="mt-3 text-sm text-gray-500">
                    Khách sạn này chưa có facility nào để gắn.
                  </div>
                ) : null}
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-[#e7c5bf] bg-[#fff2ee] px-4 py-3 text-sm text-[#aa4f3d]">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !hotelOptions.length}
                className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : editingRoomTypeId
                    ? "Lưu loại phòng"
                    : "Thêm loại phòng"}
              </button>
              {editingRoomTypeId ? (
                <button
                  type="button"
                  onClick={resetRoomTypeEditor}
                  disabled={isSubmitting}
                  className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
              Đang tải danh sách loại phòng...
            </div>
          ) : null}

          {!isLoading && !filteredRoomTypes.length ? (
            <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
              Chưa có loại phòng nào trong hệ thống.
            </div>
          ) : null}

          {filteredRoomTypes.map((roomType) => (
            <div
              key={roomType.id}
              className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-accent">
                    {roomType.hotelName}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-textPrimary">
                    {roomType.name}
                  </h3>
                </div>
                <div className="rounded-full bg-[#f5ecde] px-4 py-2 text-sm font-semibold text-textPrimary">
                  {formatCurrency(roomType.basePrice)}
                </div>
              </div>

              {roomType.servicesText ? (
                <p className="mt-4 text-sm leading-7 text-gray-600">{roomType.servicesText}</p>
              ) : null}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] bg-[#f7efe2] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent">Amenities</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roomType.amenities.map((amenity) => (
                      <span
                        key={`${roomType.id}-${amenity.id}`}
                        className="rounded-full bg-white px-3 py-2 text-sm text-textPrimary"
                      >
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] bg-[#17363f] p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#f6ddb0]">
                    Facilities
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roomType.facilities.map((facility) => (
                      <span
                        key={`${roomType.id}-${facility.id}`}
                        className="rounded-full bg-white/10 px-3 py-2 text-sm"
                      >
                        {facility.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => startRoomTypeEdit(roomType)}
                  disabled={isSubmitting}
                  className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => deleteRoomType(roomType.id)}
                  disabled={isSubmitting}
                  className="rounded-full border border-[#e7c5bf] px-4 py-2 text-sm font-medium text-[#aa4f3d] transition hover:bg-[#fff2ee] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomTypesSection;
