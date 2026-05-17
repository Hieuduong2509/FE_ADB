import { useCallback, useEffect, useState } from "react";
import {
  createAmenityDraft,
  createFacilityDraft,
  createHotelDraft,
  createPricingDraft,
  createRoomTypeDraft,
  hotelOptions,
  slugify,
} from "./adminData";
import {
  createAdminAmenityApi,
  createAdminFacilityApi,
  createAdminHotelApi,
  createAdminPricingRuleApi,
  createAdminRoomTypeApi,
  deleteAdminAmenityApi,
  getAdminBookingHistoryApi,
  deleteAdminFacilityApi,
  deleteAdminHotelApi,
  deleteAdminPricingRuleApi,
  deleteAdminRoomTypeApi,
  getAdminAmenitiesApi,
  getAdminFacilitiesApi,
  getAdminHotelsApi,
  getAdminPricingRulesApi,
  getAdminRoomTypesApi,
  readAuthSession,
  updateAdminAmenityApi,
  updateAdminFacilityApi,
  updateAdminHotelApi,
  updateAdminPricingRuleApi,
  updateAdminRoomTypeApi,
} from "../../utils/auth";
import { getTodayDateValue, getTomorrowDateValue } from "../../utils/search";

const getErrorMessage = (error, fallbackMessage) => error?.message || fallbackMessage;
const roundPercent = (value) => Number((Number(value) || 0).toFixed(1));

