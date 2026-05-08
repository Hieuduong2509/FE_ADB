const CountriesSection = ({
  countryDraft,
  setCountryDraft,
  submitCountry,
  editingCountryId,
  resetCountryEditor,
  countries,
  startCountryEdit,
  deleteCountry,
  isLoading,
  isSubmitting,
  errorMessage,
}) => (
  <section
    id="countries"
    className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
  >
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Country manager
        </div>
        <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
          CRUD quốc gia cho catalog khách sạn
        </h2>

        <form onSubmit={submitCountry} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Mã quốc gia</span>
              <input
                type="text"
                value={countryDraft.code}
                onChange={(event) =>
                  setCountryDraft((currentDraft) => ({
                    ...currentDraft,
                    code: event.target.value.toUpperCase(),
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm uppercase outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="VN"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Tên quốc gia</span>
              <input
                type="text"
                value={countryDraft.name}
                onChange={(event) =>
                  setCountryDraft((currentDraft) => ({
                    ...currentDraft,
                    name: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Việt Nam"
              />
            </label>
          </div>

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
              {isSubmitting ? "Đang lưu..." : editingCountryId ? "Lưu quốc gia" : "Thêm quốc gia"}
            </button>
            {editingCountryId ? (
              <button
                type="button"
                onClick={resetCountryEditor}
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
            Đang tải danh sách quốc gia...
          </div>
        ) : null}

        {!isLoading && !countries.length ? (
          <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
            Chưa có quốc gia nào trong hệ thống.
          </div>
        ) : null}

        {countries.map((country) => (
          <div
            key={country.id}
            className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent">
                  {country.code}
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-textPrimary">{country.name}</h3>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startCountryEdit(country)}
                disabled={isSubmitting}
                className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => deleteCountry(country.id)}
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

export default CountriesSection;
