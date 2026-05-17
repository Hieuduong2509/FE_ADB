import { bookingFacilities, pullmanHotels } from "../../data/pullmanData";

export const hotelOptions = pullmanHotels.map((hotel) => ({
  id: hotel.id,
  name: hotel.name,
  city: hotel.city,
}));

export const sectionLinks = [
  { id: "dashboard", label: "Dashboard" },
  { id: "hotels", label: "Hotels" },
  { id: "booking-history", label: "Booking History" },
  { id: "holiday-rules", label: "Pricing Rules" },
  { id: "price-control", label: "Giá phòng" },
  { id: "room-types", label: "Room type" },
  { id: "facilities", label: "Facilities" },
  { id: "amenities", label: "Amenities" },
  { id: "receptionists", label: "Receptionists" },
];

export const slugify = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildRoomTypes = () =>
  pullmanHotels.flatMap((hotel) =>
    hotel.rooms.map((room) => ({
      id: `${hotel.id}-${slugify(room.id)}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      city: hotel.city,
      category: room.category,
      name: room.name,
      intro: room.intro,
      basePrice: room.price,
      capacity: room.capacity,
      size: room.size,
      bed: room.bed,
      view: room.view,
      amenities: [...room.amenities],
      facilities: bookingFacilities
        .filter((facility) =>
          room.category === "Suite"
            ? true
            : room.category === "Executive"
              ? facility.tag !== "Business"
              : facility.tag === "Dining" || facility.tag === "Flex stay",
        )
        .slice(0, room.category === "Suite" ? 4 : 2)
        .map((facility) => facility.id),
    })),
  );

export const createRoomTypeDraft = () => ({
  hotelId: "",
  code: "",
  name: "",
  basePrice: 2500000,
  description: "",
  roomSize: 42,
  maxAdults: 2,
  maxChildren: 0,
  bedType: "King",
  totalInventory: 10,
  amenities: [],
  facilities: [],
});

export const createFacilityDraft = () => ({
  hotelId: "",
  code: "",
  name: "",
  price: 250000,
  pricingType: "per_use",
  facilityType: "service",
  description: "",
});

export const createHotelDraft = () => ({
  code: "",
  name: "",
  brand: "Pullman",
  country: "Vietnam",
  city: "",
  district: "",
  address: "",
  starRating: 5,
  timeZone: "Asia/Ho_Chi_Minh",
  totalRooms: 100,
  status: "active",
});

export const createAmenityDraft = () => ({
  code: "",
  name: "",
  icon: "",
  description: "",
});

export const createPricingDraft = () => ({
  type: "single_day",
  hotelId: "",
  roomTypeId: "",
  specificDate: "",
  specificPercent: 10,
  specificDirection: "increase",
  specificNote: "",
  startDate: "",
  endDate: "",
  multiplier: 1,
  priority: 100,
  active: true,
});

