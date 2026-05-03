import { useCallback, useEffect, useState } from "react";
import {
  buildRoomTypes,
  buildSeasonalRules,
  createAmenityDraft,
  createFacilityDraft,
  createHotelDraft,
  createRoomTypeDraft,
  createRuleDraft,
  hotelOptions,
  slugify,
} from "./adminData";
import {
  createAdminAmenityApi,
  getAdminCountriesApi,
  createAdminFacilityApi,
  createAdminHotelApi,
  createAdminRoomTypeApi,
  deleteAdminAmenityApi,
  deleteAdminFacilityApi,
  deleteAdminHotelApi,
  deleteAdminRoomTypeApi,
  getAdminAmenitiesApi,
  getAdminFacilitiesApi,
  getAdminHotelsApi,
  getAdminRoomTypesApi,
  readAuthSession,
  updateAdminAmenityApi,
  updateAdminFacilityApi,
  updateAdminHotelApi,
  updateAdminRoomTypeApi,
} from "../../utils/auth";

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
  id: country.country_id,
  code: country.country_code || "",
  name: country.country_name || "",
});

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

const formatAmenityRecord = (amenity, roomTypesById) => {
  const roomType = roomTypesById.get(amenity.roomTypeId);

  return {
    id: amenity.id,
    roomTypeId: amenity.roomTypeId,
    roomTypeName: roomType?.name || "Room type chưa xác định",
    hotelId: roomType?.hotelId || "",
    hotelName: roomType?.hotelName || "Khách sạn chưa xác định",
    name: amenity.name,
    description: amenity.description || "",
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
  const [seasonalRules, setSeasonalRules] = useState(buildSeasonalRules);

  const [managerHotels, setManagerHotels] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [managerRoomTypes, setManagerRoomTypes] = useState([]);
  const [hasLoadedManagerCatalogs, setHasLoadedManagerCatalogs] = useState(false);

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

  const [ruleDraft, setRuleDraft] = useState(createRuleDraft);
  const [editingRuleId, setEditingRuleId] = useState(null);

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

  const selectedHotel =
    activeHotelOptions.find((hotel) => String(hotel.id) === String(selectedHotelId)) ||
    activeHotelOptions[0] ||
    null;

  const highestHolidayUplift = seasonalRules.reduce(
    (maxValue, rule) => Math.max(maxValue, Number(rule.percent) || 0),
    0,
  );

  const getHolidayPercentForRoomType = (roomType) =>
    seasonalRules.reduce((bestMatch, rule) => {
      const sameHotel = String(rule.hotelId) === String(roomType.hotelId);
      const sameCategory = rule.appliesTo === "all" || rule.appliesTo === roomType.category;

      if (!sameHotel || !sameCategory) {
        return bestMatch;
      }

      return Math.max(bestMatch, Number(rule.percent) || 0);
    }, 0);

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
    try {
      const countriesResponse = await getAdminCountriesApi();
      const nextCountries = Array.isArray(countriesResponse)
        ? countriesResponse.map((country) => formatCountryOption(country))
        : [];

      setCountryOptions(nextCountries);
      setHotelDraft((currentDraft) => ({
        ...currentDraft,
        countryId:
          currentDraft.countryId &&
          nextCountries.some((country) => String(country.id) === String(currentDraft.countryId))
            ? currentDraft.countryId
            : nextCountries[0]?.id || "",
      }));
    } catch (error) {
      setHotelsError(getErrorMessage(error, "Không tải được danh sách quốc gia."));
      setCountryOptions([]);
    }
  }, []);

  useEffect(() => {
    void refreshHotels();
    void refreshCountries();
  }, [refreshCountries, refreshHotels]);

  const refreshRoomTypes = useCallback(async () => {
    const hotelsById = new Map(managerHotels.map((hotel) => [hotel.id, hotel]));
    setIsRoomTypesLoading(true);

    try {
      const response = await getAdminRoomTypesApi();
      const nextRoomTypes = Array.isArray(response)
        ? response.map((roomType) => formatRoomTypeOption(roomType, hotelsById))
        : [];

      setManagerRoomTypes(nextRoomTypes);
      setRoomTypesError("");
      setAmenityDraft((currentDraft) => ({
        ...currentDraft,
        roomTypeId: currentDraft.roomTypeId || nextRoomTypes[0]?.id || "",
      }));
    } catch (error) {
      setRoomTypesError(getErrorMessage(error, "Không tải được danh sách loại phòng."));
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
    const roomTypesById = new Map(managerRoomTypes.map((roomType) => [roomType.id, roomType]));
    setIsAmenitiesLoading(true);

    try {
      const response = await getAdminAmenitiesApi();
      const nextAmenities = Array.isArray(response)
        ? response.map((amenity) => formatAmenityRecord(amenity, roomTypesById))
        : [];

      setAmenities(nextAmenities);
      setAmenitiesError("");
    } catch (error) {
      setAmenitiesError(getErrorMessage(error, "Không tải được danh sách tiện nghi."));
    } finally {
      setIsAmenitiesLoading(false);
    }
  }, [managerRoomTypes]);

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

    if (!managerRoomTypes.length) {
      setAmenities([]);
      setIsAmenitiesLoading(false);
      return;
    }

    void refreshAmenities();
  }, [hasLoadedManagerCatalogs, managerRoomTypes, refreshAmenities]);

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
      const hotel = editingHotelId
        ? await updateAdminHotelApi(editingHotelId, normalized, accessToken)
        : await createAdminHotelApi(normalized, accessToken);

      await refreshHotels();
      setSelectedHotelId(hotel?.id || "");
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
    setEditingRoomTypeId(null);
    setRoomTypeDraft({
      ...createRoomTypeDraft(),
      hotelId: managerHotels[0]?.id || "",
    });
  };

  const startRoomTypeEdit = (roomType) => {
    setEditingRoomTypeId(roomType.id);
    setRoomTypeDraft({
      hotelId: roomType.hotelId,
      name: roomType.name,
      basePrice: roomType.basePrice,
      servicesText: roomType.servicesText || "",
      amenities: [...(roomType.amenityNames || [])],
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
      amenities: roomTypeDraft.amenities,
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
      const selectedAmenities = normalized.amenities
        .map((amenityName) => amenities.find((amenity) => amenity.name === amenityName))
        .filter(Boolean)
        .map((amenity) => ({
          name: amenity.name,
          description: amenity.description || "",
        }));

      const payload = {
        hotel_id: Number(normalized.hotelId),
        room_type_name: normalized.name,
        room_type_base_price: normalized.basePrice,
        room_type_services: normalized.servicesText || null,
        facility_ids: normalized.facilities.map((facilityId) => Number(facilityId)),
        amenities: selectedAmenities,
      };

      if (editingRoomTypeId) {
        await updateAdminRoomTypeApi(editingRoomTypeId, payload, accessToken);
      } else {
        await createAdminRoomTypeApi(payload, accessToken);
      }

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
    setManagerRoomTypes((currentRoomTypes) =>
      currentRoomTypes.map((roomType) =>
        roomType.id === roomTypeId
          ? { ...roomType, basePrice: Number(nextValue) || 0 }
          : roomType,
      ),
    );
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
      roomTypeId: managerRoomTypes[0]?.id || "",
    });
  };

  const startAmenityEdit = (amenity) => {
    setEditingAmenityId(amenity.id);
    setAmenityDraft({
      roomTypeId: amenity.roomTypeId,
      name: amenity.name,
      description: amenity.description || "",
    });
  };

  const submitAmenity = async (event) => {
    event.preventDefault();

    const normalized = {
      roomTypeId: amenityDraft.roomTypeId,
      name: amenityDraft.name.trim(),
      description: amenityDraft.description.trim(),
    };

    if (!normalized.roomTypeId || !normalized.name) {
      setAmenitiesError("Vui lòng chọn room type và nhập tên tiện nghi.");
      return;
    }

    const accessToken = getAdminAccessToken();
    if (!accessToken) {
      setAmenitiesError("Phiên đăng nhập admin đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    setIsAmenitySubmitting(true);

    try {
      const previousAmenity = amenities.find((amenity) => amenity.id === editingAmenityId);
      const payload = {
        room_type_id: normalized.roomTypeId,
        amenity_name: normalized.name,
        amenity_description: normalized.description || null,
      };

      if (editingAmenityId) {
        await updateAdminAmenityApi(editingAmenityId, payload, accessToken);
      } else {
        await createAdminAmenityApi(payload, accessToken);
      }

      if (previousAmenity && previousAmenity.name !== normalized.name) {
        setRoomTypes((currentRoomTypes) =>
          currentRoomTypes.map((roomType) => ({
            ...roomType,
            amenities: roomType.amenities.map((amenityName) =>
              amenityName === previousAmenity.name ? normalized.name : amenityName,
            ),
          })),
        );
      }

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
      const amenityToDelete = amenities.find((amenity) => amenity.id === amenityId);
      await deleteAdminAmenityApi(amenityId, accessToken);
      await refreshAmenities();
      await refreshRoomTypes();

      if (amenityToDelete) {
        setRoomTypes((currentRoomTypes) =>
          currentRoomTypes.map((roomType) => ({
            ...roomType,
            amenities: roomType.amenities.filter(
              (amenityName) => amenityName !== amenityToDelete.name,
            ),
          })),
        );
      }

      if (editingAmenityId === amenityId) {
        resetAmenityEditor();
      }
    } catch (error) {
      setAmenitiesError(getErrorMessage(error, "Không xóa được tiện nghi."));
    } finally {
      setIsAmenitySubmitting(false);
    }
  };

  const resetRuleEditor = () => {
    setEditingRuleId(null);
    setRuleDraft(createRuleDraft());
  };

  const startRuleEdit = (rule) => {
    setEditingRuleId(rule.id);
    setRuleDraft({
      name: rule.name,
      hotelId: rule.hotelId,
      appliesTo: rule.appliesTo,
      percent: rule.percent,
      startDate: rule.startDate,
      endDate: rule.endDate,
      note: rule.note,
    });
  };

  const submitRule = (event) => {
    event.preventDefault();

    const normalized = {
      name: ruleDraft.name.trim(),
      hotelId: ruleDraft.hotelId,
      appliesTo: ruleDraft.appliesTo,
      percent: Number(ruleDraft.percent) || 0,
      startDate: ruleDraft.startDate,
      endDate: ruleDraft.endDate,
      note: ruleDraft.note.trim(),
    };

    if (!normalized.name || !normalized.hotelId) {
      return;
    }

    if (editingRuleId) {
      setSeasonalRules((currentRules) =>
        currentRules.map((rule) => (rule.id === editingRuleId ? { ...rule, ...normalized } : rule)),
      );
    } else {
      setSeasonalRules((currentRules) => [
        {
          id: `${slugify(normalized.name)}-${currentRules.length + 1}`,
          ...normalized,
        },
        ...currentRules,
      ]);
    }

    resetRuleEditor();
  };

  const deleteRule = (ruleId) => {
    setSeasonalRules((currentRules) => currentRules.filter((rule) => rule.id !== ruleId));

    if (editingRuleId === ruleId) {
      resetRuleEditor();
    }
  };

  return {
    hotelOptions: activeHotelOptions,
    countryOptions,
    roomTypes,
    facilities,
    amenities,
    seasonalRules,
    managerHotels,
    managerRoomTypes,
    selectedHotelId,
    setSelectedHotelId,
    filteredRoomTypes,
    filteredManagerRoomTypes,
    selectedHotel,
    highestHolidayUplift,
    getHolidayPercentForRoomType,
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
    ruleDraft,
    setRuleDraft,
    editingRuleId,
    startRuleEdit,
    submitRule,
    deleteRule,
    resetRuleEditor,
  };
};

export default useAdminWorkspace;
