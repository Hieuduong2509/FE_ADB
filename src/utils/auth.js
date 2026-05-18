const AUTH_STORAGE_KEY = "pullman_auth_session";

const normalizeBaseUrl = (rawBaseUrl) => String(rawBaseUrl || "http://localhost:8000").replace(/\/+$/, "");

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

const parseJwtPayload = (token) => {
  try {
    const [, payload = ""] = String(token || "").split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = window.atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isExpiredToken = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

const toError = (status, payload) => {
  const error = new Error(payload?.error?.message || "Request failed");
  error.status = status;
  error.code = payload?.error?.code || null;
  return error;
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    if (response.status === 401) {
      clearAuthSession();
    }
    throw toError(response.status, payload);
  }

  return payload?.data ?? null;
};

const withAuthHeaders = (accessToken, headers = {}) => ({
  ...headers,
  ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
});

const listRequest = async (path) => {
  const payload = await requestJson(path);
  return Array.isArray(payload?.items) ? payload.items : [];
};

const parseGuestCount = (guestValue) => {
  const matched = String(guestValue || "").match(/\d+/);
  return matched ? Number(matched[0]) : 2;
};

const normalizeCatalogHotel = (hotel = {}) => ({
  id: hotel.id,
  code: hotel.code || "",
  name: hotel.name || "",
  countryName: hotel.country || "",
  cityAddress: hotel.city || "",
  address: hotel.address || "",
  description: hotel.description || "Hotel data is synced from the backend.",
  starRating: Number(hotel.star_rating) || 0,
  timezone: hotel.timezone || "Asia/Ho_Chi_Minh",
  imageUrl: hotel.image_url || "",
  imageUrls: Array.isArray(hotel.image_urls) ? hotel.image_urls : [],
});

const normalizeSearchRoomType = (item = {}, catalog = {}) => {
  const roomTypeCatalog = catalog.roomTypesById?.get(String(item.room_type_id));
  const facilitiesById = catalog.facilitiesById || new Map();
  const amenitiesById = catalog.amenitiesById || new Map();
  const amenities = Array.isArray(roomTypeCatalog?.amenity_ids)
    ? roomTypeCatalog.amenity_ids
        .map((amenityId) => amenitiesById.get(String(amenityId))?.name || "")
        .filter(Boolean)
    : [];
  const amenityItems = Array.isArray(roomTypeCatalog?.amenity_ids)
    ? roomTypeCatalog.amenity_ids
        .map((amenityId) => amenitiesById.get(String(amenityId)))
        .filter(Boolean)
        .map((amenity) => ({
          id: amenity.id,
          name: amenity.name || "",
          icon: amenity.icon || "",
        }))
    : [];
  const services = Array.isArray(roomTypeCatalog?.facility_ids)
    ? roomTypeCatalog.facility_ids
        .map((facilityId) => facilitiesById.get(String(facilityId)))
        .filter(Boolean)
        .map((facility) => ({
          id: facility.id,
          name: facility.name || "",
          price: Number(facility.base_price || 0),
          pricingType: facility.price_type || facility.pricing_type || facility.facility_type || "",
          icon: facility.icon || facility.icon_url || "",
        }))
    : [];

  return ({
  roomTypeId: item.room_type_id,
  id: item.room_type_id,
  code: item.room_type_code || "",
  name: item.room_type_name || "",
  availableRoomCount: Number(item.available_inventory) || 0,
  averageNightlyRate: Number(item.average_rate) || 0,
  stayTotal: Number(item.stay_total) || 0,
  servicesText: "This room type uses live availability data from the database.",
  imageUrl: roomTypeCatalog?.image_url || "",
  imageUrls: Array.isArray(roomTypeCatalog?.image_urls) ? roomTypeCatalog.image_urls : [],
  amenities,
  amenityItems,
  services,
  });
};

const buildSearchQuery = (filters = {}) => {
  const params = new URLSearchParams();
  params.set("checkIn", String(filters.checkIn || ""));
  params.set("checkOut", String(filters.checkOut || ""));
  params.set("guests", String(parseGuestCount(filters.guests)));

  if (filters.hotelId) {
    params.set("hotelId", String(filters.hotelId));
  }

  if (filters.roomTypeId) {
    params.set("roomTypeId", String(filters.roomTypeId));
  }

  if (filters.search) {
    params.set("search", String(filters.search));
  }

  if (filters.destination && filters.destination !== "All") {
    params.set("destination", String(filters.destination));
  }

  if (filters.roomType && filters.roomType !== "All") {
    params.set("roomType", String(filters.roomType));
  }

  if (filters.amenity && filters.amenity !== "All") {
    params.set("amenity", String(filters.amenity));
  }

  if (filters.service && filters.service !== "All") {
    params.set("service", String(filters.service));
  }

  if (filters.minPrice) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  if (filters.stars) {
    params.set("stars", String(filters.stars));
  }

  return params.toString();
};

const mergeHotelsWithAvailability = (
  catalogHotels = [],
  availabilityItems = [],
  filters = {},
  catalog = {},
) => {
  const hotelsById = new Map(
    catalogHotels.map((hotel) => [String(hotel.id), normalizeCatalogHotel(hotel)]),
  );
  const groupedRoomTypes = new Map();
  const hotelImagesByHotelId = catalog.hotelImagesByHotelId || new Map();

  for (const item of availabilityItems) {
    const hotelId = String(item.hotel_id);
    const currentItems = groupedRoomTypes.get(hotelId) || [];
    currentItems.push(normalizeSearchRoomType(item, catalog));
    groupedRoomTypes.set(hotelId, currentItems);
  }

  const hotels = Array.from(groupedRoomTypes.entries()).map(([hotelId, roomTypes]) => {
    const hotel = hotelsById.get(hotelId) || {
      id: hotelId,
      name: roomTypes[0]?.hotel_name || "Hotel",
      countryName: roomTypes[0]?.country || "",
      cityAddress: roomTypes[0]?.city || "",
      address: "",
      description: "Hotel data is synced from the backend.",
      starRating: Number(roomTypes[0]?.star_rating) || 0,
      timezone: "Asia/Ho_Chi_Minh",
    };

    const normalizedRoomTypes = roomTypes.sort(
      (firstRoomType, secondRoomType) => firstRoomType.averageNightlyRate - secondRoomType.averageNightlyRate,
    );

    const hotelImages = hotelImagesByHotelId.get(String(hotel.id)) || [];
    return {
      ...hotel,
      imageUrl: hotelImages[0]?.image_url || hotel.imageUrl || "",
      imageUrls: hotelImages.map((image) => image.image_url).filter(Boolean),
      matchedRoomTypes: normalizedRoomTypes,
      roomTypes: normalizedRoomTypes,
      priceFrom: normalizedRoomTypes[0]?.averageNightlyRate || 0,
      stayTotalFrom: normalizedRoomTypes[0]?.stayTotal || 0,
      availableRoomCountTotal: normalizedRoomTypes.reduce(
        (sum, roomType) => sum + (Number(roomType.availableRoomCount) || 0),
        0,
      ),
    };
  });

  return hotels
    .filter((hotel) => {
      if (
        filters.destination &&
        filters.destination !== "All" &&
        hotel.cityAddress !== filters.destination
      ) {
        return false;
      }

      if (filters.stars && Number(hotel.starRating) < Number(filters.stars)) {
        return false;
      }

      if (filters.minPrice && Number(hotel.priceFrom) < Number(filters.minPrice)) {
        return false;
      }

      if (filters.maxPrice && Number(hotel.priceFrom) > Number(filters.maxPrice)) {
        return false;
      }

      if (
        filters.roomType &&
        filters.roomType !== "All" &&
        !hotel.matchedRoomTypes.some((roomType) => roomType.name === filters.roomType)
      ) {
        return false;
      }

      if (filters.search) {
        const keyword = String(filters.search).trim().toLowerCase();
        const haystack = [
          hotel.name,
          hotel.cityAddress,
          hotel.countryName,
          ...hotel.matchedRoomTypes.map((roomType) => roomType.name),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(keyword)) {
          return false;
        }
      }

      return true;
    })
    .sort((firstHotel, secondHotel) => {
      switch (filters.sortBy) {
        case "price_desc":
          return secondHotel.priceFrom - firstHotel.priceFrom;
        case "rating_desc":
          return secondHotel.starRating - firstHotel.starRating;
        case "price_asc":
        default:
          return firstHotel.priceFrom - secondHotel.priceFrom;
      }
    });
};

const splitFullName = (fullName = "") => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
};

