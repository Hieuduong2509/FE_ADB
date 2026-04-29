import { useState } from "react";
import {
  buildAmenities,
  buildFacilities,
  buildRoomTypes,
  buildSeasonalRules,
  createAmenityDraft,
  createFacilityDraft,
  createRoomTypeDraft,
  createRuleDraft,
  hotelOptions,
  slugify,
} from "./adminData";

export const useAdminWorkspace = () => {
  const [roomTypes, setRoomTypes] = useState(buildRoomTypes);
  const [facilities, setFacilities] = useState(buildFacilities);
  const [amenities, setAmenities] = useState(buildAmenities);
  const [seasonalRules, setSeasonalRules] = useState(buildSeasonalRules);

  const [selectedHotelId, setSelectedHotelId] = useState(hotelOptions[0]?.id || "");

  const [roomTypeDraft, setRoomTypeDraft] = useState(createRoomTypeDraft);
  const [editingRoomTypeId, setEditingRoomTypeId] = useState(null);

  const [facilityDraft, setFacilityDraft] = useState(createFacilityDraft);
  const [editingFacilityId, setEditingFacilityId] = useState(null);

  const [amenityDraft, setAmenityDraft] = useState(createAmenityDraft);
  const [editingAmenityId, setEditingAmenityId] = useState(null);

  const [ruleDraft, setRuleDraft] = useState(createRuleDraft);
  const [editingRuleId, setEditingRuleId] = useState(null);

  const filteredRoomTypes = roomTypes.filter(
    (roomType) => !selectedHotelId || roomType.hotelId === selectedHotelId,
  );

  const selectedHotel =
    hotelOptions.find((hotel) => hotel.id === selectedHotelId) || hotelOptions[0] || null;

  const highestHolidayUplift = seasonalRules.reduce(
    (maxValue, rule) => Math.max(maxValue, Number(rule.percent) || 0),
    0,
  );

  const getHolidayPercentForRoomType = (roomType) =>
    seasonalRules.reduce((bestMatch, rule) => {
      const sameHotel = rule.hotelId === roomType.hotelId;
      const sameCategory = rule.appliesTo === "all" || rule.appliesTo === roomType.category;

      if (!sameHotel || !sameCategory) {
        return bestMatch;
      }

      return Math.max(bestMatch, Number(rule.percent) || 0);
    }, 0);

  const resetRoomTypeEditor = () => {
    setEditingRoomTypeId(null);
    setRoomTypeDraft(createRoomTypeDraft());
  };

  const startRoomTypeEdit = (roomType) => {
    setEditingRoomTypeId(roomType.id);
    setRoomTypeDraft({
      hotelId: roomType.hotelId,
      category: roomType.category,
      name: roomType.name,
      intro: roomType.intro,
      basePrice: roomType.basePrice,
      capacity: roomType.capacity,
      size: roomType.size,
      bed: roomType.bed,
      view: roomType.view,
      amenities: [...roomType.amenities],
      facilities: [...roomType.facilities],
    });
  };

  const submitRoomType = (event) => {
    event.preventDefault();

    const hotelMeta = hotelOptions.find((hotel) => hotel.id === roomTypeDraft.hotelId);
    const normalized = {
      hotelId: roomTypeDraft.hotelId,
      hotelName: hotelMeta?.name || "",
      city: hotelMeta?.city || "",
      category: roomTypeDraft.category.trim(),
      name: roomTypeDraft.name.trim(),
      intro: roomTypeDraft.intro.trim(),
      basePrice: Number(roomTypeDraft.basePrice) || 0,
      capacity: Number(roomTypeDraft.capacity) || 1,
      size: roomTypeDraft.size.trim(),
      bed: roomTypeDraft.bed.trim(),
      view: roomTypeDraft.view.trim(),
      amenities: roomTypeDraft.amenities,
      facilities: roomTypeDraft.facilities,
    };

    if (!normalized.hotelId || !normalized.category || !normalized.name) {
      return;
    }

    if (editingRoomTypeId) {
      setRoomTypes((currentRoomTypes) =>
        currentRoomTypes.map((roomType) =>
          roomType.id === editingRoomTypeId ? { ...roomType, ...normalized } : roomType,
        ),
      );
    } else {
      setRoomTypes((currentRoomTypes) => [
        {
          id: `${normalized.hotelId}-${slugify(normalized.name)}-${currentRoomTypes.length + 1}`,
          ...normalized,
        },
        ...currentRoomTypes,
      ]);
    }

    resetRoomTypeEditor();
  };

  const deleteRoomType = (roomTypeId) => {
    setRoomTypes((currentRoomTypes) =>
      currentRoomTypes.filter((roomType) => roomType.id !== roomTypeId),
    );

    if (editingRoomTypeId === roomTypeId) {
      resetRoomTypeEditor();
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
    setRoomTypes((currentRoomTypes) =>
      currentRoomTypes.map((roomType) =>
        roomType.id === roomTypeId
          ? { ...roomType, basePrice: Number(nextValue) || 0 }
          : roomType,
      ),
    );
  };

  const resetFacilityEditor = () => {
    setEditingFacilityId(null);
    setFacilityDraft(createFacilityDraft());
  };

  const startFacilityEdit = (facility) => {
    setEditingFacilityId(facility.id);
    setFacilityDraft({
      name: facility.name,
      price: facility.price,
      tag: facility.tag,
      description: facility.description,
    });
  };

  const submitFacility = (event) => {
    event.preventDefault();

    const normalized = {
      name: facilityDraft.name.trim(),
      price: Number(facilityDraft.price) || 0,
      tag: facilityDraft.tag.trim(),
      description: facilityDraft.description.trim(),
    };

    if (!normalized.name) {
      return;
    }

    if (editingFacilityId) {
      setFacilities((currentFacilities) =>
        currentFacilities.map((facility) =>
          facility.id === editingFacilityId ? { ...facility, ...normalized } : facility,
        ),
      );
    } else {
      setFacilities((currentFacilities) => [
        {
          id: `${slugify(normalized.name)}-${currentFacilities.length + 1}`,
          ...normalized,
        },
        ...currentFacilities,
      ]);
    }

    resetFacilityEditor();
  };

  const deleteFacility = (facilityId) => {
    setFacilities((currentFacilities) =>
      currentFacilities.filter((facility) => facility.id !== facilityId),
    );

    setRoomTypes((currentRoomTypes) =>
      currentRoomTypes.map((roomType) => ({
        ...roomType,
        facilities: roomType.facilities.filter((facility) => facility !== facilityId),
      })),
    );

    if (editingFacilityId === facilityId) {
      resetFacilityEditor();
    }
  };

  const resetAmenityEditor = () => {
    setEditingAmenityId(null);
    setAmenityDraft(createAmenityDraft());
  };

  const startAmenityEdit = (amenity) => {
    setEditingAmenityId(amenity.id);
    setAmenityDraft({
      name: amenity.name,
      description: amenity.description,
    });
  };

  const submitAmenity = (event) => {
    event.preventDefault();

    const normalized = {
      name: amenityDraft.name.trim(),
      description: amenityDraft.description.trim() || "Amenity hiển thị trên room card.",
    };

    if (!normalized.name) {
      return;
    }

    if (editingAmenityId) {
      const previousAmenity = amenities.find((amenity) => amenity.id === editingAmenityId);

      setAmenities((currentAmenities) =>
        currentAmenities.map((amenity) =>
          amenity.id === editingAmenityId ? { ...amenity, ...normalized } : amenity,
        ),
      );

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
    } else {
      setAmenities((currentAmenities) => [
        {
          id: `${slugify(normalized.name)}-${currentAmenities.length + 1}`,
          ...normalized,
        },
        ...currentAmenities,
      ]);
    }

    resetAmenityEditor();
  };

  const deleteAmenity = (amenityId) => {
    const amenityToDelete = amenities.find((amenity) => amenity.id === amenityId);
    setAmenities((currentAmenities) => currentAmenities.filter((amenity) => amenity.id !== amenityId));

    if (amenityToDelete) {
      setRoomTypes((currentRoomTypes) =>
        currentRoomTypes.map((roomType) => ({
          ...roomType,
          amenities: roomType.amenities.filter((amenityName) => amenityName !== amenityToDelete.name),
        })),
      );
    }

    if (editingAmenityId === amenityId) {
      resetAmenityEditor();
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
    hotelOptions,
    roomTypes,
    facilities,
    amenities,
    seasonalRules,
    selectedHotelId,
    setSelectedHotelId,
    filteredRoomTypes,
    selectedHotel,
    highestHolidayUplift,
    getHolidayPercentForRoomType,
    roomTypeDraft,
    setRoomTypeDraft,
    editingRoomTypeId,
    startRoomTypeEdit,
    submitRoomType,
    deleteRoomType,
    toggleDraftCollectionValue,
    updateRoomTypePrice,
    resetRoomTypeEditor,
    facilityDraft,
    setFacilityDraft,
    editingFacilityId,
    startFacilityEdit,
    submitFacility,
    deleteFacility,
    resetFacilityEditor,
    amenityDraft,
    setAmenityDraft,
    editingAmenityId,
    startAmenityEdit,
    submitAmenity,
    deleteAmenity,
    resetAmenityEditor,
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
