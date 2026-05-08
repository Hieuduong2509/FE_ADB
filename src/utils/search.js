export const DEFAULT_DESTINATION = "Tất cả";
export const DEFAULT_ROOM_TYPE = "Tất cả";
export const DEFAULT_AMENITY = "Tất cả";
export const DEFAULT_SERVICE = "Tất cả";
export const DEFAULT_GUESTS = "2 người";

export const getTodayDateValue = () => new Date().toISOString().split("T")[0];

export const getTomorrowDateValue = () => {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate.toISOString().split("T")[0];
};

export const parseGuestCount = (guestLabel = DEFAULT_GUESTS) => {
  const matchedValue = String(guestLabel).match(/\d+/);
  return matchedValue ? Number(matchedValue[0]) : 2;
};

export const createDefaultSearchFilters = () => ({
  destination: DEFAULT_DESTINATION,
  search: "",
  checkIn: getTodayDateValue(),
  checkOut: getTomorrowDateValue(),
  guests: DEFAULT_GUESTS,
  roomType: DEFAULT_ROOM_TYPE,
  amenity: DEFAULT_AMENITY,
  service: DEFAULT_SERVICE,
  minPrice: "",
  maxPrice: "",
  stars: "",
  sortBy: "price_asc",
});

export const createSearchFiltersFromParams = (searchParams) => {
  const defaults = createDefaultSearchFilters();

  return {
    destination: searchParams.get("destination") || defaults.destination,
    search: searchParams.get("search") || defaults.search,
    checkIn: searchParams.get("checkIn") || defaults.checkIn,
    checkOut: searchParams.get("checkOut") || defaults.checkOut,
    guests: searchParams.get("guests") || defaults.guests,
    roomType: searchParams.get("roomType") || defaults.roomType,
    amenity: searchParams.get("amenity") || defaults.amenity,
    service: searchParams.get("service") || defaults.service,
    minPrice: searchParams.get("minPrice") || defaults.minPrice,
    maxPrice: searchParams.get("maxPrice") || defaults.maxPrice,
    stars: searchParams.get("stars") || defaults.stars,
    sortBy: searchParams.get("sortBy") || defaults.sortBy,
  };
};

export const buildSearchParams = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value != null && value !== "") {
      params.set(key, value);
    }
  });

  return params;
};

export const validateStayDates = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return "Vui lòng chọn đầy đủ ngày nhận và ngày trả phòng.";
  }

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "Ngày nhận phòng hoặc trả phòng không hợp lệ.";
  }

  if (endDate <= startDate) {
    return "Ngày trả phòng phải sau ngày nhận phòng.";
  }

  return "";
};
