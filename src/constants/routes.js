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
  BOOKING_HISTORY: "/lich-su-dat-phong",
  ADMIN: "/admin/van-hanh",
  RECEPTIONIST_LOGIN: "/receptionist/login",
  RECEPTIONIST_DASHBOARD: "/receptionist/dashboard",
};

/** Helper tạo path chi tiết khách sạn */
export const getHotelDetailPath = (hotelId) => `/khach-san/${hotelId}`;
