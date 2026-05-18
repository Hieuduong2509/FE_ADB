import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 4;

const HotelsSection = ({
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
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(hotels.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setPage(1);
  }, [hotels.length]);

  const currentPage = Math.min(page, totalPages);
  const pagedHotels = useMemo(
    () => hotels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [hotels, currentPage],
  );

  return (
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
          CRUD hotel information in admin workspace
        </h2>

        <form onSubmit={submitHotel} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Hotel code</span>
              <input
                type="text"
                value={hotelDraft.code}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({ ...currentDraft, code: event.target.value }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="pullman-saigon"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Hotel name</span>
              <input
                type="text"
                value={hotelDraft.name}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({
                    ...currentDraft,
                    name: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Example: Pullman Saigon Centre"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Brand</span>
              <input
                type="text"
                value={hotelDraft.brand}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({
                    ...currentDraft,
                    brand: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Country</span>
              <input
                type="text"
                value={hotelDraft.country}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({
                    ...currentDraft,
                    country: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">City</span>
              <input
                type="text"
                value={hotelDraft.city}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({
                    ...currentDraft,
                    city: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">District / area</span>
              <input
                type="text"
                value={hotelDraft.district}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({
                    ...currentDraft,
                    district: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Address</span>
            <input
              type="text"
              value={hotelDraft.address}
              onChange={(event) =>
                setHotelDraft((currentDraft) => ({
                  ...currentDraft,
                  address: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">Hotel image URLs (one per line)</span>
            <textarea
              rows="4"
              value={hotelDraft.imageUrlsText || ""}
              onChange={(event) =>
                setHotelDraft((currentDraft) => ({
                  ...currentDraft,
                  imageUrlsText: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="https://.../hotel-cover.jpg"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
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
              <span className="mb-2 block text-sm font-medium text-gray-600">Total rooms</span>
              <input
                type="number"
                min="0"
                value={hotelDraft.totalRooms}
                onChange={(event) =>
                  setHotelDraft((currentDraft) => ({
                    ...currentDraft,
                    totalRooms: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10 disabled:cursor-not-allowed disabled:opacity-60"
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
              {isSubmitting ? "Saving..." : editingHotelId ? "Save hotel" : "Add hotel"}
            </button>
            {editingHotelId ? (
              <button
                type="button"
                onClick={resetHotelEditor}
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
            Loading hotel list...
          </div>
        ) : null}

        {!isLoading && !hotels.length ? (
          <div className="rounded-[28px] border border-dashed border-[#d8ccb8] bg-[#fffcf7] p-5 text-sm text-gray-600">
            No hotels are available in the system.
          </div>
        ) : null}

        {pagedHotels.map((hotel) => (
          <div key={hotel.id} className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-accent">
                    {hotel.country || "No country"}{hotel.city ? ` · ${hotel.city}` : ""}
                  </div>
                <h3 className="mt-2 text-2xl font-semibold text-textPrimary">{hotel.name}</h3>
              </div>
              <div className="rounded-full bg-[#17363f] px-4 py-2 text-sm font-semibold text-white">
                {hotel.starRating} stars
              </div>
            </div>

            {hotel.address ? (
              <div className="mt-4 text-sm text-gray-600">{hotel.address}</div>
            ) : null}

            {Array.isArray(hotel.imageUrls) && hotel.imageUrls.length ? (
              <img
                src={hotel.imageUrls[0]}
                alt={hotel.name}
                className="mt-4 h-40 w-full rounded-2xl object-cover"
              />
            ) : null}

            {hotel.timeZone ? (
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Timezone: {hotel.timeZone} · Rooms: {hotel.totalRooms || 0}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startHotelEdit(hotel)}
                disabled={isSubmitting}
                className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteHotel(hotel.id)}
                disabled={isSubmitting}
                className="rounded-full border border-[#e7c5bf] px-4 py-2 text-sm font-medium text-[#aa4f3d] transition hover:bg-[#fff2ee] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!isLoading && hotels.length > ITEMS_PER_PAGE ? (
          <div className="flex items-center justify-center gap-2">
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

export default HotelsSection;

