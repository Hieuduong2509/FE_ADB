import { bookingFacilities, pullmanHotels } from "../../data/pullmanData";

export const hotelOptions = pullmanHotels.map((hotel) => ({
  id: hotel.id,
  name: hotel.name,
  city: hotel.city,
}));

export const sectionLinks = [
  { id: "countries", label: "Countries" },
  { id: "search-index", label: "Search Index" },
  { id: "hotels", label: "Hotels" },
  { id: "price-control", label: "Giá phòng" },
  { id: "holiday-rules", label: "Pricing" },
  { id: "room-types", label: "Loại phòng" },
  { id: "facilities", label: "Facilities" },
  { id: "amenities", label: "Amenities" },
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

export const buildFacilities = () =>
  bookingFacilities.map((facility) => ({
    id: facility.id,
    name: facility.title,
    price: facility.price,
    tag: facility.tag,
    description: facility.description,
  }));

export const buildAmenities = () =>
  [
    ...new Set(
      pullmanHotels.flatMap((hotel) => hotel.rooms.flatMap((room) => room.amenities)),
    ),
  ].map((name) => ({
    id: slugify(name),
    name,
    description: "Amenity hiển thị trên trang chi tiết phòng và bộ lọc tìm kiếm.",
  }));

export const buildSeasonalRules = () => [
  {
    id: "rule-holiday-304",
    name: "30/4 - 1/5",
    hotelId: pullmanHotels[0].id,
    appliesTo: "all",
    percent: 18,
    startDate: "2026-04-30",
    endDate: "2026-05-01",
    note: "Đẩy ADR cho nhóm nghỉ dưỡng ven biển.",
  },
  {
    id: "rule-national-day",
    name: "Quốc khánh 2/9",
    hotelId: pullmanHotels[1].id,
    appliesTo: "Executive",
    percent: 14,
    startDate: "2026-09-01",
    endDate: "2026-09-03",
    note: "Giữ giá premium cho khách công tác và staycation ngắn.",
  },
  {
    id: "rule-new-year",
    name: "Tết Dương lịch",
    hotelId: pullmanHotels[2].id,
    appliesTo: "Family",
    percent: 22,
    startDate: "2026-12-31",
    endDate: "2027-01-02",
    note: "Tăng mạnh cho nhu cầu gia đình đi Hà Nội dịp lễ.",
  },
];

export const createRoomTypeDraft = () => ({
  hotelId: "",
  name: "",
  basePrice: 2500000,
  servicesText: "",
  amenities: [],
  facilities: [],
});

export const createFacilityDraft = () => ({
  hotelId: "",
  name: "",
  price: 250000,
  pricingType: "per_use",
});

export const createHotelDraft = () => ({
  countryId: "",
  name: "",
  cityAddress: "",
  starRating: 5,
  timeZone: "Asia/Ho_Chi_Minh",
  description: "",
});

export const createCountryDraft = () => ({
  code: "",
  name: "",
});

export const createAmenityDraft = () => ({
  hotelId: "",
  name: "",
  description: "",
});

export const createRuleDraft = () => ({
  name: "",
  hotelId: hotelOptions[0]?.id || "",
  appliesTo: "all",
  percent: 10,
  startDate: "2026-12-24",
  endDate: "2026-12-26",
  note: "",
});

export const createPricingDraft = () => ({
  type: "single_day",
  hotelId: hotelOptions[0]?.id || "",
  roomTypeId: "",
  startDate: "",
  endDate: "",
  specificDate: "",
  multiplier: 1.1,
  specificRate: 2500000,
  specificNote: "",
});

export const createSearchIndexDraft = () => ({
  horizonDays: 180,
  search: "",
  checkIn: "2026-06-01",
  checkOut: "2026-06-02",
  guests: "2 người",
  roomType: "Tất cả",
  amenity: "Tất cả",
  service: "Tất cả",
  minPrice: "",
  maxPrice: "",
  stars: "",
  sortBy: "price_asc",
});
