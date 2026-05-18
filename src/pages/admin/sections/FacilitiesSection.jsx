import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "../../../utils";

const pricingTypeLabels = {
  per_use: "Per use",
  per_night: "Per night",
  one_time: "One-time",
};

const ITEMS_PER_PAGE = 6;

const FacilitiesSection = ({
  hotelOptions,
  facilityDraft,
  setFacilityDraft,
  submitFacility,
  editingFacilityId,
  resetFacilityEditor,
  facilities,
  startFacilityEdit,
  deleteFacility,
  isLoading,
  isSubmitting,
  errorMessage,
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(facilities.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setPage(1);
  }, [facilities.length]);

  const currentPage = Math.min(page, totalPages);
  const pagedFacilities = useMemo(
    () => facilities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [facilities, currentPage],
  );

  return (
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
          Manage facilities based on current backend schema
        </h2>

        <form onSubmit={submitFacility} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Hotel</span>
              <select
                value={facilityDraft.hotelId}
                onChange={(event) =>
                  setFacilityDraft((currentDraft) => ({
                    ...currentDraft,
                    hotelId: event.target.value,
                  }))
                }
                disabled={!hotelOptions.length || isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {!hotelOptions.length ? <option value="">No hotels available</option> : null}
                {hotelOptions.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Facility type</span>
              <input
                type="text"
                value={facilityDraft.facilityType}
                onChange={(event) =>
                  setFacilityDraft((currentDraft) => ({
                    ...currentDraft,
                    facilityType: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Facility code</span>
              <input
                type="text"
                value={facilityDraft.code}
                onChange={(event) =>
                  setFacilityDraft((currentDraft) => ({
                    ...currentDraft,
                    code: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Billing type</span>
              <select
                value={facilityDraft.pricingType}
                onChange={(event) =>
                  setFacilityDraft((currentDraft) => ({
                    ...currentDraft,
                    pricingType: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="per_use">Per use</option>
                <option value="per_night">Per night</option>
                <option value="one_time">One-time</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Service name</span>
            <input
              type="text"
              value={facilityDraft.name}
              onChange={(event) =>
                setFacilityDraft((currentDraft) => ({
                  ...currentDraft,
                  name: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Icon URL</span>
            <input
              type="text"
              value={facilityDraft.icon || ""}
              onChange={(event) =>
                setFacilityDraft((currentDraft) => ({
                  ...currentDraft,
                  icon: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="https://.../spa-icon.svg"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Description</span>
            <textarea
              rows="3"
              value={facilityDraft.description}
              onChange={(event) =>
                setFacilityDraft((currentDraft) => ({
                  ...currentDraft,
                  description: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Price</span>
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
                ? "Saving..."
                : editingFacilityId
                  ? "Save service"
                  : "Add service"}
            </button>
            {editingFacilityId ? (
              <button
                type="button"
                onClick={resetFacilityEditor}
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
            Loading service list...
          </div>
        ) : null}

        {!isLoading && !facilities.length ? (
          <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600 md:col-span-2">
            No services in the system yet.
          </div>
        ) : null}

        {pagedFacilities.map((facility) => (
          <div
            key={facility.id}
            className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="rounded-full bg-[#f5ecde] px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent">
                  {facility.facilityType || "service"}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-textPrimary">{facility.name}</h3>
                <div className="mt-2 text-sm text-gray-500">{facility.hotelName}</div>
                {facility.icon ? (
                  <img src={facility.icon} alt={facility.name} className="mt-2 h-6 w-6 object-contain" />
                ) : null}
                <div className="mt-2 text-sm text-gray-500">
                  {pricingTypeLabels[facility.pricingType] || facility.pricingType}
                </div>
              </div>
              <div className="text-lg font-semibold text-textPrimary">
                {formatCurrency(facility.price)}
              </div>
            </div>
            {facility.description ? (
              <p className="mt-3 text-sm leading-7 text-gray-500">{facility.description}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startFacilityEdit(facility)}
                disabled={isSubmitting}
                className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteFacility(facility.id)}
                disabled={isSubmitting}
                className="rounded-full border border-[#e7c5bf] px-4 py-2 text-sm font-medium text-[#aa4f3d] transition hover:bg-[#fff2ee] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!isLoading && facilities.length > ITEMS_PER_PAGE ? (
          <div className="md:col-span-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage <= 1}
              className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm text-textPrimary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm text-textPrimary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  </section>
  );
};

export default FacilitiesSection;

