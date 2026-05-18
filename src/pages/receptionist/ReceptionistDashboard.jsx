import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import {
  checkInBookingApi,
  markBookingPaidApi,
  markBookingNoShowApi,
  checkOutBookingApi,
  clearAuthSession,
  getReceptionistDailyBookingsApi,
  getReceptionistRoomBoardApi,
  lookupReceptionistBookingApi,
  readAuthSession,
} from "../../utils/auth";

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [session] = useState(() => readAuthSession());
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [roomBoard, setRoomBoard] = useState(null);
  const [actingBookingId, setActingBookingId] = useState("");
  const [lookupCode, setLookupCode] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [searchCode, setSearchCode] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("checkin_asc");
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("");
  const [hoveredTile, setHoveredTile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const normalizeStatus = (value) => String(value || "").toUpperCase();
  const isOccupyingStatus = (status) =>
    !["CANCELLED", "CHECKED_OUT", "NO_SHOW"].includes(normalizeStatus(status));

  const loadData = async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const [bookingsData, boardData] = await Promise.all([
        getReceptionistDailyBookingsApi(session.accessToken, { date, limit: 200 }),
        getReceptionistRoomBoardApi(session.accessToken, { date }),
      ]);
      const data = bookingsData;
      setItems(Array.isArray(data?.items) ? data.items : []);
      setRoomBoard(boardData || null);
      setErrorMessage("");
    } catch (error) {
      setItems([]);
      setRoomBoard(null);
      setErrorMessage(error.message || "Unable to load booking list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [date]);

  const handleLogout = () => {
    clearAuthSession();
    navigate(ROUTES.RECEPTIONIST_LOGIN);
  };

  const handleCheckIn = async (bookingId) => {
    try {
      setActingBookingId(bookingId);
      await checkInBookingApi(bookingId, session.accessToken);
      await loadData();
    } catch (error) {
      setErrorMessage(error.message || "Check-in failed.");
    } finally {
      setActingBookingId("");
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      setActingBookingId(bookingId);
      await checkOutBookingApi(bookingId, session.accessToken);
      await loadData();
    } catch (error) {
      setErrorMessage(error.message || "Check-out failed.");
    } finally {
      setActingBookingId("");
    }
  };

  const handleMarkPaid = async (bookingId) => {
    try {
      setActingBookingId(bookingId);
      await markBookingPaidApi(bookingId, session.accessToken);
      await loadData();
    } catch (error) {
      setErrorMessage(error.message || "Payment confirmation failed.");
    } finally {
      setActingBookingId("");
    }
  };

  const handleNoShow = async (bookingId) => {
    try {
      setActingBookingId(bookingId);
      await markBookingNoShowApi(bookingId, session.accessToken);
      await loadData();
    } catch (error) {
      setErrorMessage(error.message || "Marking no-show failed.");
    } finally {
      setActingBookingId("");
    }
  };

  const handleLookup = async () => {
    try {
      const data = await lookupReceptionistBookingApi(session.accessToken, lookupCode);
      setLookupResult(data || null);
      setErrorMessage("");
    } catch (error) {
      setLookupResult(null);
      setErrorMessage(error.message || "Booking not found.");
    }
  };

  const visibleItems = [...items]
    .filter((booking) => {
      const paymentStatus = normalizeStatus(booking.payment_status);
      if (paymentFilter === "paid" && paymentStatus !== "PAID") return false;
      if (paymentFilter === "unpaid" && paymentStatus === "PAID") return false;

      const keyword = String(searchCode || "").trim().toLowerCase();
      if (!keyword) return true;

      return String(booking.booking_number || "").toLowerCase().includes(keyword);
    })
    .sort((a, b) => {
      const checkInA = new Date(a.checkin_date || 0).getTime();
      const checkInB = new Date(b.checkin_date || 0).getTime();
      const checkOutA = new Date(a.checkout_date || 0).getTime();
      const checkOutB = new Date(b.checkout_date || 0).getTime();

      switch (sortBy) {
        case "checkin_desc":
          return checkInB - checkInA;
        case "checkout_asc":
          return checkOutA - checkOutB;
        case "checkout_desc":
          return checkOutB - checkOutA;
        case "checkin_asc":
        default:
          return checkInA - checkInB;
      }
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [date, searchCode, paymentFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedItems = visibleItems.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const bookingsByRoomType = items.reduce((accumulator, booking) => {
    if (!isOccupyingStatus(booking.booking_status)) {
      return accumulator;
    }
    const key = String(booking.room_type_id || "");
    if (!key) return accumulator;
    const current = accumulator[key] || [];
    current.push(booking);
    accumulator[key] = current;
    return accumulator;
  }, {});

  const roomMapData = (roomBoard?.roomTypes || []).map((roomType) => {
    const total = Number(roomType.total_inventory || 0);
    const occupied = Number(roomType.occupied_count || 0);
    const roomTypeBookings = [...(bookingsByRoomType[String(roomType.room_type_id)] || [])];
    const tiles = Array.from({ length: total }, (_, index) => ({
      key: `${roomType.room_type_id}-${index + 1}`,
      roomNo: `${String(roomType.room_type_name || "R")
        .replace(/\s+/g, "")
        .slice(0, 3)
        .toUpperCase()}-${String(index + 1).padStart(2, "0")}`,
      status: index < occupied ? "occupied" : "available",
      booking: index < occupied ? roomTypeBookings[index] || null : null,
    }));
    return {
      ...roomType,
      tiles,
    };
  });

  const activeRoomMap =
    roomMapData.find((item) => item.room_type_id === selectedRoomTypeId) || roomMapData[0] || null;

  const floorBoard = (() => {
    if (!activeRoomMap) return [];
    const tiles = activeRoomMap.tiles || [];
    if (!tiles.length) return [];

    const floorCount = Math.min(3, Math.max(1, Math.ceil(tiles.length / 8)));
    const perFloor = Math.ceil(tiles.length / floorCount);

    return Array.from({ length: floorCount }, (_, floorIndex) => {
      const start = floorIndex * perFloor;
      const end = start + perFloor;
      const floorTiles = tiles.slice(start, end);
      const splitIndex = Math.ceil(floorTiles.length / 2);
      return {
        floorNo: floorIndex + 1,
        wingA: floorTiles.slice(0, splitIndex),
        wingB: floorTiles.slice(splitIndex),
      };
    }).reverse();
  })();

  return (
    <div className="min-h-screen bg-[#f7f3ea] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-[#e5dbc9] bg-white p-5 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-accent">Receptionist Dashboard</div>
              <h1 className="mt-1 text-2xl font-semibold text-textPrimary">Reception operations</h1>
              <p className="mt-1 text-sm text-gray-600">{session?.user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-xl border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-[#17363f] px-4 py-2 text-sm font-medium text-white hover:bg-[#102d34]"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-lg border border-[#e7c5bf] bg-[#fff2ee] px-3 py-2 text-sm text-[#aa4f3d]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl border border-[#e5dbc9] bg-white p-5 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
          <div className="mb-4 rounded-xl border border-[#ece2d3] bg-[#fffcf7] p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">Booking lookup</div>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={lookupCode}
                onChange={(event) => setLookupCode(event.target.value)}
                placeholder="Enter booking code (e.g. BK-...)"
                className="min-w-[260px] flex-1 rounded-lg border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleLookup}
                className="rounded-lg bg-[#17363f] px-4 py-2 text-sm font-semibold text-white"
              >
                Search
              </button>
            </div>
            {lookupResult ? (
              <div className="mt-2 text-sm text-gray-700">
                {lookupResult.booking_number} · {lookupResult.first_name} {lookupResult.last_name} ·{" "}
                {lookupResult.booking_status} / {lookupResult.payment_status}
              </div>
            ) : null}
          </div>

          <div className="mb-4 rounded-xl border border-[#ece2d3] bg-white p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">Action filters</div>
            <div className="grid gap-2 md:grid-cols-3">
              <input
                type="text"
                value={searchCode}
                onChange={(event) => setSearchCode(event.target.value)}
                placeholder="Search list by booking code"
                className="rounded-lg border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-sm"
              />
              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="rounded-lg border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-sm"
              >
                <option value="all">All payments</option>
                <option value="paid">PAID only</option>
                <option value="unpaid">UNPAID only</option>
              </select>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-lg border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-sm"
              >
                <option value="checkin_asc">Check-in ascending</option>
                <option value="checkin_desc">Check-in descending</option>
                <option value="checkout_asc">Check-out ascending</option>
                <option value="checkout_desc">Check-out descending</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">Daily hotel simulation</div>
            <h2 className="mt-1 text-xl font-semibold text-textPrimary">Room status: available / booked</h2>
          </div>
          {roomBoard?.summary ? (
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-[#f3ebdc] p-3 text-sm text-[#17363f]">
                Total rooms: <b>{roomBoard.summary.totalInventory || 0}</b>
              </div>
              <div className="rounded-xl bg-[#fbe8e5] p-3 text-sm text-[#8b3f32]">
                Booked: <b>{roomBoard.summary.occupiedCount || 0}</b>
              </div>
              <div className="rounded-xl bg-[#e8f6ee] p-3 text-sm text-[#1f7a4f]">
                Available: <b>{roomBoard.summary.availableCount || 0}</b>
              </div>
            </div>
          ) : null}

          {Array.isArray(roomBoard?.roomTypes) && roomBoard.roomTypes.length ? (
            <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {roomBoard.roomTypes.map((roomType) => (
                <div key={roomType.room_type_id} className="rounded-xl border border-[#ece2d3] bg-[#fffcf7] p-3">
                  <div className="text-sm font-semibold text-textPrimary">{roomType.room_type_name}</div>
                  <div className="mt-2 text-xs text-gray-600">Total: {roomType.total_inventory}</div>
                  <div className="text-xs text-[#8b3f32]">Booked: {roomType.occupied_count}</div>
                  <div className="text-xs text-[#1f7a4f]">Available: {roomType.available_count}</div>
                </div>
              ))}
            </div>
          ) : null}

          {activeRoomMap ? (
            <div className="mb-6 rounded-xl border border-[#ece2d3] bg-white p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-accent">3D room map by floor</div>
                  <h3 className="mt-1 text-lg font-semibold text-textPrimary">
                    {activeRoomMap.room_type_name}
                  </h3>
                </div>
                <select
                  value={selectedRoomTypeId || activeRoomMap.room_type_id}
                  onChange={(event) => setSelectedRoomTypeId(event.target.value)}
                  className="rounded-lg border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-sm"
                >
                  {roomMapData.map((item) => (
                    <option key={item.room_type_id} value={item.room_type_id}>
                      {item.room_type_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-[#1f7a4f]" />
                  Available
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-[#aa4f3d]" />
                  Booked
                </span>
              </div>

              <div className="space-y-4">
                {floorBoard.map((floor) => (
                  <div key={`floor-${floor.floorNo}`} className="relative">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                      Floor {floor.floorNo}
                    </div>
                    <div className="rounded-xl border border-[#e6dece] bg-[linear-gradient(180deg,#fbf8f1_0%,#f2ecdf_100%)] p-3 shadow-[0_8px_18px_rgba(34,27,18,0.08)]">
                      <div className="grid gap-3 md:grid-cols-2">
                        {[{ name: "Wing A", tiles: floor.wingA }, { name: "Wing B", tiles: floor.wingB }].map((wing) => (
                          <div key={`${floor.floorNo}-${wing.name}`} className="rounded-lg border border-[#e9e1d3] bg-white p-2">
                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b5e34]">
                              {wing.name}
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {wing.tiles.map((tile) => (
                                <button
                                  key={tile.key}
                                  type="button"
                                  onMouseEnter={() => setHoveredTile(tile)}
                                  onMouseLeave={() => setHoveredTile(null)}
                                  className={`rounded-md border px-2 py-2 text-[11px] font-semibold transition hover:-translate-y-[1px] ${
                                    tile.status === "occupied"
                                      ? "border-[#e9b8b0] bg-[linear-gradient(180deg,#ffd9d2_0%,#f6b5a8_100%)] text-[#8f3427]"
                                      : "border-[#b8dec9] bg-[linear-gradient(180deg,#ddf8e9_0%,#b8eccf_100%)] text-[#176644]"
                                  }`}
                                  title={tile.status === "occupied" ? "Booked/in use" : "Ready for check-in"}
                                >
                                  {tile.roomNo}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {hoveredTile?.status === "occupied" && hoveredTile?.booking ? (
                <div className="mt-3 rounded-lg border border-[#f3c8c1] bg-[#fff5f2] p-3 text-xs text-[#7a342a]">
                  <div className="font-semibold">Booking details for room {hoveredTile.roomNo}</div>
                  <div className="mt-1">
                    Booking code: {hoveredTile.booking.booking_number} · Guest: {hoveredTile.booking.first_name}{" "}
                    {hoveredTile.booking.last_name}
                  </div>
                  <div className="mt-1">
                    Email: {hoveredTile.booking.customer_email || "--"} · Status:{" "}
                    {hoveredTile.booking.booking_status} / {hoveredTile.booking.payment_status}
                  </div>
                  <div className="mt-1">
                    Stay: {hoveredTile.booking.checkin_date} → {hoveredTile.booking.checkout_date}
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-[#e7dcc8] bg-[#fcfaf6] p-3 text-xs text-gray-600">
                  Hover over a red room tile to view guest and booking details.
                </div>
              )}
            </div>
          ) : null}

          <div className="border-t border-[#ece2d3] pt-4">
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent">Interactive bookings</div>
          </div>

          {isLoading ? (
            <div className="text-sm text-gray-600">Loading booking...</div>
          ) : pagedItems.length ? (
            <div className="space-y-3">
              {pagedItems.map((booking) => (
                <div key={booking.id} className="rounded-xl border border-[#ece2d3] bg-[#fffcf7] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-textPrimary">{booking.booking_number}</div>
                      <div className="text-sm text-gray-600">
                        {booking.first_name} {booking.last_name} · {booking.customer_email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.checkin_date} → {booking.checkout_date} · {booking.room_type_name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#f3ebdc] px-3 py-1 text-xs text-[#17363f]">
                        {booking.booking_status} · {booking.payment_status}
                      </span>
                      <button
                        type="button"
                        disabled={actingBookingId === booking.id || !["PENDING", "CONFIRMED"].includes(normalizeStatus(booking.booking_status))}
                        onClick={() => handleCheckIn(booking.id)}
                        className="rounded-lg bg-[#1f7a4f] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Check-in
                      </button>
                      <button
                        type="button"
                        disabled={actingBookingId === booking.id || normalizeStatus(booking.booking_status) !== "CHECKED_IN"}
                        onClick={() => handleCheckOut(booking.id)}
                        className="rounded-lg bg-[#8b5e34] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Check-out
                      </button>
                      <button
                        type="button"
                        disabled={actingBookingId === booking.id || normalizeStatus(booking.payment_status) === "PAID"}
                        onClick={() => handleMarkPaid(booking.id)}
                        className="rounded-lg bg-[#0f766e] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Mark as paid
                      </button>
                      <button
                        type="button"
                        disabled={actingBookingId === booking.id || !["PENDING", "CONFIRMED"].includes(normalizeStatus(booking.booking_status))}
                        onClick={() => handleNoShow(booking.id)}
                        className="rounded-lg bg-[#aa4f3d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        No-show
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {visibleItems.length > ITEMS_PER_PAGE ? (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="rounded-full border border-[#d8ccb8] px-3 py-1 text-xs disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-600">
                    Page {safePage}/{totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className="rounded-full border border-[#d8ccb8] px-3 py-1 text-xs disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No bookings match the current filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;

