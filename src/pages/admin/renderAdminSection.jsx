import {
  AmenitiesSection,
  FacilitiesSection,
  HolidayRulesSection,
  PriceControlSection,
  RoomTypesSection,
} from "./sections";

export const renderAdminSection = (activeSection, workspace) => {
  switch (activeSection) {
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
          hotelOptions={workspace.hotelOptions}
          amenities={workspace.amenities}
          facilities={workspace.facilities}
          roomTypeDraft={workspace.roomTypeDraft}
          setRoomTypeDraft={workspace.setRoomTypeDraft}
          submitRoomType={workspace.submitRoomType}
          editingRoomTypeId={workspace.editingRoomTypeId}
          resetRoomTypeEditor={workspace.resetRoomTypeEditor}
          toggleDraftCollectionValue={workspace.toggleDraftCollectionValue}
          filteredRoomTypes={workspace.filteredRoomTypes}
          startRoomTypeEdit={workspace.startRoomTypeEdit}
          deleteRoomType={workspace.deleteRoomType}
        />
      );
    case "facilities":
      return (
        <FacilitiesSection
          facilityDraft={workspace.facilityDraft}
          setFacilityDraft={workspace.setFacilityDraft}
          submitFacility={workspace.submitFacility}
          editingFacilityId={workspace.editingFacilityId}
          resetFacilityEditor={workspace.resetFacilityEditor}
          facilities={workspace.facilities}
          startFacilityEdit={workspace.startFacilityEdit}
          deleteFacility={workspace.deleteFacility}
        />
      );
    case "amenities":
      return (
        <AmenitiesSection
          amenityDraft={workspace.amenityDraft}
          setAmenityDraft={workspace.setAmenityDraft}
          submitAmenity={workspace.submitAmenity}
          editingAmenityId={workspace.editingAmenityId}
          resetAmenityEditor={workspace.resetAmenityEditor}
          amenities={workspace.amenities}
          startAmenityEdit={workspace.startAmenityEdit}
          deleteAmenity={workspace.deleteAmenity}
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
