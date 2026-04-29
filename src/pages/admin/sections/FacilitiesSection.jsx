import { formatCurrency } from "../../../utils";

const FacilitiesSection = ({
  facilityDraft,
  setFacilityDraft,
  submitFacility,
  editingFacilityId,
  resetFacilityEditor,
  facilities,
  startFacilityEdit,
  deleteFacility,
}) => (
  <section
    id="facilities"
    className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
  >
    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Facilities manager
        </div>
        <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
          Thêm, sửa, xóa facilities cho flow booking
        </h2>

        <form onSubmit={submitFacility} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Tên facility</span>
            <input
              type="text"
              value={facilityDraft.name}
              onChange={(event) =>
                setFacilityDraft((currentDraft) => ({
                  ...currentDraft,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Giá</span>
              <input
                type="number"
                min="0"
                value={facilityDraft.price}
                onChange={(event) =>
                  setFacilityDraft((currentDraft) => ({
                    ...currentDraft,
                    price: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Tag</span>
              <input
                type="text"
                value={facilityDraft.tag}
                onChange={(event) =>
                  setFacilityDraft((currentDraft) => ({
                    ...currentDraft,
                    tag: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Mô tả</span>
            <textarea
              rows="3"
              value={facilityDraft.description}
              onChange={(event) =>
                setFacilityDraft((currentDraft) => ({
                  ...currentDraft,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
            >
              {editingFacilityId ? "Lưu facility" : "Thêm facility"}
            </button>
            {editingFacilityId ? (
              <button
                type="button"
                onClick={resetFacilityEditor}
                className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
              >
                Hủy chỉnh sửa
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="rounded-full bg-[#f5ecde] px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent">
                  {facility.tag}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-textPrimary">{facility.name}</h3>
              </div>
              <div className="text-lg font-semibold text-textPrimary">
                {formatCurrency(facility.price)}
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-gray-600">{facility.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startFacilityEdit(facility)}
                className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => deleteFacility(facility.id)}
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

export default FacilitiesSection;
