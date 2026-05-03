const HotelsSection = ({
  countryOptions,
  hotelDraft,
  setHotelDraft,
  submitHotel,
  editingHotelId,
  resetHotelEditor,
  hotels,
  startHotelEdit,
  deleteHotel,
  isLoading,
  isSubmitting,
  errorMessage,
}) => (
  <section
    id="hotels"
    className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
  >
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Hotel manager
        </div>
        <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
          CRUD thông tin khách sạn trong admin workspace
        </h2>

        <form onSubmit={submitHotel} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Quốc gia</span>
            <select
              value={hotelDraft.countryId}
              onChange={(event) =>
                setHotelDraft((currentDraft) => ({
                  ...currentDraft,
                  countryId: event.target.value,
                }))
              }
              disabled={isSubmitting || !countryOptions.length}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Chọn quốc gia</option>
              {countryOptions.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                  {country.code ? ` (${country.code})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Tên khách sạn</span>
            <input
              type="text"
              value={hotelDraft.name}
              onChange={(event) =>
                setHotelDraft((currentDraft) => ({ ...currentDraft, name: event.target.value }))
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Ví dụ: Pullman Hai Phong Grand Hotel"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Địa chỉ / thành phố</span>
              <input
                type="text"
                value={hotelDraft.cityAddress}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({
                    ...currentDraft,
                    cityAddress: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Star rating</span>
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={hotelDraft.starRating}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({
                    ...currentDraft,
                    starRating: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Timezone</span>
            <input
              type="text"
              value={hotelDraft.timeZone}
              onChange={(event) =>
                setHotelDraft((currentDraft) => ({
                  ...currentDraft,
                  timeZone: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Mô tả</span>
            <textarea
              rows="4"
              value={hotelDraft.description}
              onChange={(event) =>
                setHotelDraft((currentDraft) => ({
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
              {isSubmitting ? "Đang lưu..." : editingHotelId ? "Lưu khách sạn" : "Thêm khách sạn"}
            </button>
            {editingHotelId ? (
              <button
                type="button"
                onClick={resetHotelEditor}
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
            Đang tải danh sách khách sạn...
          </div>
        ) : null}

        {!isLoading && !hotels.length ? (
          <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
            Chưa có khách sạn nào trong hệ thống.
          </div>
        ) : null}

        {hotels.map((hotel) => (
          <div key={hotel.id} className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent">
                  {countryOptions.find((country) => String(country.id) === String(hotel.countryId))
                    ?.name || "Chưa gán quốc gia"}
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-textPrimary">{hotel.name}</h3>
              </div>
              <div className="rounded-full bg-[#17363f] px-4 py-2 text-sm font-semibold text-white">
                {hotel.starRating} sao
              </div>
            </div>

            {hotel.timeZone ? (
              <div className="mt-4 text-sm text-gray-600">Timezone: {hotel.timeZone}</div>
            ) : null}

            {hotel.description ? (
              <p className="mt-3 text-sm leading-7 text-gray-600">{hotel.description}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startHotelEdit(hotel)}
                disabled={isSubmitting}
                className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => deleteHotel(hotel.id)}
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

export default HotelsSection;
