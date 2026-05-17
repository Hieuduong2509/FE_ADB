import {
  AmenitiesSection,
  BookingHistorySection,
  DashboardSection,
  FacilitiesSection,
  HolidayRulesSection,
  HotelsSection,
  PriceControlSection,
  ReceptionistsSection,
  RoomTypesSection,
} from "./sections";

export const renderAdminSection = (activeSection, workspace) => {
  switch (activeSection) {
    case "dashboard":
      return (
        <DashboardSection
          stats={workspace.dashboardStats}
          selectedHotel={workspace.selectedHotel}
          bookingHistory={workspace.bookingHistory}
          managerHotels={workspace.managerHotels}
        />
      );
    case "hotels":
      return (
        <HotelsSection
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
    case "booking-history":
      return (
        <BookingHistorySection
          bookings={workspace.filteredBookingHistory}
          isLoading={workspace.isBookingHistoryLoading}
          errorMessage={workspace.bookingHistoryError}
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
          amenityDraft={workspace.amenityDraft}
          setAmenityDraft={workspace.setAmenityDraft}
          submitAmenity={workspace.submitAmenity}
          editingAmenityId={workspace.editingAmenityId}
          resetAmenityEditor={workspace.resetAmenityEditor}
          amenities={workspace.filteredAmenities}
          startAmenityEdit={workspace.startAmenityEdit}
          deleteAmenity={workspace.deleteAmenity}
          isLoading={workspace.isAmenitiesLoading}
          isSubmitting={workspace.isAmenitySubmitting}
          errorMessage={workspace.amenitiesError}
        />
      );
    case "receptionists":
      return (
        <ReceptionistsSection
          users={workspace.adminUsers}
          hotelOptions={workspace.managerHotels}
          assigningUserId={workspace.assigningUserId}
          assignHotelMap={workspace.assignHotelMap}
          onAssignHotelChange={workspace.handleAssignHotelChange}
          onSetReceptionistRole={workspace.handleSetReceptionistRole}
          onAssignHotel={workspace.handleAssignReceptionistHotel}
          onRemoveReceptionist={workspace.handleRemoveReceptionistRole}
          isSubmitting={workspace.isReceptionistSubmitting}
          isLoading={workspace.isAdminUsersLoading}
          errorMessage={workspace.receptionistError}
        />
      );
    case "holiday-rules":
      return (
        <HolidayRulesSection
          pricingDraft={workspace.pricingDraft}
          setPricingDraft={workspace.setPricingDraft}
          submitPricing={workspace.submitPricing}
          editingPricingId={workspace.editingPricingId}
          editingPricingType={workspace.editingPricingType}
          resetPricingEditor={workspace.resetPricingEditor}
          seasonalRules={workspace.filteredSeasonalRules}
          specificDatePricing={workspace.filteredSpecificDatePricing}
          startPricingEdit={workspace.startPricingEdit}
          deletePricing={workspace.deletePricing}
          hotelOptions={workspace.managerHotels}
          roomTypes={workspace.filteredManagerRoomTypes}
          isLoading={workspace.isPricingRulesLoading}
          isSubmitting={workspace.isPricingRuleSubmitting}
          errorMessage={workspace.pricingRulesError}
        />
      );
    case "price-control":
    default:
      return (
        <PriceControlSection
          filteredRoomTypes={workspace.filteredRoomTypes}
          getHolidayPercentForRoomType={workspace.getHolidayPercentForRoomType}
          getPricingPreviewForRoomType={workspace.getPricingPreviewForRoomType}
          pricePreviewDraft={workspace.pricePreviewDraft}
          setPricePreviewDraft={workspace.setPricePreviewDraft}
          updateRoomTypePrice={workspace.updateRoomTypePrice}
          startRoomTypeEdit={workspace.startRoomTypeEdit}
        />
      );
  }
};
