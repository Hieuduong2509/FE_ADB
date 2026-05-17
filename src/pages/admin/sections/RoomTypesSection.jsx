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
  const selectedAmenityIds = Array.isArray(roomTypeDraft.amenities) ? roomTypeDraft.amenities.map(String) : [];
  const selectedFacilityIds = Array.isArray(roomTypeDraft.facilities)
    ? roomTypeDraft.facilities.map(String)
    : [];

  const amenityMap = new Map(amenities.map((amenity) => [String(amenity.id), amenity]));
  const facilityMap = new Map(facilities.map((facility) => [String(facility.id), facility]));

  const toggleDraftValue = (field, value) => {
    setRoomTypeDraft((currentDraft) => {
      const currentValues = Array.isArray(currentDraft[field]) ? currentDraft[field].map(String) : [];
      const normalizedValue = String(value);
      const nextValues = currentValues.includes(normalizedValue)
        ? currentValues.filter((item) => item !== normalizedValue)
        : [...currentValues, normalizedValue];

      return {
        ...currentDraft,
        [field]: nextValues,
      };
    });
  };

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
            CRUD loại phòng theo schema backend hiện tại
          </h2>

          <form onSubmit={submitRoomType} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Hotel</span>
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

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Mã loại phòng</span>
                <input
                  type="text"
                  value={roomTypeDraft.code}
                  onChange={(event) =>
                    setRoomTypeDraft((currentDraft) => ({
                      ...currentDraft,
                      code: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                <span className="mb-2 block text-sm font-medium text-gray-600">Diện tích (m2)</span>
                <input
                  type="number"
                  min="0"
                  value={roomTypeDraft.roomSize}
                  onChange={(event) =>
                    setRoomTypeDraft((currentDraft) => ({
                      ...currentDraft,
                      roomSize: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Người lớn</span>
                <input
                  type="number"
                  min="0"
                  value={roomTypeDraft.maxAdults}
                  onChange={(event) =>
                    setRoomTypeDraft((currentDraft) => ({
                      ...currentDraft,
                      maxAdults: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Trẻ em</span>
                <input
                  type="number"
                  min="0"
                  value={roomTypeDraft.maxChildren}
                  onChange={(event) =>
                    setRoomTypeDraft((currentDraft) => ({
                      ...currentDraft,
                      maxChildren: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Inventory</span>
                <input
                  type="number"
                  min="0"
                  value={roomTypeDraft.totalInventory}
                  onChange={(event) =>
                    setRoomTypeDraft((currentDraft) => ({
                      ...currentDraft,
                      totalInventory: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Loại giường</span>
              <input
                type="text"
                value={roomTypeDraft.bedType}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    bedType: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#e7dcc8] bg-[#fcfaf6] p-4">
                <div className="mb-3 text-sm font-medium text-gray-600">Amenities gắn vào phòng</div>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => {
                    const isSelected = selectedAmenityIds.includes(String(amenity.id));

                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleDraftValue("amenities", amenity.id)}
                        disabled={isSubmitting}
                        className={`rounded-full border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          isSelected
                            ? "border-[#17363f] bg-[#17363f] text-white"
                            : "border-[#d8ccb8] bg-white text-textPrimary hover:bg-[#faf4ea]"
                        }`}
                      >
                        {amenity.name}
                      </button>
                    );
                  })}
                  {!amenities.length ? (
                    <div className="text-sm text-gray-500">Chưa có amenity nào trong catalog.</div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#e7dcc8] bg-[#fcfaf6] p-4">
                <div className="mb-3 text-sm font-medium text-gray-600">Facilities áp cho room type</div>
                <div className="flex flex-wrap gap-2">
                  {availableFacilities.map((facility) => {
                    const isSelected = selectedFacilityIds.includes(String(facility.id));

                    return (
                      <button
                        key={facility.id}
                        type="button"
                        onClick={() => toggleDraftValue("facilities", facility.id)}
                        disabled={isSubmitting}
                        className={`rounded-full border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          isSelected
                            ? "border-[#8b5e34] bg-[#8b5e34] text-white"
                            : "border-[#d8ccb8] bg-white text-textPrimary hover:bg-[#faf4ea]"
                        }`}
                      >
                        {facility.name}
                      </button>
                    );
                  })}
                  {!availableFacilities.length ? (
                    <div className="text-sm text-gray-500">Hotel này chưa có facility nào để gắn.</div>
                  ) : null}
                </div>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Mô tả</span>
              <textarea
                rows="3"
                value={roomTypeDraft.description}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    description: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

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
                  Cancel editing
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
              Loading danh sách loại phòng...
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

              {roomType.description ? (
                <p className="mt-4 text-sm leading-7 text-gray-600">{roomType.description}</p>
              ) : null}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] bg-[#f7efe2] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent">Capacity</div>
                  <div className="mt-3 text-sm text-textPrimary">
                    {roomType.maxAdults} người lớn · {roomType.maxChildren} trẻ em
                  </div>
                </div>

                <div className="rounded-[22px] bg-[#17363f] p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#f6ddb0]">
                    Room info
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-white/84">
                    <div>{roomType.roomSize || 0} m2</div>
                    <div>{roomType.bedType || "Chưa khai báo giường"}</div>
                    <div>Inventory: {roomType.totalInventory || 0}</div>
                  </div>
                </div>
              </div>

              {roomType.amenities.length ? (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent">Amenities</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roomType.amenities.map((amenityId) => (
                      <div
                        key={`${roomType.id}-amenity-${amenityId}`}
                        className="rounded-full bg-[#f5ecde] px-3 py-2 text-sm text-textPrimary"
                      >
                        {amenityMap.get(String(amenityId))?.name || amenityId}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {roomType.facilities.length ? (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent">Facilities</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roomType.facilities.map((facilityId) => (
                      <div
                        key={`${roomType.id}-facility-${facilityId}`}
                        className="rounded-full bg-[#17363f] px-3 py-2 text-sm text-white"
                      >
                        {facilityMap.get(String(facilityId))?.name || facilityId}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => startRoomTypeEdit(roomType)}
                  disabled={isSubmitting}
                  className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteRoomType(roomType.id)}
                  disabled={isSubmitting}
                  className="rounded-full border border-[#e7c5bf] px-4 py-2 text-sm font-medium text-[#aa4f3d] transition hover:bg-[#fff2ee] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete
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

