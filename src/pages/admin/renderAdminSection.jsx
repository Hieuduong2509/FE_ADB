import {
  AmenitiesSection,
  CountriesSection,
  FacilitiesSection,
  HolidayRulesSection,
  HotelsSection,
  PriceControlSection,
  RoomTypesSection,
  SearchIndexSection,
} from "./sections";

export const renderAdminSection = (activeSection, workspace) => {
  switch (activeSection) {
    case "countries":
      return (
        <CountriesSection
          countryDraft={workspace.countryDraft}
          setCountryDraft={workspace.setCountryDraft}
          submitCountry={workspace.submitCountry}
          editingCountryId={workspace.editingCountryId}
          resetCountryEditor={workspace.resetCountryEditor}
          countries={workspace.countryOptions}
          startCountryEdit={workspace.startCountryEdit}
          deleteCountry={workspace.deleteCountry}
          isLoading={workspace.isCountriesLoading}
          isSubmitting={workspace.isCountrySubmitting}
          errorMessage={workspace.countriesError}
        />
      );
    case "search-index":
      return (
        <SearchIndexSection
          searchIndexStatus={workspace.searchIndexStatus}
          searchIndexDraft={workspace.searchIndexDraft}
          setSearchIndexDraft={workspace.setSearchIndexDraft}
          rebuildSearchIndex={workspace.rebuildSearchIndex}
          testSearchIndexQuery={workspace.testSearchIndexQuery}
          searchIndexResults={workspace.searchIndexResults}
          isSearchIndexLoading={workspace.isSearchIndexLoading}
          isSearchIndexSubmitting={workspace.isSearchIndexSubmitting}
          searchIndexError={workspace.searchIndexError}
        />
      );
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
          hotelOptions={workspace.hotelOptions}
          roomTypes={workspace.managerRoomTypes}
          isLoading={workspace.isPricingLoading}
          isSubmitting={workspace.isPricingSubmitting}
          errorMessage={workspace.pricingError}
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
          hotelOptions={workspace.managerHotels}
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
