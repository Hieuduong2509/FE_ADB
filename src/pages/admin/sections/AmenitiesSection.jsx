const AmenitiesSection = ({
  amenityDraft,
  setAmenityDraft,
  submitAmenity,
  editingAmenityId,
  resetAmenityEditor,
  amenities,
  startAmenityEdit,
  deleteAmenity,
  isLoading,
  isSubmitting,
  errorMessage,
}) => (
  <section
    id="amenities"
    className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
  >
    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Amenities catalog
        </div>
        <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
          Quản lý catalog amenities toàn hệ thống
        </h2>

        <form onSubmit={submitAmenity} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Mã amenity</span>
              <input
                type="text"
                value={amenityDraft.code}
                onChange={(event) =>
                  setAmenityDraft((currentDraft) => ({
                    ...currentDraft,
                    code: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Icon</span>
              <input
                type="text"
                value={amenityDraft.icon}
                onChange={(event) =>
                  setAmenityDraft((currentDraft) => ({
                    ...currentDraft,
                    icon: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="wifi, bath, pool"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Tên amenity</span>
            <input
              type="text"
              value={amenityDraft.name}
              onChange={(event) =>
                setAmenityDraft((currentDraft) => ({
                  ...currentDraft,
                  name: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Mô tả</span>
            <textarea
              rows="3"
              value={amenityDraft.description}
              onChange={(event) =>
                setAmenityDraft((currentDraft) => ({
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
              disabled={isSubmitting}
              className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Đang lưu..."
                : editingAmenityId
                  ? "Lưu amenity"
                  : "Thêm amenity"}
            </button>
            {editingAmenityId ? (
              <button
                type="button"
                onClick={resetAmenityEditor}
                disabled={isSubmitting}
                className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel editing
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600 md:col-span-2">
            Loading danh sách tiện nghi...
          </div>
        ) : null}

        {!isLoading && !amenities.length ? (
          <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600 md:col-span-2">
            Chưa có tiện nghi nào trong hệ thống.
          </div>
        ) : null}

        {amenities.map((amenity) => (
          <div
            key={amenity.id}
            className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-accent">
              {amenity.code || "amenity"}
            </div>
            <h3 className="mt-3 text-xl font-semibold text-textPrimary">{amenity.name}</h3>
            {amenity.icon ? <div className="mt-2 text-sm text-gray-500">Icon: {amenity.icon}</div> : null}
            {amenity.description ? (
              <p className="mt-3 text-sm leading-7 text-gray-500">{amenity.description}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startAmenityEdit(amenity)}
                disabled={isSubmitting}
                className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteAmenity(amenity.id)}
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

export default AmenitiesSection;

