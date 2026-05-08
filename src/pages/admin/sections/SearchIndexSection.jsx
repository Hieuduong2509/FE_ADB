import { formatCurrency } from "../../../utils";

const SearchIndexSection = ({
  searchIndexStatus,
  searchIndexDraft,
  setSearchIndexDraft,
  rebuildSearchIndex,
  testSearchIndexQuery,
  searchIndexResults,
  isSearchIndexLoading,
  isSearchIndexSubmitting,
  searchIndexError,
}) => {
  const elasticsearchStatus = searchIndexStatus?.elasticsearch || null;
  const snapshotStatus = searchIndexStatus?.snapshot || null;

  return (
  <section
    id="search-index"
    className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
  >
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Search index
        </div>
        <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
          Rebuild index và test query Elasticsearch
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] bg-[#17363f] p-5 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-[#f6ddb0]">Cluster</div>
            <div className="mt-2 text-2xl font-semibold">
              {elasticsearchStatus?.clusterHealth || "unknown"}
            </div>
            <div className="mt-2 text-sm text-white/72">
              {elasticsearchStatus?.configured ? "Elasticsearch configured" : "Chưa cấu hình"}
            </div>
          </div>

          <div className="rounded-[24px] bg-[#f7efe2] p-5 text-textPrimary">
            <div className="text-xs uppercase tracking-[0.18em] text-accent">Snapshot docs</div>
            <div className="mt-2 text-2xl font-semibold">
              {snapshotStatus?.documentCount || 0}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Collection: {snapshotStatus?.collectionName || "room_inventory_daily"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-accent">Elasticsearch docs</div>
            <div className="mt-2 text-2xl font-semibold text-textPrimary">
              {elasticsearchStatus?.documentCount || 0}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Index: {elasticsearchStatus?.indexName || "hotel_room_inventory"}
            </div>
          </div>
          <div className="rounded-[24px] border border-[#ece2d3] bg-[#fffcf7] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-accent">Snapshot range</div>
            <div className="mt-2 text-sm font-semibold text-textPrimary">
              {snapshotStatus?.dateFrom || "-"} → {snapshotStatus?.dateTo || "-"}
            </div>
          </div>
        </div>

        {snapshotStatus?.error || elasticsearchStatus?.error ? (
          <div className="mt-4 rounded-2xl border border-[#e7c5bf] bg-[#fff2ee] px-4 py-3 text-sm text-[#aa4f3d]">
            {snapshotStatus?.error || elasticsearchStatus?.error}
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void rebuildSearchIndex();
          }}
          className="mt-6 space-y-4"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">
              Horizon days để rebuild
            </span>
            <input
              type="number"
              min="1"
              value={searchIndexDraft.horizonDays}
              onChange={(event) =>
                setSearchIndexDraft((currentDraft) => ({
                  ...currentDraft,
                  horizonDays: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
            />
          </label>

          {searchIndexError ? (
            <div className="rounded-2xl border border-[#e7c5bf] bg-[#fff2ee] px-4 py-3 text-sm text-[#aa4f3d]">
              {searchIndexError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSearchIndexSubmitting}
            className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearchIndexSubmitting ? "Đang rebuild..." : "Rebuild search index"}
          </button>
        </form>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void testSearchIndexQuery();
          }}
          className="mt-8 space-y-4"
        >
          <div className="text-lg font-semibold text-textPrimary">Test query</div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-600">Search text</span>
              <input
                type="text"
                value={searchIndexDraft.search}
                onChange={(event) =>
                  setSearchIndexDraft((currentDraft) => ({
                    ...currentDraft,
                    search: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                placeholder="Pullman, Da Nang, Suite..."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Check-in</span>
              <input
                type="date"
                value={searchIndexDraft.checkIn}
                onChange={(event) =>
                  setSearchIndexDraft((currentDraft) => ({
                    ...currentDraft,
                    checkIn: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Check-out</span>
              <input
                type="date"
                value={searchIndexDraft.checkOut}
                onChange={(event) =>
                  setSearchIndexDraft((currentDraft) => ({
                    ...currentDraft,
                    checkOut: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Guests</span>
              <select
                value={searchIndexDraft.guests}
                onChange={(event) =>
                  setSearchIndexDraft((currentDraft) => ({
                    ...currentDraft,
                    guests: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              >
                <option value="1 người">1 người</option>
                <option value="2 người">2 người</option>
                <option value="3 người">3 người</option>
                <option value="4 người">4 người</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Stars</span>
              <select
                value={searchIndexDraft.stars}
                onChange={(event) =>
                  setSearchIndexDraft((currentDraft) => ({
                    ...currentDraft,
                    stars: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              >
                <option value="">Tất cả</option>
                <option value="5">5 sao trở lên</option>
                <option value="4">4 sao trở lên</option>
                <option value="3">3 sao trở lên</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Min price</span>
              <input
                type="number"
                min="0"
                value={searchIndexDraft.minPrice}
                onChange={(event) =>
                  setSearchIndexDraft((currentDraft) => ({
                    ...currentDraft,
                    minPrice: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Max price</span>
              <input
                type="number"
                min="0"
                value={searchIndexDraft.maxPrice}
                onChange={(event) =>
                  setSearchIndexDraft((currentDraft) => ({
                    ...currentDraft,
                    maxPrice: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSearchIndexSubmitting}
            className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearchIndexSubmitting ? "Đang test..." : "Test query"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-textPrimary">Kết quả test</h3>
          <div className="text-sm text-gray-500">
            {isSearchIndexLoading ? "Đang tải..." : `${searchIndexResults.length} hotel`}
          </div>
        </div>

        {searchIndexResults.map((hotel) => (
          <div
            key={hotel.id}
            className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent">
                  {hotel.countryName} · {hotel.cityAddress}
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-textPrimary">{hotel.name}</h3>
              </div>
              <div className="rounded-full bg-[#17363f] px-4 py-2 text-sm font-semibold text-white">
                từ {formatCurrency(hotel.priceFrom)}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {(hotel.matchedRoomTypes || []).slice(0, 3).map((roomType) => (
                <div
                  key={`${hotel.id}-${roomType.roomTypeId}`}
                  className="rounded-2xl bg-[#f7efe2] px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-textPrimary">{roomType.name}</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(roomType.averageNightlyRate)} / đêm
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                còn {roomType.availableRoomCount} / {roomType.totalRoomCount} phòng
              </div>
            </div>
          ))}
            </div>
          </div>
        ))}

        {!isSearchIndexLoading && !searchIndexResults.length ? (
          <div className="rounded-[28px] border border-dashed border-[#e3d6c1] bg-[#fffaf1] p-5 text-sm text-gray-500">
            Chưa có kết quả test query.
          </div>
        ) : null}
      </div>
    </div>
  </section>
  );
};

export default SearchIndexSection;