export const registerClientApi = async (formData) =>
  requestJson("/api/client/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const loginClientApi = async (formData) =>
  requestJson("/api/client/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const loginAdminApi = async (formData) =>
  requestJson("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const loginReceptionistApi = async (formData) =>
  requestJson("/api/receptionist/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const getClientProfileApi = async (accessToken) =>
  requestJson("/api/client/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getClientHotelsApi = async (filters = {}) => {
  const [catalogHotels, searchResponse, roomTypes, facilities, amenities, hotelImages, roomTypeImages] = await Promise.all([
    listRequest("/api/hotels?limit=100"),
    requestJson(`/api/search?${buildSearchQuery(filters)}`),
    listRequest("/api/room-types?limit=500"),
    listRequest("/api/facilities?limit=500"),
    listRequest("/api/amenities?limit=500"),
    listRequest("/api/hotel-images?limit=2000"),
    listRequest("/api/room-type-images?limit=5000"),
  ]);

  const hotelImagesByHotelId = hotelImages.reduce((map, image) => {
    const key = String(image.hotel_id || "");
    if (!key) return map;
    const current = map.get(key) || [];
    current.push(image);
    map.set(key, current.sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)));
    return map;
  }, new Map());

  const roomTypeImagesById = roomTypeImages.reduce((map, image) => {
    const key = String(image.room_type_id || "");
    if (!key) return map;
    const current = map.get(key) || [];
    current.push(image.image_url);
    map.set(key, current.filter(Boolean));
    return map;
  }, new Map());

  const mappedRoomTypes = roomTypes.map((roomType) => ({
    ...roomType,
    image_urls: roomTypeImagesById.get(String(roomType.id)) || [],
    image_url: (roomTypeImagesById.get(String(roomType.id)) || [])[0] || "",
  }));

  const catalog = {
    roomTypesById: new Map(mappedRoomTypes.map((roomType) => [String(roomType.id), roomType])),
    facilitiesById: new Map(facilities.map((facility) => [String(facility.id), facility])),
    amenitiesById: new Map(amenities.map((amenity) => [String(amenity.id), amenity])),
    hotelImagesByHotelId,
  };

  return mergeHotelsWithAvailability(
    catalogHotels,
    Array.isArray(searchResponse?.items) ? searchResponse.items : [],
    filters,
    catalog,
  );
};

export const getClientHotelDetailApi = async (hotelId, filters = {}) => {
  const [catalogHotel, searchResponse, roomTypes, facilities, amenities, hotelImages, roomTypeImages] = await Promise.all([
    requestJson(`/api/hotels/${hotelId}`),
    requestJson(`/api/search?${buildSearchQuery({ ...filters, hotelId })}`),
    listRequest(`/api/room-types?limit=500&hotel_id=${hotelId}`),
    listRequest(`/api/facilities?limit=500&hotel_id=${hotelId}`),
    listRequest("/api/amenities?limit=500"),
    listRequest(`/api/hotel-images?limit=2000&hotel_id=${hotelId}`),
    listRequest("/api/room-type-images?limit=5000"),
  ]);

  const roomTypeImagesById = roomTypeImages.reduce((map, image) => {
    const key = String(image.room_type_id || "");
    if (!key) return map;
    const current = map.get(key) || [];
    current.push(image.image_url);
    map.set(key, current.filter(Boolean));
    return map;
  }, new Map());

  const mappedRoomTypes = roomTypes.map((roomType) => ({
    ...roomType,
    image_urls: roomTypeImagesById.get(String(roomType.id)) || [],
    image_url: (roomTypeImagesById.get(String(roomType.id)) || [])[0] || "",
  }));

  const catalog = {
    roomTypesById: new Map(mappedRoomTypes.map((roomType) => [String(roomType.id), roomType])),
    facilitiesById: new Map(facilities.map((facility) => [String(facility.id), facility])),
    amenitiesById: new Map(amenities.map((amenity) => [String(amenity.id), amenity])),
    hotelImagesByHotelId: new Map([[String(hotelId), hotelImages]]),
  };

  const hotels = mergeHotelsWithAvailability(
    catalogHotel ? [catalogHotel] : [],
    Array.isArray(searchResponse?.items) ? searchResponse.items : [],
    { ...filters, hotelId },
    catalog,
  );

  return hotels[0] || {
    ...normalizeCatalogHotel(catalogHotel || {}),
    matchedRoomTypes: [],
    roomTypes: [],
    priceFrom: 0,
    stayTotalFrom: 0,
    availableRoomCountTotal: 0,
  };
};

export const getBookingQuoteApi = async (payload) =>
  requestJson("/api/pricing/quote", {
    method: "POST",
    body: JSON.stringify({
      roomTypeId: String(payload.roomTypeId || "").trim(),
      ratePlanId: payload.ratePlanId || null,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      facilityIds: Array.isArray(payload.serviceIds)
        ? payload.serviceIds.map((item) => String(item))
        : Array.isArray(payload.facilityIds)
          ? payload.facilityIds.map((item) => String(item))
          : [],
      promotionCode: payload.promotionCode || null,
    }),
  }).then((quote) => ({
    ...quote,
    hotelName: quote?.hotel?.name || "",
    roomTypeName: quote?.roomType?.name || "",
    stayNights: Array.isArray(quote?.stayDates) ? quote.stayDates.length : 0,
    roomTotal: Number(quote?.charges?.subtotal || 0),
    serviceTotal: Number(quote?.charges?.facilityTotal || 0),
    taxesAndFees: Number(quote?.charges?.taxAmount || 0) + Number(quote?.charges?.serviceCharge || 0),
    totalAmount: Number(quote?.charges?.finalAmount || 0),
    pricingAdjustmentTotal: Array.isArray(quote?.nightlyBreakdown)
      ? quote.nightlyBreakdown.reduce((sum, item) => sum + Number(item.impactAmount || 0), 0)
      : 0,
    nightlyBreakdown: Array.isArray(quote?.nightlyBreakdown)
      ? quote.nightlyBreakdown.map((item) => ({
          ...item,
          rate: Number(item.adjustedRate || 0),
        }))
      : [],
    appliedPricingRules: Array.isArray(quote?.appliedPricingRules) ? quote.appliedPricingRules : [],
    services: Array.isArray(quote?.facilities)
      ? quote.facilities.map((facility) => ({
          id: facility.id,
          name: facility.name,
          price: Number(facility.base_price || 0),
          pricingType: facility.price_type || facility.pricing_type || "",
          quantity: 1,
          total: Number(facility.base_price || 0),
        }))
      : [],
  }));

export const createBookingApi = async (payload, accessToken) =>
  requestJson("/api/bookings", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify({
      roomTypeId: String(payload.roomTypeId || "").trim(),
      ratePlanId: payload.ratePlanId || null,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      adults: Number(payload.countParent || parseGuestCount(payload.guests) || 1),
      children: Number(payload.countChild || 0),
      currency: payload.currency || "VND",
      paymentMethod: String(payload.paymentMethod || "pay_at_hotel").trim(),
      customer: {
        ...splitFullName(payload.fullName),
        email: String(payload.email || "").trim(),
        phone: String(payload.phone || "").trim() || null,
      },
    }),
  });

export const getBookingPaymentStatusApi = async (bookingId) =>
  requestJson(`/api/payments/booking/${bookingId}/status`);

export const getMyBookingHistoryApi = async (accessToken) =>
  requestJson("/api/bookings/history/me", {
    headers: withAuthHeaders(accessToken),
  });

export const getAdminBookingHistoryApi = async (accessToken, query = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return requestJson(`/api/bookings/history/admin${queryString ? `?${queryString}` : ""}`, {
    headers: withAuthHeaders(accessToken),
  });
};

export const getAdminUsersApi = async (accessToken) =>
  requestJson("/api/admin/auth/users", {
    headers: withAuthHeaders(accessToken),
  });

export const setReceptionistRoleApi = async (accessToken, userId) =>
  requestJson("/api/admin/auth/set-receptionist", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify({ userId }),
  });

