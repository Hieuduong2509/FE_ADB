/**
 * Định nghĩa đường dẫn cho ứng dụng đặt phòng khách sạn đa chi nhánh
 */
export const ROUTES = {
  HOME: "/",
  HOTELS: "/khach-san",
  HOTEL_DETAIL: "/khach-san/:hotelId",
  BOOKING: "/dat-phong",
  BOOKING_CONFIRM: "/dat-phong/xac-nhan",
  ABOUT: "/gioi-thieu",
  CONTACT: "/lien-he",
  LOGIN: "/dang-nhap",
  SIGN_UP: "/dang-ky",
};

/** Helper tạo path chi tiết khách sạn */
export const getHotelDetailPath = (hotelId) => `/khach-san/${hotelId}`;