const createStatusRows = (records = [], keyName) => {
  const total = records.length || 1;
  const map = new Map();

  records.forEach((record) => {
    const key = String(record?.[keyName] || "UNKNOWN").toUpperCase();
    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([key, count]) => {
      const percent = roundPercent((count / total) * 100);
      const tone = key === "CONFIRMED" || key === "PAID" ? "positive" : key === "PENDING" ? "warning" : "neutral";
      return { key, count, percent, tone };
    })
    .sort((a, b) => b.count - a.count);
};

const createHotelRevenueRows = (records = []) => {
  const byHotel = new Map();
  records.forEach((record) => {
    const hotelId = String(record?.hotel_id || "unknown");
    const current = byHotel.get(hotelId) || {
      hotelId,
      hotelName: record?.hotel_name || "Unknown hotel",
      bookings: 0,
      revenue: 0,
    };
    current.bookings += 1;
    current.revenue += Number(record?.final_amount || 0);
    byHotel.set(hotelId, current);
  });

  return Array.from(byHotel.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

const resolveBookingDate = (record = {}) => record?.checkin_date || record?.created_at || null;

const toDateKey = (dateValue) => {
  if (!dateValue) return "";
  const raw = String(dateValue).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toMonthKey = (dateValue) => {
  const dayKey = toDateKey(dateValue);
  if (!dayKey) return "";
  return dayKey.slice(0, 7);
};

const getLatestDateFromRecords = (records = []) => {
  const validKeys = records
    .map((record) => toDateKey(resolveBookingDate(record)))
    .filter(Boolean)
    .sort();
  return validKeys[validKeys.length - 1] || toDateKey(new Date());
};

const buildRevenueByMonth = (records = [], months = 6) => {
  const latestKey = getLatestDateFromRecords(records);
  const [latestYear, latestMonth] = latestKey.split("-").map((item) => Number(item));
  const anchor = new Date(latestYear, Math.max(0, latestMonth - 1), 1);
  const monthKeys = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthKeys.push(key);
  }

  const revenueMap = new Map(monthKeys.map((key) => [key, 0]));
  records.forEach((record) => {
    const key = toMonthKey(resolveBookingDate(record));
    if (!revenueMap.has(key)) return;
    revenueMap.set(key, Number(revenueMap.get(key) || 0) + Number(record?.final_amount || 0));
  });

  return monthKeys.map((key) => ({
    key,
    label: key.slice(5),
    revenue: Math.round(Number(revenueMap.get(key) || 0)),
  }));
};

const buildBookingsByDay = (records = [], days = 14) => {
  const latestKey = getLatestDateFromRecords(records);
  const [y, m, d] = latestKey.split("-").map((item) => Number(item));
  const anchor = new Date(y, Math.max(0, m - 1), d || 1);
  const dayKeys = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const cursor = new Date(anchor);
    cursor.setDate(anchor.getDate() - i);
    dayKeys.push(toDateKey(cursor));
  }

  const countMap = new Map(dayKeys.map((key) => [key, 0]));
  records.forEach((record) => {
    const key = toDateKey(resolveBookingDate(record));
    if (!countMap.has(key)) return;
    countMap.set(key, Number(countMap.get(key) || 0) + 1);
  });

  return dayKeys.map((key) => ({
    key,
    label: key.slice(5),
    count: Number(countMap.get(key) || 0),
  }));
};

const ensureCode = (prefix, value) => {
  const slug = slugify(value);
  return slug ? `${prefix}-${slug}`.slice(0, 40) : `${prefix}-${Date.now()}`;
};

const getAdminAccessToken = () => {
  const session = readAuthSession();
  return session?.accessToken || "";
};

const formatHotelOption = (hotel) => ({
  id: hotel.id,
  code: hotel.code || "",
  name: hotel.name || "",
  brand: hotel.brand || "Pullman",
  country: hotel.country || "",
  city: hotel.city || "",
  district: hotel.district || "",
  address: hotel.address || "",
  starRating: Number(hotel.star_rating) || 0,
  timeZone: hotel.timezone || "Asia/Ho_Chi_Minh",
  totalRooms: Number(hotel.total_rooms) || 0,
  status: hotel.status || "active",
});

const formatRoomTypeOption = (roomType, hotelsById) => ({
  id: roomType.id,
  hotelId: roomType.hotel_id,
  hotelName: hotelsById.get(roomType.hotel_id)?.name || "Khách sạn chưa xác định",
  code: roomType.code || "",
  name: roomType.name || "",
  description: roomType.description || "",
  basePrice: Number(roomType.base_price) || 0,
  roomSize: Number(roomType.room_size) || 0,
  maxAdults: Number(roomType.max_adults) || 0,
  maxChildren: Number(roomType.max_children) || 0,
  bedType: roomType.bed_type || "",
  totalInventory: Number(roomType.total_inventory) || 0,
  amenities: Array.isArray(roomType.amenity_ids) ? roomType.amenity_ids.map(String) : [],
  facilities: Array.isArray(roomType.facility_ids) ? roomType.facility_ids.map(String) : [],
  category: roomType.code || "",
  capacity: Number(roomType.max_adults) + Number(roomType.max_children || 0),
  size: roomType.room_size ? `${roomType.room_size} m2` : "",
});

const formatFacilityRecord = (facility, hotelsById) => ({
  id: facility.id,
  hotelId: facility.hotel_id,
  hotelName: hotelsById.get(facility.hotel_id)?.name || "Khách sạn chưa xác định",
  code: facility.code || "",
  name: facility.name || "",
  description: facility.description || "",
  facilityType: facility.facility_type || "service",
  pricingType: facility.price_type || "per_use",
  price: Number(facility.base_price) || 0,
  isActive: facility.is_active !== false,
});

const formatAmenityRecord = (amenity) => ({
  id: amenity.id,
  code: amenity.code || "",
  name: amenity.name || "",
  icon: amenity.icon || "",
  description: amenity.description || "",
  hotelName: "Catalog toàn hệ thống",
});

const formatPricingRuleRecord = (rule, hotelsById, roomTypesById) => {
  const roomType = roomTypesById.get(rule.room_type_id);
  const basePrice = Number(roomType?.basePrice || 0);
  const increasePercent = Number(rule.actions?.increase_percent || 0);
  const decreasePercent = Number(rule.actions?.decrease_percent || 0);
  const legacyFinalRate = Number(rule.actions?.final_rate ?? rule.actions?.fixed_rate ?? 0);

  let specificDirection = decreasePercent > 0 ? "decrease" : "increase";
  let specificPercent = decreasePercent > 0 ? decreasePercent : increasePercent;

  if (!specificPercent && basePrice > 0 && legacyFinalRate > 0) {
    const deltaAmount = legacyFinalRate - basePrice;
    specificDirection = deltaAmount < 0 ? "decrease" : "increase";
    specificPercent = Math.abs((deltaAmount / basePrice) * 100);
  }

  const roundedSpecificPercent = Number(specificPercent.toFixed(2));
  const changeAmount = Math.round((basePrice * roundedSpecificPercent) / 100);

  return {
  id: rule.id,
  type: rule.type || "single_day",
  hotelId: rule.hotel_id,
  hotelName: hotelsById.get(rule.hotel_id)?.name || "Khách sạn chưa xác định",
  roomTypeId: rule.room_type_id || "",
  roomTypeName: roomType?.name || "Room type chưa xác định",
  basePrice,
  priority: Number(rule.priority) || 100,
  active: rule.active !== false,
  multiplier: Number(rule.actions?.multiplier || 1),
  specificPercent: roundedSpecificPercent,
  specificDirection,
  changeAmount,
  estimatedRate:
    specificDirection === "decrease" ? Math.max(basePrice - changeAmount, 0) : basePrice + changeAmount,
  specificDate: rule.conditions?.date || "",
  startDate: rule.conditions?.start_date || "",
  endDate: rule.conditions?.end_date || "",
  specificNote: rule.note || "",
  };
};

const generateStayDates = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return [];
  }

  const dates = [];
  const current = new Date(start);
  while (current < end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const useAdminWorkspace = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [seasonalRules, setSeasonalRules] = useState([]);
  const [specificDatePricing, setSpecificDatePricing] = useState([]);

  const [managerHotels, setManagerHotels] = useState([]);
  const [managerRoomTypes, setManagerRoomTypes] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(hotelOptions[0]?.id || "");

  const [hotelDraft, setHotelDraft] = useState(createHotelDraft);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);
  const [isHotelSubmitting, setIsHotelSubmitting] = useState(false);
  const [hotelsError, setHotelsError] = useState("");

  const [roomTypeDraft, setRoomTypeDraft] = useState(createRoomTypeDraft);
  const [editingRoomTypeId, setEditingRoomTypeId] = useState(null);
  const [isRoomTypesLoading, setIsRoomTypesLoading] = useState(true);
  const [isRoomTypeSubmitting, setIsRoomTypeSubmitting] = useState(false);
  const [roomTypesError, setRoomTypesError] = useState("");

  const [facilityDraft, setFacilityDraft] = useState(createFacilityDraft);
  const [editingFacilityId, setEditingFacilityId] = useState(null);
  const [isFacilitiesLoading, setIsFacilitiesLoading] = useState(true);
  const [isFacilitySubmitting, setIsFacilitySubmitting] = useState(false);
  const [facilitiesError, setFacilitiesError] = useState("");

  const [amenityDraft, setAmenityDraft] = useState(createAmenityDraft);
  const [editingAmenityId, setEditingAmenityId] = useState(null);
  const [isAmenitiesLoading, setIsAmenitiesLoading] = useState(true);
  const [isAmenitySubmitting, setIsAmenitySubmitting] = useState(false);
  const [amenitiesError, setAmenitiesError] = useState("");
  const [pricingDraft, setPricingDraft] = useState(createPricingDraft);
  const [editingPricingId, setEditingPricingId] = useState(null);
  const [editingPricingType, setEditingPricingType] = useState("");
  const [isPricingRulesLoading, setIsPricingRulesLoading] = useState(true);
  const [isPricingRuleSubmitting, setIsPricingRuleSubmitting] = useState(false);
  const [pricingRulesError, setPricingRulesError] = useState("");
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isBookingHistoryLoading, setIsBookingHistoryLoading] = useState(true);
  const [bookingHistoryError, setBookingHistoryError] = useState("");

  const [pricePreviewDraft, setPricePreviewDraft] = useState({
    checkIn: getTodayDateValue(),
    checkOut: getTomorrowDateValue(),
  });

  const activeHotelOptions = managerHotels.length ? managerHotels : hotelOptions;

  const filteredRoomTypes = roomTypes.filter(
    (roomType) => !selectedHotelId || String(roomType.hotelId) === String(selectedHotelId),
  );
  const filteredManagerRoomTypes = managerRoomTypes.filter(
    (roomType) => !selectedHotelId || String(roomType.hotelId) === String(selectedHotelId),
  );
  const filteredAmenities = amenities;
  const filteredSeasonalRules = seasonalRules.filter(
    (rule) => !selectedHotelId || String(rule.hotelId) === String(selectedHotelId),
  );
  const filteredSpecificDatePricing = specificDatePricing.filter(
    (rule) => !selectedHotelId || String(rule.hotelId) === String(selectedHotelId),
  );
  const filteredBookingHistory = bookingHistory.filter(
    (booking) => !selectedHotelId || String(booking.hotel_id) === String(selectedHotelId),
  );

  const selectedHotel =
    activeHotelOptions.find((hotel) => String(hotel.id) === String(selectedHotelId)) ||
    activeHotelOptions[0] ||
    null;

  const highestHolidayUplift = 0;

  const getHolidayPercentForRoomType = () => 0;

  const dashboardSource = filteredBookingHistory;
  const paidDashboardSource = dashboardSource.filter(
    (booking) => String(booking?.payment_status || "").toUpperCase() === "PAID",
  );
  const paidBookingHistoryAllHotels = bookingHistory.filter(
    (booking) => String(booking?.payment_status || "").toUpperCase() === "PAID",
  );
  const totalBookings = dashboardSource.length;
  const totalRevenue = paidDashboardSource.reduce((sum, booking) => sum + Number(booking.final_amount || 0), 0);
  const averageBookingValue = paidDashboardSource.length
    ? Math.round(totalRevenue / paidDashboardSource.length)
    : 0;
  const paidBookings = dashboardSource.filter(
    (booking) => String(booking.payment_status || "").toUpperCase() === "PAID",
  ).length;
  const paidRatio = totalBookings ? roundPercent((paidBookings / totalBookings) * 100) : 0;
  const bookingStatusRows = createStatusRows(dashboardSource, "booking_status");
  const paymentStatusRows = createStatusRows(dashboardSource, "payment_status");
  const topHotelsByRevenue = createHotelRevenueRows(paidBookingHistoryAllHotels);
  const confirmedBookings = dashboardSource.filter(
    (booking) => String(booking.booking_status || "").toUpperCase() === "CONFIRMED",
  ).length;
  const confirmRate = totalBookings ? roundPercent((confirmedBookings / totalBookings) * 100) : 0;
  const pendingPaymentCount = dashboardSource.filter(
    (booking) => String(booking.payment_status || "").toUpperCase() === "PENDING",
  ).length;

  const dashboardStats = {
    totalBookings,
    totalRevenue,
    averageBookingValue,
    paidRatio,
    confirmRate,
    pendingPaymentCount,
    bookingStatusRows,
    paymentStatusRows,
    topHotelsByRevenue,
    revenueByMonth: buildRevenueByMonth(dashboardSource, 6),
    bookingsByDay: buildBookingsByDay(dashboardSource, 14),
  };

  const getPricingPreviewForRoomType = (roomType) => {
    const stayDates = generateStayDates(pricePreviewDraft.checkIn, pricePreviewDraft.checkOut);
    const basePrice = Number(roomType.basePrice) || 0;
    const nightlyRates = stayDates.map((date) => ({
      date,
      rate: basePrice,
      source: "base",
    }));
    const total = nightlyRates.reduce((sum, item) => sum + item.rate, 0);
    const averageNightlyRate = nightlyRates.length ? Math.round(total / nightlyRates.length) : basePrice;

    return {
      nights: stayDates.length,
      nightlyRates,
      total,
      averageNightlyRate,
      hasSpecificDate: false,
      hasSeasonal: false,
    };
  };

  const refreshHotels = useCallback(async () => {
    setIsHotelsLoading(true);

    try {
      const hotelsResponse = await getAdminHotelsApi();
      const nextHotels = hotelsResponse.map((hotel) => formatHotelOption(hotel));

      setManagerHotels(nextHotels);
      setHotelsError("");
      setSelectedHotelId((currentValue) => {
        if (nextHotels.some((hotel) => String(hotel.id) === String(currentValue))) {
          return currentValue;
        }
        return String(nextHotels[0]?.id || "");
      });
      setRoomTypeDraft((currentDraft) => ({
        ...currentDraft,
        hotelId:
          currentDraft.hotelId &&
          nextHotels.some((hotel) => String(hotel.id) === String(currentDraft.hotelId))
            ? currentDraft.hotelId
            : String(nextHotels[0]?.id || ""),
      }));
      setFacilityDraft((currentDraft) => ({
        ...currentDraft,
        hotelId:
          currentDraft.hotelId &&
          nextHotels.some((hotel) => String(hotel.id) === String(currentDraft.hotelId))
            ? currentDraft.hotelId
            : String(nextHotels[0]?.id || ""),
      }));
    } catch (error) {
      const message = getErrorMessage(error, "Không tải được danh mục khách sạn.");
      setHotelsError(message);
      setManagerHotels([]);
    } finally {
      setIsHotelsLoading(false);
    }
  }, []);

  const refreshRoomTypes = useCallback(async () => {
    setIsRoomTypesLoading(true);

    try {
      const hotelsById = new Map(managerHotels.map((hotel) => [hotel.id, hotel]));
      const response = await getAdminRoomTypesApi();
      const nextRoomTypes = response.map((roomType) => formatRoomTypeOption(roomType, hotelsById));

      setRoomTypes(nextRoomTypes);
      setManagerRoomTypes(nextRoomTypes);
      setRoomTypesError("");
    } catch (error) {
      setRoomTypesError(getErrorMessage(error, "Không tải được danh sách loại phòng."));
      setRoomTypes([]);
      setManagerRoomTypes([]);
    } finally {
      setIsRoomTypesLoading(false);
    }
  }, [managerHotels]);

  const refreshFacilities = useCallback(async () => {
    setIsFacilitiesLoading(true);

    try {
      const hotelsById = new Map(managerHotels.map((hotel) => [hotel.id, hotel]));
      const response = await getAdminFacilitiesApi();
      setFacilities(response.map((facility) => formatFacilityRecord(facility, hotelsById)));
      setFacilitiesError("");
    } catch (error) {
      setFacilitiesError(getErrorMessage(error, "Không tải được danh sách facilities."));
      setFacilities([]);
    } finally {
      setIsFacilitiesLoading(false);
    }
  }, [managerHotels]);

  const refreshAmenities = useCallback(async () => {
    setIsAmenitiesLoading(true);

    try {
      const response = await getAdminAmenitiesApi();
      setAmenities(response.map((amenity) => formatAmenityRecord(amenity)));
      setAmenitiesError("");
    } catch (error) {
      setAmenitiesError(getErrorMessage(error, "Không tải được danh sách amenities."));
      setAmenities([]);
    } finally {
      setIsAmenitiesLoading(false);
    }
  }, []);

  const refreshPricingRules = useCallback(async () => {
    setIsPricingRulesLoading(true);

    try {
      const hotelsById = new Map(managerHotels.map((hotel) => [hotel.id, hotel]));
      const roomTypesById = new Map(managerRoomTypes.map((roomType) => [roomType.id, roomType]));
      const response = await getAdminPricingRulesApi({ limit: 500 });
      const mappedRules = response.map((rule) => formatPricingRuleRecord(rule, hotelsById, roomTypesById));

      setSeasonalRules(mappedRules.filter((rule) => rule.type === "date_range"));
      setSpecificDatePricing(mappedRules.filter((rule) => rule.type === "single_day"));
      setPricingRulesError("");
    } catch (error) {
      setPricingRulesError(getErrorMessage(error, "Không tải được pricing rules."));
      setSeasonalRules([]);
      setSpecificDatePricing([]);
    } finally {
      setIsPricingRulesLoading(false);
    }
  }, [managerHotels, managerRoomTypes]);

  const refreshBookingHistory = useCallback(async () => {
    setIsBookingHistoryLoading(true);

    try {
      const accessToken = getAdminAccessToken();
      const response = await getAdminBookingHistoryApi(accessToken, {
        limit: 10000,
        hotel_id: selectedHotelId || undefined,
      });
      setBookingHistory(Array.isArray(response?.items) ? response.items : []);
      setBookingHistoryError("");
    } catch (error) {
      setBookingHistory([]);
      setBookingHistoryError(getErrorMessage(error, "Không tải được booking history."));
    } finally {
      setIsBookingHistoryLoading(false);
    }
  }, [selectedHotelId]);

  useEffect(() => {
    void refreshHotels();
    void refreshAmenities();
  }, [refreshAmenities, refreshHotels]);

  useEffect(() => {
    if (!selectedHotelId) return;
    void refreshBookingHistory();
  }, [refreshBookingHistory, selectedHotelId]);

  useEffect(() => {
    if (!managerHotels.length) {
      setRoomTypes([]);
      setManagerRoomTypes([]);
      setFacilities([]);
      setSeasonalRules([]);
      setSpecificDatePricing([]);
      setIsRoomTypesLoading(false);
      setIsFacilitiesLoading(false);
      setIsPricingRulesLoading(false);
      return;
    }

    void refreshRoomTypes();
    void refreshFacilities();
  }, [managerHotels, refreshFacilities, refreshRoomTypes]);

  useEffect(() => {
    if (!managerHotels.length || !managerRoomTypes.length) {
      return;
    }

    void refreshPricingRules();
  }, [managerHotels, managerRoomTypes, refreshPricingRules]);

  useEffect(() => {
    if (!managerHotels.length) return;

    setPricingDraft((currentDraft) => {
      const hotelId = currentDraft.hotelId || String(managerHotels[0]?.id || "");
      const roomTypeId =
        currentDraft.roomTypeId ||
        String(managerRoomTypes.find((roomType) => String(roomType.hotelId) === String(hotelId))?.id || "");

      return {
        ...currentDraft,
        hotelId,
        roomTypeId,
      };
    });
  }, [managerHotels, managerRoomTypes]);

  const resetHotelEditor = () => {
    setEditingHotelId(null);
    setHotelDraft(createHotelDraft());
  };

  const startHotelEdit = (hotel) => {
    setEditingHotelId(hotel.id);
    setHotelDraft({
      code: hotel.code,
      name: hotel.name,
      brand: hotel.brand,
      country: hotel.country,
      city: hotel.city,
      district: hotel.district,
      address: hotel.address,
      starRating: hotel.starRating,
      timeZone: hotel.timeZone,
      totalRooms: hotel.totalRooms,
      status: hotel.status,
    });
  };

  const submitHotel = async (event) => {
    event.preventDefault();

    const normalized = {
      code: String(hotelDraft.code || "").trim() || ensureCode("hotel", hotelDraft.name),
      name: String(hotelDraft.name || "").trim(),
      brand: String(hotelDraft.brand || "Pullman").trim(),
      country: String(hotelDraft.country || "").trim(),
      city: String(hotelDraft.city || "").trim(),
      district: String(hotelDraft.district || "").trim() || null,
      address: String(hotelDraft.address || "").trim(),
      star_rating: Number(hotelDraft.starRating) || 0,
      timezone: String(hotelDraft.timeZone || "Asia/Ho_Chi_Minh").trim(),
      total_rooms: Number(hotelDraft.totalRooms) || 0,
      status: String(hotelDraft.status || "active").trim(),
    };

    if (!normalized.name || !normalized.country || !normalized.city || !normalized.address) {
      setHotelsError("Vui lòng nhập tên khách sạn, quốc gia, thành phố và địa chỉ.");
      return;
    }

    const accessToken = getAdminAccessToken();
    setIsHotelSubmitting(true);

    try {
      if (editingHotelId) {
        await updateAdminHotelApi(editingHotelId, normalized, accessToken);
      } else {
        await createAdminHotelApi(normalized, accessToken);
      }

      await refreshHotels();
      resetHotelEditor();
    } catch (error) {
      setHotelsError(getErrorMessage(error, "Không lưu được khách sạn."));
    } finally {
      setIsHotelSubmitting(false);
    }
  };

  const deleteHotel = async (hotelId) => {
    const accessToken = getAdminAccessToken();
    setIsHotelSubmitting(true);

    try {
      await deleteAdminHotelApi(hotelId, accessToken);
      await refreshHotels();

      if (editingHotelId === hotelId) {
        resetHotelEditor();
      }
    } catch (error) {
      setHotelsError(getErrorMessage(error, "Không xóa được khách sạn."));
    } finally {
      setIsHotelSubmitting(false);
    }
  };

  const resetRoomTypeEditor = () => {
    setEditingRoomTypeId(null);
    setRoomTypeDraft({
      ...createRoomTypeDraft(),
      hotelId: String(selectedHotelId || managerHotels[0]?.id || ""),
    });
  };

  const startRoomTypeEdit = (roomType) => {
    setEditingRoomTypeId(roomType.id);
    setRoomTypeDraft({
      hotelId: String(roomType.hotelId),
      code: roomType.code,
      name: roomType.name,
      basePrice: roomType.basePrice,
      description: roomType.description,
      roomSize: roomType.roomSize,
      maxAdults: roomType.maxAdults,
      maxChildren: roomType.maxChildren,
      bedType: roomType.bedType,
      totalInventory: roomType.totalInventory,
      amenities: [...(roomType.amenities || [])],
      facilities: [...(roomType.facilities || [])],
    });
  };

  const submitRoomType = async (event) => {
    event.preventDefault();

    const normalized = {
      hotel_id: String(roomTypeDraft.hotelId || "").trim(),
      code: String(roomTypeDraft.code || "").trim() || ensureCode("room", roomTypeDraft.name),
      name: String(roomTypeDraft.name || "").trim(),
      description: String(roomTypeDraft.description || "").trim() || null,
      room_size: Number(roomTypeDraft.roomSize) || 0,
      max_adults: Number(roomTypeDraft.maxAdults) || 0,
      max_children: Number(roomTypeDraft.maxChildren) || 0,
      bed_type: String(roomTypeDraft.bedType || "").trim() || null,
      smoking_allowed: false,
      base_price: Number(roomTypeDraft.basePrice) || 0,
      total_inventory: Number(roomTypeDraft.totalInventory) || 0,
      amenity_ids: Array.isArray(roomTypeDraft.amenities)
        ? roomTypeDraft.amenities.map((item) => String(item))
        : [],
      facility_ids: Array.isArray(roomTypeDraft.facilities)
        ? roomTypeDraft.facilities.map((item) => String(item))
        : [],
    };

    if (!normalized.hotel_id || !normalized.name) {
      setRoomTypesError("Vui lòng chọn khách sạn và nhập tên loại phòng.");
      return;
    }

    const accessToken = getAdminAccessToken();
    setIsRoomTypeSubmitting(true);

    try {
      if (editingRoomTypeId) {
        await updateAdminRoomTypeApi(editingRoomTypeId, normalized, accessToken);
      } else {
        await createAdminRoomTypeApi(normalized, accessToken);
      }

      await refreshRoomTypes();
      resetRoomTypeEditor();
    } catch (error) {
      setRoomTypesError(getErrorMessage(error, "Không lưu được loại phòng."));
    } finally {
      setIsRoomTypeSubmitting(false);
    }
  };

  const deleteRoomType = async (roomTypeId) => {
    const accessToken = getAdminAccessToken();
    setIsRoomTypeSubmitting(true);

    try {
      await deleteAdminRoomTypeApi(roomTypeId, accessToken);
      await refreshRoomTypes();

      if (editingRoomTypeId === roomTypeId) {
        resetRoomTypeEditor();
      }
    } catch (error) {
      setRoomTypesError(getErrorMessage(error, "Không xóa được loại phòng."));
    } finally {
      setIsRoomTypeSubmitting(false);
    }
  };

  const updateRoomTypePrice = (roomTypeId, nextValue) => {
    const applyNextPrice = (currentRoomTypes) =>
      currentRoomTypes.map((roomType) =>
        roomType.id === roomTypeId
          ? { ...roomType, basePrice: Number(nextValue) || 0 }
          : roomType,
      );

    setRoomTypes(applyNextPrice);
    setManagerRoomTypes(applyNextPrice);
  };

  const resetFacilityEditor = () => {
    setEditingFacilityId(null);
    setFacilityDraft({
      ...createFacilityDraft(),
      hotelId: String(selectedHotelId || managerHotels[0]?.id || ""),
    });
  };

  const startFacilityEdit = (facility) => {
    setEditingFacilityId(facility.id);
    setFacilityDraft({
      hotelId: String(facility.hotelId),
      code: facility.code,
      name: facility.name,
      price: facility.price,
      pricingType: facility.pricingType,
      facilityType: facility.facilityType,
      description: facility.description,
    });
  };

  const submitFacility = async (event) => {
    event.preventDefault();

    const normalized = {
      hotel_id: String(facilityDraft.hotelId || "").trim(),
      code: String(facilityDraft.code || "").trim() || ensureCode("facility", facilityDraft.name),
      name: String(facilityDraft.name || "").trim(),
      description: String(facilityDraft.description || "").trim() || null,
      facility_type: String(facilityDraft.facilityType || "service").trim(),
      price_type: String(facilityDraft.pricingType || "per_use").trim(),
      base_price: Number(facilityDraft.price) || 0,
      is_active: true,
    };

    if (!normalized.hotel_id || !normalized.name) {
      setFacilitiesError("Vui lòng chọn khách sạn và nhập tên facility.");
      return;
    }

    const accessToken = getAdminAccessToken();
    setIsFacilitySubmitting(true);

    try {
      if (editingFacilityId) {
        await updateAdminFacilityApi(editingFacilityId, normalized, accessToken);
      } else {
        await createAdminFacilityApi(normalized, accessToken);
      }

      await refreshFacilities();
      resetFacilityEditor();
    } catch (error) {
      setFacilitiesError(getErrorMessage(error, "Không lưu được facility."));
    } finally {
      setIsFacilitySubmitting(false);
    }
  };

  const deleteFacility = async (facilityId) => {
    const accessToken = getAdminAccessToken();
    setIsFacilitySubmitting(true);

    try {
      await deleteAdminFacilityApi(facilityId, accessToken);
      await refreshFacilities();

      if (editingFacilityId === facilityId) {
        resetFacilityEditor();
      }
    } catch (error) {
      setFacilitiesError(getErrorMessage(error, "Không xóa được facility."));
    } finally {
      setIsFacilitySubmitting(false);
    }
  };

  const resetAmenityEditor = () => {
    setEditingAmenityId(null);
    setAmenityDraft(createAmenityDraft());
  };

  const startAmenityEdit = (amenity) => {
    setEditingAmenityId(amenity.id);
    setAmenityDraft({
      code: amenity.code,
      name: amenity.name,
      icon: amenity.icon,
      description: amenity.description,
    });
  };

  const submitAmenity = async (event) => {
    event.preventDefault();

    const normalized = {
      code: String(amenityDraft.code || "").trim() || ensureCode("amenity", amenityDraft.name),
      name: String(amenityDraft.name || "").trim(),
      icon: String(amenityDraft.icon || "").trim() || null,
      description: String(amenityDraft.description || "").trim() || null,
    };

    if (!normalized.name) {
      setAmenitiesError("Vui lòng nhập tên amenity.");
      return;
    }

    const accessToken = getAdminAccessToken();
    setIsAmenitySubmitting(true);

    try {
      if (editingAmenityId) {
        await updateAdminAmenityApi(editingAmenityId, normalized, accessToken);
      } else {
        await createAdminAmenityApi(normalized, accessToken);
      }

      await refreshAmenities();
      resetAmenityEditor();
    } catch (error) {
      setAmenitiesError(getErrorMessage(error, "Không lưu được amenity."));
    } finally {
      setIsAmenitySubmitting(false);
    }
  };

  const deleteAmenity = async (amenityId) => {
    const accessToken = getAdminAccessToken();
    setIsAmenitySubmitting(true);

    try {
      await deleteAdminAmenityApi(amenityId, accessToken);
      await refreshAmenities();

      if (editingAmenityId === amenityId) {
        resetAmenityEditor();
      }
    } catch (error) {
      setAmenitiesError(getErrorMessage(error, "Không xóa được amenity."));
    } finally {
      setIsAmenitySubmitting(false);
    }
  };

  const resetPricingEditor = () => {
    setEditingPricingId(null);
    setEditingPricingType("");
    setPricingDraft((currentDraft) => ({
      ...createPricingDraft(),
      hotelId: currentDraft.hotelId || String(selectedHotelId || managerHotels[0]?.id || ""),
      roomTypeId:
        managerRoomTypes.find(
          (roomType) => String(roomType.hotelId) === String(currentDraft.hotelId || selectedHotelId),
        )?.id || "",
    }));
  };

  const startPricingEdit = (rule) => {
    setEditingPricingId(rule.id);
    setEditingPricingType(rule.type);
    setPricingDraft({
      type: rule.type,
      hotelId: String(rule.hotelId || ""),
      roomTypeId: String(rule.roomTypeId || ""),
      specificDate: rule.specificDate || "",
      specificPercent: Number(rule.specificPercent) || 0,
      specificDirection: rule.specificDirection || "increase",
      specificNote: rule.specificNote || "",
      startDate: rule.startDate || "",
      endDate: rule.endDate || "",
      multiplier: Number(rule.multiplier) || 1,
      priority: Number(rule.priority) || 100,
      active: rule.active !== false,
    });
  };

  const submitPricing = async (event) => {
    event.preventDefault();
    setPricingRulesError("");

    const isSingleDay = pricingDraft.type === "single_day";
    const normalized = {
      hotel_id: String(pricingDraft.hotelId || "").trim(),
      room_type_id: String(pricingDraft.roomTypeId || "").trim(),
      type: pricingDraft.type,
      priority: Number(pricingDraft.priority) || 100,
      active: pricingDraft.active !== false,
      note: String(pricingDraft.specificNote || "").trim() || null,
      conditions: isSingleDay
        ? { date: String(pricingDraft.specificDate || "").trim() }
        : {
            start_date: String(pricingDraft.startDate || "").trim(),
            end_date: String(pricingDraft.endDate || "").trim(),
          },
      actions: isSingleDay
        ? pricingDraft.specificDirection === "decrease"
          ? { decrease_percent: Number(pricingDraft.specificPercent) || 0 }
          : { increase_percent: Number(pricingDraft.specificPercent) || 0 }
        : { multiplier: Number(pricingDraft.multiplier) || 1 },
    };

    if (!normalized.hotel_id || !normalized.room_type_id) {
      setPricingRulesError("Vui lòng chọn khách sạn và room type.");
      return;
    }

    if (isSingleDay && !normalized.conditions.date) {
      setPricingRulesError("Vui lòng chọn ngày áp dụng.");
      return;
    }

    if (isSingleDay && (!Number.isFinite(Number(pricingDraft.specificPercent)) || Number(pricingDraft.specificPercent) <= 0)) {
      setPricingRulesError("Vui lòng nhập phần trăm thay đổi lớn hơn 0 cho rule đơn ngày.");
      return;
    }

    if (!isSingleDay && (!normalized.conditions.start_date || !normalized.conditions.end_date)) {
      setPricingRulesError("Vui lòng chọn ngày bắt đầu và kết thúc.");
      return;
    }

    const accessToken = getAdminAccessToken();
    setIsPricingRuleSubmitting(true);

    try {
      if (editingPricingId) {
        await updateAdminPricingRuleApi(editingPricingId, normalized, accessToken);
      } else {
        await createAdminPricingRuleApi(normalized, accessToken);
      }

      await refreshPricingRules();
      resetPricingEditor();
    } catch (error) {
      setPricingRulesError(getErrorMessage(error, "Không lưu được pricing rule."));
    } finally {
      setIsPricingRuleSubmitting(false);
    }
  };

  const deletePricing = async (pricingRuleId) => {
    const accessToken = getAdminAccessToken();
    setIsPricingRuleSubmitting(true);

    try {
      await deleteAdminPricingRuleApi(pricingRuleId, accessToken);
      await refreshPricingRules();

      if (editingPricingId === pricingRuleId) {
        resetPricingEditor();
      }
    } catch (error) {
      setPricingRulesError(getErrorMessage(error, "Không xóa được pricing rule."));
    } finally {
      setIsPricingRuleSubmitting(false);
    }
  };

  return {
    hotelOptions: activeHotelOptions,
    roomTypes,
    facilities,
    amenities,
    filteredAmenities,
    seasonalRules,
    specificDatePricing,
    managerHotels,
    managerRoomTypes,
    selectedHotelId,
    setSelectedHotelId,
    filteredRoomTypes,
    filteredManagerRoomTypes,
    filteredSeasonalRules,
    filteredSpecificDatePricing,
    filteredBookingHistory,
    selectedHotel,
    highestHolidayUplift,
    getHolidayPercentForRoomType,
    getPricingPreviewForRoomType,
    pricePreviewDraft,
    setPricePreviewDraft,
    hotelDraft,
    setHotelDraft,
    editingHotelId,
    startHotelEdit,
    submitHotel,
    deleteHotel,
    resetHotelEditor,
    isHotelsLoading,
    isHotelSubmitting,
    hotelsError,
    roomTypeDraft,
    setRoomTypeDraft,
    editingRoomTypeId,
    startRoomTypeEdit,
    submitRoomType,
    deleteRoomType,
    updateRoomTypePrice,
    resetRoomTypeEditor,
    isRoomTypesLoading,
    isRoomTypeSubmitting,
    roomTypesError,
    facilityDraft,
    setFacilityDraft,
    editingFacilityId,
    startFacilityEdit,
    submitFacility,
    deleteFacility,
    resetFacilityEditor,
    isFacilitiesLoading,
    isFacilitySubmitting,
    facilitiesError,
    amenityDraft,
    setAmenityDraft,
    editingAmenityId,
    startAmenityEdit,
    submitAmenity,
    deleteAmenity,
    resetAmenityEditor,
    isAmenitiesLoading,
    isAmenitySubmitting,
    amenitiesError,
    pricingDraft,
    setPricingDraft,
    editingPricingId,
    editingPricingType,
    submitPricing,
    startPricingEdit,
    deletePricing,
    resetPricingEditor,
    isPricingRulesLoading,
    isPricingRuleSubmitting,
    pricingRulesError,
    bookingHistory,
    isBookingHistoryLoading,
    bookingHistoryError,
    dashboardStats,
  };
};

export default useAdminWorkspace;
