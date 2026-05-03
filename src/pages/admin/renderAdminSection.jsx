import {
  AmenitiesSection,
  FacilitiesSection,
  HolidayRulesSection,
  HotelsSection,
  PriceControlSection,
  RoomTypesSection,
} from "./sections";

export const renderAdminSection = (activeSection, workspace) => {
  switch (activeSection) {
    case "hotels":
      return (
        <HotelsSection
          countryOptions={workspace.countryOptions}
          hotelDraft={workspace.hotelDraft}
          setHotelDraft={workspace.setHotelDraft}
          submitHotel={workspace.submitHotel}
          editingHotelId={workspace.editingHotelId}
          resetHotelEditor={workspace.resetHotelEditor}
          hotels={workspace.managerHotels}
          startHotelEdit={workspace.startHotelEdit}
          deleteHotel={workspace.deleteHotel}
          isLoading={workspace.isHotelsLoading}
          isSubmitting={workspace.isHotelSubmitting}
          errorMessage={workspace.hotelsError}
        />
      );
    case "holiday-rules":
      return (
        <HolidayRulesSection
          ruleDraft={workspace.ruleDraft}
          setRuleDraft={workspace.setRuleDraft}
          submitRule={workspace.submitRule}
          editingRuleId={workspace.editingRuleId}
          resetRuleEditor={workspace.resetRuleEditor}
          seasonalRules={workspace.seasonalRules}
          startRuleEdit={workspace.startRuleEdit}
          deleteRule={workspace.deleteRule}
          hotelOptions={workspace.hotelOptions}
          roomTypes={workspace.roomTypes}
        />
      );
    case "room-types":
      return (
        <RoomTypesSection
          hotelOptions={workspace.managerHotels}
          amenities={workspace.amenities}
          facilities={workspace.facilities}
          roomTypeDraft={workspace.roomTypeDraft}
          setRoomTypeDraft={workspace.setRoomTypeDraft}
          submitRoomType={workspace.submitRoomType}
          editingRoomTypeId={workspace.editingRoomTypeId}
          resetRoomTypeEditor={workspace.resetRoomTypeEditor}
          toggleDraftCollectionValue={workspace.toggleDraftCollectionValue}
          filteredRoomTypes={workspace.filteredManagerRoomTypes}
          startRoomTypeEdit={workspace.startRoomTypeEdit}
          deleteRoomType={workspace.deleteRoomType}
          isLoading={workspace.isRoomTypesLoading}
          isSubmitting={workspace.isRoomTypeSubmitting}
          errorMessage={workspace.roomTypesError}
        />
      );
    case "facilities":
      return (
        <FacilitiesSection
          hotelOptions={workspace.managerHotels}
          facilityDraft={workspace.facilityDraft}
          setFacilityDraft={workspace.setFacilityDraft}
          submitFacility={workspace.submitFacility}
          editingFacilityId={workspace.editingFacilityId}
          resetFacilityEditor={workspace.resetFacilityEditor}
          facilities={workspace.facilities}
          startFacilityEdit={workspace.startFacilityEdit}
          deleteFacility={workspace.deleteFacility}
          isLoading={workspace.isFacilitiesLoading}
          isSubmitting={workspace.isFacilitySubmitting}
          errorMessage={workspace.facilitiesError}
        />
      );
    case "amenities":
      return (
        <AmenitiesSection
          roomTypeOptions={workspace.managerRoomTypes}
          amenityDraft={workspace.amenityDraft}
          setAmenityDraft={workspace.setAmenityDraft}
          submitAmenity={workspace.submitAmenity}
          editingAmenityId={workspace.editingAmenityId}
          resetAmenityEditor={workspace.resetAmenityEditor}
          amenities={workspace.amenities}
          startAmenityEdit={workspace.startAmenityEdit}
          deleteAmenity={workspace.deleteAmenity}
          isLoading={workspace.isAmenitiesLoading}
          isSubmitting={workspace.isAmenitySubmitting}
          errorMessage={workspace.amenitiesError}
        />
      );
    case "price-control":
    default:
      return (
        <PriceControlSection
          filteredRoomTypes={workspace.filteredRoomTypes}
          getHolidayPercentForRoomType={workspace.getHolidayPercentForRoomType}
          updateRoomTypePrice={workspace.updateRoomTypePrice}
          startRoomTypeEdit={workspace.startRoomTypeEdit}
        />
      );
  }
};
