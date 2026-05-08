import { useCallback, useEffect, useState } from "react";
import {
  createCountryDraft,
  createSearchIndexDraft,
  buildRoomTypes,
  createAmenityDraft,
  createFacilityDraft,
  createHotelDraft,
  createPricingDraft,
  createRoomTypeDraft,
  hotelOptions,
} from "./adminData";
import {
  createAdminAmenityApi,
  createAdminCountryApi,
  getAdminCountriesApi,
  createAdminFacilityApi,
  createAdminHotelApi,
  createAdminSeasonalPricingApi,
  createAdminSpecificDatePricingApi,
  createAdminRoomTypeApi,
  deleteAdminAmenityApi,
  deleteAdminCountryApi,
  deleteAdminFacilityApi,
  deleteAdminHotelApi,
  deleteAdminSeasonalPricingApi,
  deleteAdminSpecificDatePricingApi,
  deleteAdminRoomTypeApi,
  getAdminAmenitiesApi,
  getAdminFacilitiesApi,
  getAdminHotelsApi,
  getAdminSeasonalPricingApi,
  getAdminSearchIndexStatusApi,
  getAdminSpecificDatePricingApi,
  getAdminRoomTypesApi,
  readAuthSession,
  rebuildAdminSearchIndexApi,
  testAdminSearchIndexQueryApi,
  updateAdminAmenityApi,
  updateAdminCountryApi,
  updateAdminFacilityApi,
  updateAdminHotelApi,
  updateAdminSeasonalPricingApi,
  updateAdminSpecificDatePricingApi,
  updateAdminRoomTypeApi,
} from "../../utils/auth";
import { getTodayDateValue, getTomorrowDateValue } from "../../utils/search";

const getErrorMessage = (error, fallbackMessage) => error?.message || fallbackMessage;

const formatHotelOption = (hotel) => ({
  id: hotel.id,
  countryId: hotel.countryId || "",
  name: hotel.name,
  city: hotel.cityAddress || "",
  cityAddress: hotel.cityAddress || "",
  starRating: Number(hotel.starRating) || 0,
  description: hotel.description || "",
  timeZone: hotel.timeZone || "UTC",
});

const formatCountryOption = (country) => ({
  id: country.id || country.country_id,
  code: country.code || country.country_code || "",
  name: country.name || country.country_name || "",
});

