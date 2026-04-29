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
}) => (
  <section
    id="room-types"
    className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
  >
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Room type builder
        </div>
        <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
          Thêm room type mới và gắn inventory liên quan
        </h2>

        <form onSubmit={submitRoomType} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Khách sạn</span>
              <select
                value={roomTypeDraft.hotelId}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    hotelId: event.target.value,
                  }))
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

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Category</span>
              <select
                value={roomTypeDraft.category}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    category: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              >
                <option>Superior</option>
                <option>Deluxe</option>
                <option>Executive</option>
                <option>Suite</option>
                <option>Family</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Tên hiển thị</span>
            <input
              type="text"
              value={roomTypeDraft.name}
              onChange={(event) =>
                setRoomTypeDraft((currentDraft) => ({
                  ...currentDraft,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              placeholder="Ví dụ: Deluxe Ocean Panorama"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Mô tả ngắn</span>
            <textarea
              rows="3"
              value={roomTypeDraft.intro}
              onChange={(event) =>
                setRoomTypeDraft((currentDraft) => ({
                  ...currentDraft,
                  intro: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
            />
          </label>

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
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Sức chứa</span>
              <input
                type="number"
                min="1"
                value={roomTypeDraft.capacity}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    capacity: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Diện tích</span>
              <input
                type="text"
                value={roomTypeDraft.size}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    size: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">View</span>
              <input
                type="text"
                value={roomTypeDraft.view}
                onChange={(event) =>
                  setRoomTypeDraft((currentDraft) => ({
                    ...currentDraft,
                    view: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Cấu hình giường</span>
            <input
              type="text"
              value={roomTypeDraft.bed}
              onChange={(event) =>
                setRoomTypeDraft((currentDraft) => ({
                  ...currentDraft,
                  bed: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
            />
          </label>

          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-600">Gắn amenities</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {amenities.map((amenity) => {
                  const selected = roomTypeDraft.amenities.includes(amenity.name);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleDraftCollectionValue("amenities", amenity.name)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
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
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600">Gắn facilities</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {facilities.map((facility) => {
                  const selected = roomTypeDraft.facilities.includes(facility.id);
                  return (
                    <button
                      key={facility.id}
                      type="button"
                      onClick={() => toggleDraftCollectionValue("facilities", facility.id)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
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
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
            >
              {editingRoomTypeId ? "Lưu room type" : "Thêm room type"}
            </button>
            {editingRoomTypeId ? (
              <button
                type="button"
                onClick={resetRoomTypeEditor}
                className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
              >
                Hủy chỉnh sửa
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="space-y-4">
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
                <h3 className="mt-2 text-2xl font-semibold text-textPrimary">{roomType.name}</h3>
                <div className="mt-2 text-sm text-gray-600">
                  {roomType.category} · {roomType.bed} · {roomType.view}
                </div>
              </div>
              <div className="rounded-full bg-[#f5ecde] px-4 py-2 text-sm font-semibold text-textPrimary">
                {formatCurrency(roomType.basePrice)}
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-gray-600">{roomType.intro}</p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] bg-[#f7efe2] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-accent">Amenities</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {roomType.amenities.map((amenityName) => (
                    <span
                      key={`${roomType.id}-${amenityName}`}
                      className="rounded-full bg-white px-3 py-2 text-sm text-textPrimary"
                    >
                      {amenityName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] bg-[#17363f] p-4 text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-[#f6ddb0]">Facilities</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {roomType.facilities.map((facilityId) => {
                    const facility = facilities.find((item) => item.id === facilityId);
                    return (
                      <span
                        key={`${roomType.id}-${facilityId}`}
                        className="rounded-full bg-white/10 px-3 py-2 text-sm"
                      >
                        {facility?.name || facilityId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startRoomTypeEdit(roomType)}
                className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => deleteRoomType(roomType.id)}
                className="rounded-full border border-[#e7c5bf] px-4 py-2 text-sm font-medium text-[#aa4f3d] transition hover:bg-[#fff2ee]"
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

export default RoomTypesSection;
