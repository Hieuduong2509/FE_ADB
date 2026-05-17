import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, getHotelDetailPath } from "../constants";
import { formatCurrency } from "../utils";
import { getClientHotelsApi } from "../utils/auth";
import {
  buildSearchParams,
  createDefaultSearchFilters,
  validateStayDates,
} from "../utils/search";

const staySignals = [
  { value: "API", label: "hotel and room type data is loaded from the backend" },
  { value: "LIVE", label: "booking prices are calculated from seasonal and specific-date pricing" },
  { value: "REAL", label: "add-on services are loaded from database records" },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState(() => createDefaultSearchFilters());
  const [searchError, setSearchError] = useState("");
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      setIsLoading(true);
      try {
        const data = await getClientHotelsApi(createDefaultSearchFilters());
        setHotels(Array.isArray(data) ? data : []);
      } catch {
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadHotels();
  }, []);

  const spotlightHotels = hotels.slice(0, 3);
  const destinationOptions = ["All", ...new Set(hotels.map((hotel) => hotel.cityAddress).filter(Boolean))];
  const roomTypeOptions = [
    "All",
    ...new Set(hotels.flatMap((hotel) => hotel.matchedRoomTypes?.map((roomType) => roomType.name) || [])),
  ];
  const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests"];
  const starOptions = ["", "5", "4", "3"];

  const handleFieldChange = (field) => (event) => {
    setSearchForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
    setSearchError("");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const nextError = validateStayDates(searchForm.checkIn, searchForm.checkOut);
    if (nextError) {
      setSearchError(nextError);
      return;
    }

    navigate(`${ROUTES.HOTELS}?${buildSearchParams(searchForm).toString()}`);
  };

  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-white/40">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(145deg,_#14323a_0%,_#204c4f_36%,_#f0dfbe_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(252,246,232,0.32),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(235,203,144,0.34),_transparent_18%)]" />

        <div className="container mx-auto grid gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#f8e2b4] backdrop-blur">
              Real booking catalog
            </div>
            <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              The home page now loads hotels, room types, and prices from the backend instead of mock data.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
              Users can move from search to booking with one consistent live data source and
              stay-date pricing logic.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={ROUTES.HOTELS}
                className="rounded-full bg-[#f8deb0] px-6 py-3 text-sm font-semibold text-[#133039] transition hover:-translate-y-0.5 hover:bg-[#fde8c4]"
              >
                Open search page
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {staySignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur"
                >
                  <div className="text-3xl font-semibold text-[#f8deb0]">{signal.value}</div>
                  <div className="mt-2 text-sm leading-6 text-white/74">{signal.label}</div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="rounded-[32px] border border-white/40 bg-[rgba(252,248,241,0.95)] p-5 shadow-[0_24px_80px_rgba(9,26,30,0.24)] backdrop-blur md:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                  Quick hotel search
                </p>
                <h2 className="mt-2 max-w-lg text-2xl font-semibold leading-tight text-textPrimary">
                  Choose destination, stay dates, and room type to jump straight to search.
                </h2>
              </div>
              <div className="rounded-3xl bg-[#17363f] px-4 py-3 text-white">
                <div className="text-xs uppercase tracking-[0.2em] text-[#f4d7a2]">Trending</div>
                <div className="mt-1 text-lg font-semibold">
                  {spotlightHotels[0]?.name || "Hotel Booking"}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-600">
                  Search by hotel name / city
                </span>
                <input
                  type="text"
                  value={searchForm.search}
                  onChange={handleFieldChange("search")}
                  placeholder="Example: Da Nang, Pullman, beach"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Destination</span>
                <select
                  value={searchForm.destination}
                  onChange={handleFieldChange("destination")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                >
                  {destinationOptions.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Room type</span>
                <select
                  value={searchForm.roomType}
                  onChange={handleFieldChange("roomType")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                >
                  {roomTypeOptions.map((roomType) => (
                    <option key={roomType} value={roomType}>
                      {roomType}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Check-in</span>
                <input
                  type="date"
                  value={searchForm.checkIn}
                  onChange={handleFieldChange("checkIn")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Check-out</span>
                <input
                  type="date"
                  value={searchForm.checkOut}
                  onChange={handleFieldChange("checkOut")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-600">Guests</span>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <select
                    value={searchForm.guests}
                    onChange={handleFieldChange("guests")}
                    className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                  >
                    {guestOptions.map((guestOption) => (
                      <option key={guestOption} value={guestOption}>
                        {guestOption}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-2xl bg-[#183b44] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#102d34]"
                  >
                    Search hotels
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Giá tối thiểu / đêm</span>
                <input
                  type="number"
                  min="0"
                  value={searchForm.minPrice}
                  onChange={handleFieldChange("minPrice")}
                  placeholder="1000000"
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Hạng sao tối thiểu</span>
                <select
                  value={searchForm.stars}
                  onChange={handleFieldChange("stars")}
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#183b44] focus:ring-4 focus:ring-[#183b44]/10"
                >
                  <option value="">All</option>
                  {starOptions
                    .filter(Boolean)
                    .map((star) => (
                      <option key={star} value={star}>
                        {star} sao trở lên
                      </option>
                    ))}
                </select>
              </label>
            </div>

            {searchError ? (
              <div className="mt-4 rounded-[22px] border border-[#e7c5bf] bg-[#fff2ee] px-4 py-3 text-sm text-[#aa4f3d]">
                {searchError}
              </div>
            ) : null}
          </form>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-accent">
              Spotlight Hotels
            </p>
            <h2 className="mt-3 font-serif text-3xl text-textPrimary md:text-4xl">
              Danh sách khách sạn đang có giá và room type thật từ database.
            </h2>
          </div>
          <Link
            to={ROUTES.HOTELS}
            className="inline-flex w-fit items-center rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-white"
          >
            Xem toàn bộ kết quả tìm kiếm
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {isLoading ? (
            <div className="rounded-[30px] border border-dashed border-[#d9ccb8] bg-white p-10 text-center xl:col-span-3">
              Loading khách sạn...
            </div>
          ) : null}

          {!isLoading &&
            spotlightHotels.map((hotel) => (
              <article
                key={hotel.id}
                className="overflow-hidden rounded-[30px] border border-[#e5dbc9] bg-white shadow-[0_18px_48px_rgba(27,37,37,0.08)]"
              >
                <div className="relative h-64 bg-[linear-gradient(160deg,_#1d4247_0%,_#335b56_44%,_#d5b37b_100%)] p-6 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f8deb0]">
                      {hotel.countryName || "Destination"}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/10 px-3 py-1 text-xs">
                      {hotel.starRating} sao
                    </span>
                  </div>
                  <div className="mt-16 max-w-xs">
                    <p className="text-sm uppercase tracking-[0.24em] text-white/70">
                      {hotel.cityAddress}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold leading-tight">{hotel.name}</h3>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <p className="text-sm leading-6 text-gray-600">
                    {hotel.description || "Hotel hiện đã được đồng bộ từ backend."}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[22px] bg-[#f8f4ed] p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
                        Giá trung bình / đêm
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-textPrimary">
                        {formatCurrency(hotel.priceFrom)}
                      </div>
                    </div>
                    <div className="rounded-[22px] bg-[#17363f] p-4 text-white">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#f8deb0]">
                        Room types phù hợp
                      </div>
                    <div className="mt-2 text-2xl font-semibold">
                      {hotel.matchedRoomTypes.length}
                    </div>
                    <div className="mt-1 text-sm text-white/70">
                      Tổng kỳ nghỉ từ {formatCurrency(hotel.stayTotalFrom)}
                    </div>
                    <div className="mt-1 text-sm text-white/70">
                      Còn {hotel.availableRoomCountTotal || 0} phòng
                    </div>
                  </div>
                </div>

                  <div className="flex flex-wrap gap-3">
                    {hotel.matchedRoomTypes[0] ? (
                      <Link
                        to={`${getHotelDetailPath(hotel.id)}?${buildSearchParams({
                          ...createDefaultSearchFilters(),
                          destination: hotel.cityAddress,
                          roomType: hotel.matchedRoomTypes[0].name,
                          roomTypeId: hotel.matchedRoomTypes[0].roomTypeId,
                        }).toString()}`}
                        className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
                      >
                        Xem loại phòng
                      </Link>
                    ) : null}
                    <Link
                      to={`${ROUTES.HOTELS}?${buildSearchParams({
                        ...createDefaultSearchFilters(),
                        destination: hotel.cityAddress,
                      }).toString()}`}
                      className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf6ef]"
                    >
                      Tìm trong khách sạn này
                    </Link>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