export const setReceptionistHotelApi = async (accessToken, userId, hotelId) =>
  requestJson("/api/admin/auth/set-receptionist-hotel", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify({ userId, hotelId }),
  });

export const removeReceptionistRoleApi = async (accessToken, userId) =>
  requestJson("/api/admin/auth/remove-receptionist", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify({ userId }),
  });

export const getReceptionistDailyBookingsApi = async (accessToken, query = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return requestJson(`/api/receptionist/bookings/daily${queryString ? `?${queryString}` : ""}`, {
    headers: withAuthHeaders(accessToken),
  });
};

export const getReceptionistRoomBoardApi = async (accessToken, query = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return requestJson(`/api/receptionist/rooms/board${queryString ? `?${queryString}` : ""}`, {
    headers: withAuthHeaders(accessToken),
  });
};

export const checkInBookingApi = async (bookingId, accessToken) =>
  requestJson(`/api/receptionist/bookings/${bookingId}/check-in`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
  });

export const checkOutBookingApi = async (bookingId, accessToken) =>
  requestJson(`/api/receptionist/bookings/${bookingId}/check-out`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
  });

export const markBookingPaidApi = async (bookingId, accessToken) =>
  requestJson(`/api/receptionist/bookings/${bookingId}/mark-paid`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
  });