const normalizeDateKey = (dateValue) => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
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
    dates.push(normalizeDateKey(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const formatRoomTypeOption = (roomType, hotelsById) => ({
  id: roomType.roomTypeId,
  roomTypeId: roomType.roomTypeId,
  hotelId: roomType.hotelId,
  hotelName: hotelsById.get(roomType.hotelId)?.name || "Khách sạn chưa xác định",
  name: roomType.name,
  basePrice: Number(roomType.basePrice) || 0,
  servicesText: roomType.servicesText || roomType.services || "",
  facilities: Array.isArray(roomType.facilities) ? roomType.facilities : [],
  facilityIds: Array.isArray(roomType.facilityIds)
    ? roomType.facilityIds
    : Array.isArray(roomType.facilities)
      ? roomType.facilities.map((facility) => facility.id)
      : [],
  amenities: Array.isArray(roomType.amenities) ? roomType.amenities : [],
  amenityIds: Array.isArray(roomType.amenityIds)
    ? roomType.amenityIds
    : Array.isArray(roomType.amenities)
      ? roomType.amenities.map((amenity) => amenity.id)
      : [],
  amenityNames: Array.isArray(roomType.amenityNames)
    ? roomType.amenityNames
    : Array.isArray(roomType.amenities)
      ? roomType.amenities.map((amenity) => amenity.name)
      : [],
  category: "",
  intro: roomType.servicesText || roomType.services || "",
  capacity: "",
  size: "",
  bed: "",
  view: "",
});

const formatFacilityRecord = (facility, hotelsById) => ({
  id: facility.id,
  hotelId: facility.hotelId,
  hotelName: hotelsById.get(facility.hotelId)?.name || "Khách sạn chưa xác định",
  name: facility.name,
  price: Number(facility.price) || 0,
  pricingType: facility.pricingType || "per_use",
});

const formatAmenityRecord = (amenity, hotelsById) => ({
  id: amenity.id,
  hotelId: amenity.hotelId,
  hotelName: hotelsById.get(amenity.hotelId)?.name || "Khách sạn chưa xác định",
  name: amenity.name,
  description: amenity.description || "",
});

const formatSeasonalPricingRecord = (record, hotelsById) => ({
  id: record.id,
  type: "date_range",
  hotelId: record.hotelId,
  hotelName: record.hotelName || hotelsById.get(record.hotelId)?.name || "Khách sạn chưa xác định",
  startDate: record.startDate,
  endDate: record.endDate,
  multiplier: Number(record.multiplier) || 1,
});

const formatSpecificDatePricingRecord = (record, roomTypesById, hotelsById) => {
  const roomType = roomTypesById.get(record.roomTypeId);
  const hotelId = record.hotelId || roomType?.hotelId || "";

  return {
    id: record.id,
    type: "single_day",
    roomTypeId: record.roomTypeId,
    roomTypeName: record.roomTypeName || roomType?.name || "Room type chưa xác định",
    hotelId,
    hotelName:
      record.hotelName ||
      roomType?.hotelName ||
      hotelsById.get(hotelId)?.name ||
      "Khách sạn chưa xác định",
    specificDate: record.specificDate,
    specificRate: Number(record.specificRate) || 0,
    specificNote: record.specificNote || "",
  };
};

const getAdminAccessToken = () => {
  const session = readAuthSession();
  return session?.accessToken || "";
};

export const useAdminWorkspace = () => {
  const [roomTypes, setRoomTypes] = useState(buildRoomTypes);
  const [facilities, setFacilities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [seasonalRules, setSeasonalRules] = useState([]);
  const [specificDatePricing, setSpecificDatePricing] = useState([]);

  const [managerHotels, setManagerHotels] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [managerRoomTypes, setManagerRoomTypes] = useState([]);
  const [hasLoadedManagerCatalogs, setHasLoadedManagerCatalogs] = useState(false);

  const [selectedHotelId, setSelectedHotelId] = useState(hotelOptions[0]?.id || "");

  const [hotelDraft, setHotelDraft] = useState(createHotelDraft);
  const [countryDraft, setCountryDraft] = useState(createCountryDraft);
  const [editingCountryId, setEditingCountryId] = useState(null);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [isCountrySubmitting, setIsCountrySubmitting] = useState(false);
  const [countriesError, setCountriesError] = useState("");
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
  const [editingPricingType, setEditingPricingType] = useState(null);
  const [isPricingLoading, setIsPricingLoading] = useState(true);
  const [isPricingSubmitting, setIsPricingSubmitting] = useState(false);
  const [pricingError, setPricingError] = useState("");
  const [pricePreviewDraft, setPricePreviewDraft] = useState({
    checkIn: getTodayDateValue(),
    checkOut: getTomorrowDateValue(),
  });
  const [searchIndexStatus, setSearchIndexStatus] = useState(null);
  const [searchIndexDraft, setSearchIndexDraft] = useState(createSearchIndexDraft);
  const [searchIndexResults, setSearchIndexResults] = useState([]);
  const [isSearchIndexLoading, setIsSearchIndexLoading] = useState(false);
  const [isSearchIndexSubmitting, setIsSearchIndexSubmitting] = useState(false);
  const [searchIndexError, setSearchIndexError] = useState("");

  const activeHotelOptions = managerHotels.length ? managerHotels : hotelOptions;

  const filteredRoomTypes = roomTypes.filter(
    (roomType) => !selectedHotelId || String(roomType.hotelId) === String(selectedHotelId),
  );
  const hasManagerSelectedHotel = managerHotels.some(
    (hotel) => String(hotel.id) === String(selectedHotelId),
  );
  const filteredManagerRoomTypes = managerRoomTypes.filter(
    (roomType) =>
      !selectedHotelId ||
      !hasManagerSelectedHotel ||
      String(roomType.hotelId) === String(selectedHotelId),
  );
  const filteredSeasonalRules = seasonalRules.filter(
    (rule) => !selectedHotelId || String(rule.hotelId) === String(selectedHotelId),
  );
  const filteredSpecificDatePricing = specificDatePricing.filter(
    (rule) => !selectedHotelId || String(rule.hotelId) === String(selectedHotelId),
  );
  const filteredAmenities = amenities.filter(
    (amenity) => !selectedHotelId || String(amenity.hotelId) === String(selectedHotelId),
  );

  const selectedHotel =
    activeHotelOptions.find((hotel) => String(hotel.id) === String(selectedHotelId)) ||
    activeHotelOptions[0] ||
    null;

  const highestHolidayUplift = seasonalRules.reduce(
    (maxValue, rule) => Math.max(maxValue, Math.round((Number(rule.multiplier) - 1) * 100) || 0),
    0,
  );

  const getHolidayPercentForRoomType = (roomType) =>
    seasonalRules.reduce((bestMatch, rule) => {
      if (String(rule.hotelId) !== String(roomType.hotelId)) {
        return bestMatch;
      }

      return Math.max(bestMatch, Math.round((Number(rule.multiplier) - 1) * 100) || 0);
    }, 0);

  const getPricingPreviewForRoomType = (roomType) => {
    const stayDates = generateStayDates(pricePreviewDraft.checkIn, pricePreviewDraft.checkOut);
    const basePrice = Number(roomType.basePrice) || 0;
    const seasonalByHotel = seasonalRules
      .filter((rule) => String(rule.hotelId) === String(roomType.hotelId))
      .map((rule) => ({
        startDate: normalizeDateKey(rule.startDate),
        endDate: normalizeDateKey(rule.endDate),
        multiplier: Number(rule.multiplier) || 1,
      }));
    const specificByRoomType = new Map(
      specificDatePricing
        .filter((rule) => String(rule.roomTypeId) === String(roomType.id))
        .map((rule) => [normalizeDateKey(rule.specificDate), Number(rule.specificRate) || 0]),
    );

    const nightlyRates = stayDates.map((date) => {
      const specificRate = specificByRoomType.get(date);
      if (specificRate) {
        return {
          date,
          rate: specificRate,
          source: "single_day",
        };
      }

      const seasonalRule = seasonalByHotel.find(
        (rule) => date >= rule.startDate && date <= rule.endDate,
      );

      if (seasonalRule) {
        return {
          date,
          rate: Math.round(basePrice * seasonalRule.multiplier),
          source: "date_range",
        };
      }

      return {
        date,
        rate: basePrice,
        source: "base",
      };
    });

    const total = nightlyRates.reduce((sum, item) => sum + item.rate, 0);
    const averageNightlyRate = nightlyRates.length ? Math.round(total / nightlyRates.length) : basePrice;

    return {
      nights: stayDates.length,
      nightlyRates,
      total,
      averageNightlyRate,
      hasSpecificDate: nightlyRates.some((item) => item.source === "single_day"),
      hasSeasonal: nightlyRates.some((item) => item.source === "date_range"),
    };
  };

  const refreshHotels = useCallback(async () => {
    setIsHotelsLoading(true);

    try {
      const hotelsResponse = await getAdminHotelsApi();
      const nextHotels = Array.isArray(hotelsResponse)
        ? hotelsResponse.map((hotel) => formatHotelOption(hotel))
        : [];

      setManagerHotels(nextHotels);
      setHotelsError("");
      setSelectedHotelId((currentValue) => {
        if (nextHotels.some((hotel) => String(hotel.id) === String(currentValue))) {
          return currentValue;
        }
        return nextHotels[0]?.id || "";
      });
      setFacilityDraft((currentDraft) => ({
        ...currentDraft,
        hotelId:
          nextHotels.some((hotel) => String(hotel.id) === String(currentDraft.hotelId))
            ? currentDraft.hotelId
            : nextHotels[0]?.id || "",
      }));
      setRoomTypeDraft((currentDraft) => ({
        ...currentDraft,
        hotelId:
          nextHotels.some((hotel) => String(hotel.id) === String(currentDraft.hotelId))
            ? currentDraft.hotelId
            : nextHotels[0]?.id || "",
      }));
    } catch (error) {
      const message = getErrorMessage(error, "Không tải được danh mục khách sạn.");
      setHotelsError(message);
      setRoomTypesError(message);
      setFacilitiesError(message);
      setAmenitiesError(message);
      setManagerHotels([]);
    } finally {
      setIsHotelsLoading(false);
      setHasLoadedManagerCatalogs(true);
    }
  }, []);

  const refreshCountries = useCallback(async () => {
    setIsCountriesLoading(true);

    try {
      const countriesResponse = await getAdminCountriesApi();
      const nextCountries = Array.isArray(countriesResponse)
        ? countriesResponse.map((country) => formatCountryOption(country))
        : [];

      setCountryOptions(nextCountries);
      setCountriesError("");
      setHotelDraft((currentDraft) => ({
        ...currentDraft,
        countryId:
          currentDraft.countryId &&
          nextCountries.some((country) => String(country.id) === String(currentDraft.countryId))
            ? currentDraft.countryId
            : nextCountries[0]?.id || "",
      }));
    } catch (error) {
      const message = getErrorMessage(error, "Không tải được danh sách quốc gia.");
      setCountriesError(message);
      setHotelsError(message);
      setCountryOptions([]);
    } finally {
      setIsCountriesLoading(false);
    }
  }, []);

  const refreshRoomTypes = useCallback(async () => {
    const hotelsById = new Map(managerHotels.map((hotel) => [hotel.id, hotel]));
    setIsRoomTypesLoading(true);

    try {
      const response = await getAdminRoomTypesApi();
      const nextRoomTypes = Array.isArray(response)
        ? response.map((roomType) => formatRoomTypeOption(roomType, hotelsById))
        : [];

      setRoomTypes(nextRoomTypes);
      setManagerRoomTypes(nextRoomTypes);
      setRoomTypesError("");
      setPricingDraft((currentDraft) => {
        const nextHotelId =
          currentDraft.hotelId &&
          nextRoomTypes.some((roomType) => String(roomType.hotelId) === String(currentDraft.hotelId))
            ? currentDraft.hotelId
            : managerHotels[0]?.id || "";
        const availableRoomTypes = nextRoomTypes.filter(
          (roomType) => String(roomType.hotelId) === String(nextHotelId),
        );

        return {
          ...currentDraft,
          hotelId: nextHotelId,
          roomTypeId:
            currentDraft.roomTypeId &&
            availableRoomTypes.some((roomType) => String(roomType.id) === String(currentDraft.roomTypeId))
              ? currentDraft.roomTypeId
              : availableRoomTypes[0]?.id || "",
        };
      });
    } catch (error) {
      setRoomTypesError(getErrorMessage(error, "Không tải được danh sách loại phòng."));
      setRoomTypes([]);
      setManagerRoomTypes([]);
    } finally {
      setIsRoomTypesLoading(false);
    }
  }, [managerHotels]);

  const refreshFacilities = useCallback(async () => {
    const hotelsById = new Map(managerHotels.map((hotel) => [hotel.id, hotel]));
    setIsFacilitiesLoading(true);

    try {
      const response = await getAdminFacilitiesApi();
      const nextFacilities = Array.isArray(response)
        ? response.map((facility) => formatFacilityRecord(facility, hotelsById))
        : [];

      setFacilities(nextFacilities);
      setFacilitiesError("");
    } catch (error) {
      setFacilitiesError(getErrorMessage(error, "Không tải được danh sách dịch vụ."));
    } finally {
      setIsFacilitiesLoading(false);
    }
  }, [managerHotels]);

  const refreshAmenities = useCallback(async () => {
    const hotelsById = new Map(managerHotels.map((hotel) => [hotel.id, hotel]));
    setIsAmenitiesLoading(true);

    try {
      const response = await getAdminAmenitiesApi();
      const nextAmenities = Array.isArray(response)
        ? response.map((amenity) => formatAmenityRecord(amenity, hotelsById))
        : [];

      setAmenities(nextAmenities);
      setAmenitiesError("");
    } catch (error) {
      setAmenitiesError(getErrorMessage(error, "Không tải được danh sách tiện nghi."));
    } finally {
      setIsAmenitiesLoading(false);
    }
  }, [managerHotels]);

  const refreshPricing = useCallback(async () => {
    const hotelsById = new Map(managerHotels.map((hotel) => [hotel.id, hotel]));
    const roomTypesById = new Map(managerRoomTypes.map((roomType) => [roomType.id, roomType]));
    setIsPricingLoading(true);

    try {
      const [seasonalResponse, specificResponse] = await Promise.all([
        getAdminSeasonalPricingApi({ limit: 200 }),
        getAdminSpecificDatePricingApi({ limit: 200 }),
      ]);

      setSeasonalRules(
        Array.isArray(seasonalResponse)
          ? seasonalResponse.map((record) => formatSeasonalPricingRecord(record, hotelsById))
          : [],
      );
      setSpecificDatePricing(
        Array.isArray(specificResponse)
          ? specificResponse.map((record) =>
              formatSpecificDatePricingRecord(record, roomTypesById, hotelsById),
            )
          : [],
      );
      setPricingError("");
    } catch (error) {
      setPricingError(getErrorMessage(error, "Không tải được pricing."));
      setSeasonalRules([]);
      setSpecificDatePricing([]);
    } finally {
      setIsPricingLoading(false);
    }
  }, [managerHotels, managerRoomTypes]);

  const refreshSearchIndexStatus = useCallback(async () => {
    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setSearchIndexStatus(null);
      return;
    }

    setIsSearchIndexLoading(true);
    try {
      const response = await getAdminSearchIndexStatusApi(accessToken);
      setSearchIndexStatus(response);
      setSearchIndexError("");
    } catch (error) {
      setSearchIndexError(getErrorMessage(error, "Không tải được trạng thái search index."));
      setSearchIndexStatus(null);
    } finally {
      setIsSearchIndexLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshHotels();
    void refreshCountries();
    void refreshSearchIndexStatus();
  }, [refreshCountries, refreshHotels, refreshSearchIndexStatus]);

  useEffect(() => {
    if (!hasLoadedManagerCatalogs) {
      return;
    }

    if (!managerHotels.length) {
      setManagerRoomTypes([]);
      setFacilities([]);
      setIsRoomTypesLoading(false);
      setIsFacilitiesLoading(false);
      return;
    }

    void refreshRoomTypes();
    void refreshFacilities();
  }, [hasLoadedManagerCatalogs, managerHotels, refreshFacilities, refreshRoomTypes]);

  useEffect(() => {
    if (!hasLoadedManagerCatalogs) {
      return;
    }

    if (!managerHotels.length) {
      setAmenities([]);
      setIsAmenitiesLoading(false);
      return;
    }

    void refreshAmenities();
  }, [hasLoadedManagerCatalogs, managerHotels, refreshAmenities]);

  useEffect(() => {
    if (editingRoomTypeId || !selectedHotelId) {
      return;
    }

    setRoomTypeDraft((currentDraft) => {
      if (String(currentDraft.hotelId) === String(selectedHotelId)) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        hotelId: selectedHotelId,
        amenities: [],
        facilities: [],
      };
    });
  }, [editingRoomTypeId, selectedHotelId]);

  useEffect(() => {
    if (editingFacilityId || !selectedHotelId) {
      return;
    }

    setFacilityDraft((currentDraft) => {
      if (String(currentDraft.hotelId) === String(selectedHotelId)) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        hotelId: selectedHotelId,
      };
    });
  }, [editingFacilityId, selectedHotelId]);

  useEffect(() => {
    if (editingAmenityId || !selectedHotelId) {
      return;
    }

    setAmenityDraft((currentDraft) => {
      if (String(currentDraft.hotelId) === String(selectedHotelId)) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        hotelId: selectedHotelId,
      };
    });
  }, [editingAmenityId, selectedHotelId]);

  const resetCountryEditor = () => {
    setEditingCountryId(null);
    setCountryDraft(createCountryDraft());
  };

  const startCountryEdit = (country) => {
    setEditingCountryId(country.id);
    setCountryDraft({
      code: country.code || "",
      name: country.name || "",
    });
  };

  const submitCountry = async (event) => {
    event.preventDefault();

    const normalized = {
      country_code: String(countryDraft.code || "").trim().toUpperCase(),
      country_name: String(countryDraft.name || "").trim(),
    };

    if (!normalized.country_code || !normalized.country_name) {
      setCountriesError("Vui lòng nhập đầy đủ mã quốc gia và tên quốc gia.");
      return;
    }

    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setCountriesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsCountrySubmitting(true);

    try {
      if (editingCountryId) {
        await updateAdminCountryApi(editingCountryId, normalized, accessToken);
      } else {
        await createAdminCountryApi(normalized, accessToken);
      }

      await refreshCountries();
      resetCountryEditor();
    } catch (error) {
      setCountriesError(getErrorMessage(error, "Không lưu được quốc gia."));
    } finally {
      setIsCountrySubmitting(false);
    }
  };

  const deleteCountry = async (countryId) => {
    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setCountriesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsCountrySubmitting(true);

    try {
      await deleteAdminCountryApi(countryId, accessToken);
      await refreshCountries();

      if (editingCountryId === countryId) {
        resetCountryEditor();
      }
    } catch (error) {
      setCountriesError(getErrorMessage(error, "Không xóa được quốc gia."));
    } finally {
      setIsCountrySubmitting(false);
    }
  };

  const rebuildSearchIndex = async () => {
    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setSearchIndexError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsSearchIndexSubmitting(true);
    try {
      await rebuildAdminSearchIndexApi(
        {
          horizonDays: Number(searchIndexDraft.horizonDays) || 180,
        },
        accessToken,
      );
      await refreshSearchIndexStatus();
      setSearchIndexError("");
    } catch (error) {
      setSearchIndexError(getErrorMessage(error, "Không rebuild được search index."));
    } finally {
      setIsSearchIndexSubmitting(false);
    }
  };

  const testSearchIndexQuery = async () => {
    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setSearchIndexError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsSearchIndexSubmitting(true);
    setIsSearchIndexLoading(true);
    try {
      const response = await testAdminSearchIndexQueryApi(
        {
          search: searchIndexDraft.search,
          checkIn: searchIndexDraft.checkIn,
          checkOut: searchIndexDraft.checkOut,
          guests: searchIndexDraft.guests,
          roomType: searchIndexDraft.roomType,
          amenity: searchIndexDraft.amenity,
          service: searchIndexDraft.service,
          minPrice: searchIndexDraft.minPrice,
          maxPrice: searchIndexDraft.maxPrice,
          stars: searchIndexDraft.stars,
          sortBy: searchIndexDraft.sortBy,
        },
        accessToken,
      );
      setSearchIndexResults(Array.isArray(response?.hotels) ? response.hotels : []);
      setSearchIndexError("");
    } catch (error) {
      setSearchIndexError(getErrorMessage(error, "Không test được search query."));
      setSearchIndexResults([]);
    } finally {
      setIsSearchIndexSubmitting(false);
      setIsSearchIndexLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoadedManagerCatalogs) {
      return;
    }

    if (!managerHotels.length || !managerRoomTypes.length) {
      setSeasonalRules([]);
      setSpecificDatePricing([]);
      setIsPricingLoading(false);
      return;
    }

    void refreshPricing();
  }, [hasLoadedManagerCatalogs, managerHotels, managerRoomTypes, refreshPricing]);

  useEffect(() => {
    setPricingDraft((currentDraft) => {
      if (editingPricingId) {
        return currentDraft;
      }

      const nextHotelId = currentDraft.hotelId || selectedHotelId || managerHotels[0]?.id || "";
      const matchedHotelId =
        selectedHotelId &&
        managerHotels.some((hotel) => String(hotel.id) === String(selectedHotelId))
          ? selectedHotelId
          : nextHotelId;
      const availableRoomTypes = managerRoomTypes.filter(
        (roomType) => String(roomType.hotelId) === String(matchedHotelId),
      );

      return {
        ...currentDraft,
        hotelId: matchedHotelId,
        roomTypeId:
          currentDraft.roomTypeId &&
          availableRoomTypes.some((roomType) => String(roomType.id) === String(currentDraft.roomTypeId))
            ? currentDraft.roomTypeId
            : availableRoomTypes[0]?.id || "",
      };
    });
  }, [editingPricingId, managerHotels, managerRoomTypes, selectedHotelId]);

  const resetHotelEditor = () => {
    setEditingHotelId(null);
    setHotelDraft(createHotelDraft());
  };

  const startHotelEdit = (hotel) => {
    setEditingHotelId(hotel.id);
    setHotelDraft({
      countryId: hotel.countryId || "",
      name: hotel.name,
      cityAddress: hotel.cityAddress || hotel.city || "",
      starRating: hotel.starRating,
      timeZone: hotel.timeZone || "UTC",
      description: hotel.description || "",
    });
  };

  const submitHotel = async (event) => {
    event.preventDefault();

    const normalized = {
      country_id: Number(hotelDraft.countryId) || 0,
      hotel_name: hotelDraft.name.trim(),
      city_address: hotelDraft.cityAddress.trim(),
      star_rating: Number(hotelDraft.starRating) || 0,
      timezone: hotelDraft.timeZone.trim() || "UTC",
      description: hotelDraft.description.trim() || null,
    };

    if (
      !normalized.country_id ||
      !normalized.hotel_name ||
      !normalized.city_address ||
      !normalized.star_rating
    ) {
      setHotelsError("Vui lòng chọn quốc gia, nhập tên khách sạn, địa chỉ và star rating.");
      return;
    }

    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setHotelsError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsHotelSubmitting(true);

    try {
      await (editingHotelId
        ? await updateAdminHotelApi(editingHotelId, normalized, accessToken)
        : await createAdminHotelApi(normalized, accessToken));

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
    if (!accessToken) {
      setHotelsError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

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
    const defaultHotelId = selectedHotelId || managerHotels[0]?.id || "";
    setEditingRoomTypeId(null);
    setRoomTypeDraft({
      ...createRoomTypeDraft(),
      hotelId: defaultHotelId,
    });
  };

  const startRoomTypeEdit = (roomType) => {
    setEditingRoomTypeId(roomType.id);
    setRoomTypeDraft({
      hotelId: roomType.hotelId,
      name: roomType.name,
      basePrice: roomType.basePrice,
      servicesText: roomType.servicesText || "",
      amenities: [...(roomType.amenityIds || [])],
      facilities: [...(roomType.facilityIds || [])],
    });
  };

  const submitRoomType = async (event) => {
    event.preventDefault();

    const normalized = {
      hotelId: roomTypeDraft.hotelId,
      name: roomTypeDraft.name.trim(),
      basePrice: Number(roomTypeDraft.basePrice) || 0,
      servicesText: roomTypeDraft.servicesText.trim(),
      amenityIds: roomTypeDraft.amenities.map((amenityId) => Number(amenityId)),
      facilities: roomTypeDraft.facilities,
    };

    if (!normalized.hotelId || !normalized.name) {
      setRoomTypesError("Vui lòng chọn khách sạn và nhập tên loại phòng.");
      return;
    }

    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setRoomTypesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsRoomTypeSubmitting(true);

    try {
      const payload = {
        hotel_id: Number(normalized.hotelId),
        room_type_name: normalized.name,
        room_type_base_price: normalized.basePrice,
        room_type_services: normalized.servicesText || null,
        facility_ids: normalized.facilities.map((facilityId) => Number(facilityId)),
        amenity_ids: normalized.amenityIds,
      };

      if (editingRoomTypeId) {
        await updateAdminRoomTypeApi(editingRoomTypeId, payload, accessToken);
      } else {
        await createAdminRoomTypeApi(payload, accessToken);
      }

      setSelectedHotelId(String(normalized.hotelId));
      await refreshRoomTypes();
      await refreshAmenities();
      resetRoomTypeEditor();
    } catch (error) {
      setRoomTypesError(getErrorMessage(error, "Không lưu được loại phòng."));
    } finally {
      setIsRoomTypeSubmitting(false);
    }
  };

  const deleteRoomType = async (roomTypeId) => {
    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setRoomTypesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsRoomTypeSubmitting(true);

    try {
      await deleteAdminRoomTypeApi(roomTypeId, accessToken);
      await refreshRoomTypes();
      await refreshAmenities();

      if (editingRoomTypeId === roomTypeId) {
        resetRoomTypeEditor();
      }
    } catch (error) {
      setRoomTypesError(getErrorMessage(error, "Không xóa được loại phòng."));
    } finally {
      setIsRoomTypeSubmitting(false);
    }
  };

  const toggleDraftCollectionValue = (field, value) => {
    setRoomTypeDraft((currentDraft) => {
      const hasValue = currentDraft[field].includes(value);
      return {
        ...currentDraft,
        [field]: hasValue
          ? currentDraft[field].filter((item) => item !== value)
          : [...currentDraft[field], value],
      };
    });
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
      hotelId: managerHotels[0]?.id || "",
    });
  };

  const startFacilityEdit = (facility) => {
    setEditingFacilityId(facility.id);
    setFacilityDraft({
      hotelId: facility.hotelId,
      name: facility.name,
      price: facility.price,
      pricingType: facility.pricingType,
    });
  };

  const submitFacility = async (event) => {
    event.preventDefault();

    const normalized = {
      hotelId: facilityDraft.hotelId,
      name: facilityDraft.name.trim(),
      price: Number(facilityDraft.price) || 0,
      pricingType: String(facilityDraft.pricingType || "per_use").trim(),
    };

    if (!normalized.hotelId || !normalized.name) {
      setFacilitiesError("Vui lòng chọn khách sạn và nhập tên dịch vụ.");
      return;
    }

    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setFacilitiesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsFacilitySubmitting(true);

    try {
      const payload = {
        hotel_id: normalized.hotelId,
        service_name: normalized.name,
        service_price: normalized.price,
        pricing_type: normalized.pricingType,
      };

      if (editingFacilityId) {
        await updateAdminFacilityApi(editingFacilityId, payload, accessToken);
      } else {
        await createAdminFacilityApi(payload, accessToken);
      }

      await refreshFacilities();
      resetFacilityEditor();
    } catch (error) {
      setFacilitiesError(getErrorMessage(error, "Không lưu được dịch vụ."));
    } finally {
      setIsFacilitySubmitting(false);
    }
  };

  const deleteFacility = async (facilityId) => {
    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setFacilitiesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsFacilitySubmitting(true);

    try {
      await deleteAdminFacilityApi(facilityId, accessToken);
      await refreshFacilities();
      await refreshRoomTypes();

      setRoomTypes((currentRoomTypes) =>
        currentRoomTypes.map((roomType) => ({
          ...roomType,
          facilities: roomType.facilities.filter((facility) => facility !== facilityId),
        })),
      );

      if (editingFacilityId === facilityId) {
        resetFacilityEditor();
      }
    } catch (error) {
      setFacilitiesError(getErrorMessage(error, "Không xóa được dịch vụ."));
    } finally {
      setIsFacilitySubmitting(false);
    }
  };

  const resetAmenityEditor = () => {
    setEditingAmenityId(null);
    setAmenityDraft({
      ...createAmenityDraft(),
      hotelId: selectedHotelId || managerHotels[0]?.id || "",
    });
  };

  const startAmenityEdit = (amenity) => {
    setEditingAmenityId(amenity.id);
    setAmenityDraft({
      hotelId: amenity.hotelId,
      name: amenity.name,
      description: amenity.description || "",
    });
  };

  const submitAmenity = async (event) => {
    event.preventDefault();

    const normalized = {
      hotelId: amenityDraft.hotelId,
      name: amenityDraft.name.trim(),
      description: amenityDraft.description.trim(),
    };

    if (!normalized.hotelId || !normalized.name) {
      setAmenitiesError("Vui lòng chọn khách sạn và nhập tên tiện nghi.");
      return;
    }

    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setAmenitiesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsAmenitySubmitting(true);

    try {
      const payload = {
        hotel_id: Number(normalized.hotelId),
        amenity_name: normalized.name,
        amenity_description: normalized.description || null,
      };

      if (editingAmenityId) {
        await updateAdminAmenityApi(editingAmenityId, payload, accessToken);
      } else {
        await createAdminAmenityApi(payload, accessToken);
      }

      setSelectedHotelId(String(normalized.hotelId));
      await refreshRoomTypes();
      await refreshAmenities();
      resetAmenityEditor();
    } catch (error) {
      setAmenitiesError(getErrorMessage(error, "Không lưu được tiện nghi."));
    } finally {
      setIsAmenitySubmitting(false);
    }
  };

  const deleteAmenity = async (amenityId) => {
    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setAmenitiesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsAmenitySubmitting(true);

    try {
      await deleteAdminAmenityApi(amenityId, accessToken);
      await refreshAmenities();
      await refreshRoomTypes();

      if (editingAmenityId === amenityId) {
        resetAmenityEditor();
      }
    } catch (error) {
      setAmenitiesError(getErrorMessage(error, "Không xóa được tiện nghi."));
    } finally {
      setIsAmenitySubmitting(false);
    }
  };

  const resetPricingEditor = () => {
    setEditingPricingId(null);
    setEditingPricingType(null);
    setPricingDraft({
      ...createPricingDraft(),
      hotelId: selectedHotelId || managerHotels[0]?.id || "",
      roomTypeId:
        filteredManagerRoomTypes[0]?.id ||
        managerRoomTypes.find((roomType) => String(roomType.hotelId) === String(selectedHotelId))?.id ||
        managerRoomTypes[0]?.id ||
        "",
    });
  };

  const startPricingEdit = (pricing) => {
    setEditingPricingId(pricing.id);
    setEditingPricingType(pricing.type);

    if (pricing.type === "date_range") {
      setPricingDraft({
        type: "date_range",
        hotelId: pricing.hotelId,
        roomTypeId: "",
        startDate: pricing.startDate,
        endDate: pricing.endDate,
        specificDate: "",
        multiplier: pricing.multiplier,
        specificRate: 2500000,
        specificNote: "",
      });
      return;
    }

    setPricingDraft({
      type: "single_day",
      hotelId: pricing.hotelId,
      roomTypeId: pricing.roomTypeId,
      startDate: "",
      endDate: "",
      specificDate: pricing.specificDate,
      multiplier: 1.1,
      specificRate: pricing.specificRate,
      specificNote: pricing.specificNote || "",
    });
  };

  const submitPricing = async (event) => {
    event.preventDefault();

    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setPricingError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsPricingSubmitting(true);

    try {
      if (pricingDraft.type === "date_range") {
        const payload = {
          hotel_id: Number(pricingDraft.hotelId),
          start_date: pricingDraft.startDate,
          end_date: pricingDraft.endDate,
          multiplier: Number(pricingDraft.multiplier),
        };

        if (!payload.hotel_id || !payload.start_date || !payload.end_date || !payload.multiplier) {
          setPricingError("Vui lòng chọn khách sạn, ngày bắt đầu, ngày kết thúc và multiplier.");
          return;
        }

        if (editingPricingId && editingPricingType === "date_range") {
          await updateAdminSeasonalPricingApi(editingPricingId, payload, accessToken);
        } else {
          await createAdminSeasonalPricingApi(payload, accessToken);
        }
      } else {
        const payload = {
          room_type_id: Number(pricingDraft.roomTypeId),
          specific_date: pricingDraft.specificDate,
          specific_rate: Number(pricingDraft.specificRate),
          specific_note: pricingDraft.specificNote.trim() || null,
        };

        if (!payload.room_type_id || !payload.specific_date || !payload.specific_rate) {
          setPricingError("Vui lòng chọn room type, ngày áp dụng và giá cố định.");
          return;
        }

        if (editingPricingId && editingPricingType === "single_day") {
          await updateAdminSpecificDatePricingApi(editingPricingId, payload, accessToken);
        } else {
          await createAdminSpecificDatePricingApi(payload, accessToken);
        }
      }

      await refreshPricing();
      resetPricingEditor();
    } catch (error) {
      setPricingError(getErrorMessage(error, "Không lưu được pricing."));
    } finally {
      setIsPricingSubmitting(false);
    }
  };

  const deletePricing = async (pricingId, pricingType) => {
    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setPricingError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsPricingSubmitting(true);

    try {
      if (pricingType === "date_range") {
        await deleteAdminSeasonalPricingApi(pricingId, accessToken);
      } else {
        await deleteAdminSpecificDatePricingApi(pricingId, accessToken);
      }

      await refreshPricing();

      if (editingPricingId === pricingId && editingPricingType === pricingType) {
        resetPricingEditor();
      }
    } catch (error) {
      setPricingError(getErrorMessage(error, "Không xóa được pricing."));
    } finally {
      setIsPricingSubmitting(false);
    }
  };

  return {
    hotelOptions: activeHotelOptions,
    countryOptions,
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
    selectedHotel,
    highestHolidayUplift,
    getHolidayPercentForRoomType,
    getPricingPreviewForRoomType,
    pricePreviewDraft,
    setPricePreviewDraft,
    countryDraft,
    setCountryDraft,
    editingCountryId,
    startCountryEdit,
    submitCountry,
    deleteCountry,
    resetCountryEditor,
    isCountriesLoading,
    isCountrySubmitting,
    countriesError,
    searchIndexStatus,
    searchIndexDraft,
    setSearchIndexDraft,
    searchIndexResults,
    rebuildSearchIndex,
    testSearchIndexQuery,
    isSearchIndexLoading,
    isSearchIndexSubmitting,
    searchIndexError,
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
    toggleDraftCollectionValue,
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
    startPricingEdit,
    submitPricing,
    deletePricing,
    resetPricingEditor,
    isPricingLoading,
    isPricingSubmitting,
    pricingError,
  };
};

export default useAdminWorkspace;