export const markBookingNoShowApi = async (bookingId, accessToken) =>
  requestJson(`/api/receptionist/bookings/${bookingId}/no-show`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
  });

export const lookupReceptionistBookingApi = async (accessToken, bookingNumber) =>
  requestJson(`/api/receptionist/bookings/lookup?bookingNumber=${encodeURIComponent(String(bookingNumber || "").trim())}`, {
    headers: withAuthHeaders(accessToken),
  });

export const getAdminHotelsApi = async () => listRequest("/api/hotels?limit=100");

export const createAdminHotelApi = async (payload, accessToken) =>
  requestJson("/api/hotels", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminHotelApi = async (id, payload, accessToken) =>
  requestJson(`/api/hotels/${id}`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminHotelApi = async (id, accessToken) =>
  requestJson(`/api/hotels/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminRoomTypesApi = async () => listRequest("/api/room-types?limit=100");

export const createAdminRoomTypeApi = async (payload, accessToken) =>
  requestJson("/api/room-types", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminRoomTypeApi = async (id, payload, accessToken) =>
  requestJson(`/api/room-types/${id}`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminRoomTypeApi = async (id, accessToken) =>
  requestJson(`/api/room-types/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminFacilitiesApi = async () => listRequest("/api/facilities?limit=100");

export const createAdminFacilityApi = async (payload, accessToken) =>
  requestJson("/api/facilities", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminFacilityApi = async (id, payload, accessToken) =>
  requestJson(`/api/facilities/${id}`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminFacilityApi = async (id, accessToken) =>
  requestJson(`/api/facilities/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminAmenitiesApi = async () => listRequest("/api/amenities?limit=100");

export const createAdminAmenityApi = async (payload, accessToken) =>
  requestJson("/api/amenities", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminAmenityApi = async (id, payload, accessToken) =>
  requestJson(`/api/amenities/${id}`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminAmenityApi = async (id, accessToken) =>
  requestJson(`/api/amenities/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminPricingRulesApi = async (query = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return listRequest(`/api/pricing-rules${queryString ? `?${queryString}` : ""}`);
};

export const getAdminHotelImagesApi = async (query = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return listRequest(`/api/hotel-images${queryString ? `?${queryString}` : ""}`);
};

export const createAdminHotelImageApi = async (payload, accessToken) =>
  requestJson("/api/hotel-images", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminHotelImageApi = async (id, accessToken) =>
  requestJson(`/api/hotel-images/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminRoomTypeImagesApi = async (query = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return listRequest(`/api/room-type-images${queryString ? `?${queryString}` : ""}`);
};

export const createAdminRoomTypeImageApi = async (payload, accessToken) =>
  requestJson("/api/room-type-images", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminRoomTypeImageApi = async (id, accessToken) =>
  requestJson(`/api/room-type-images/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const createAdminPricingRuleApi = async (payload, accessToken) =>
  requestJson("/api/pricing-rules", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminPricingRuleApi = async (id, payload, accessToken) =>
  requestJson(`/api/pricing-rules/${id}`, {
    method: "PATCH",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminPricingRuleApi = async (id, accessToken) =>
  requestJson(`/api/pricing-rules/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const persistAuthSession = (sessionData) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
};

export const readAuthSession = () => {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const session = JSON.parse(rawValue);
    if (session?.accessToken && isExpiredToken(session.accessToken)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isAdminSession = (session) => session?.user?.role === "admin";
export const isReceptionistSession = (session) => session?.user?.role === "receptionist";

