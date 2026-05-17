# FE_ADB — Đặt phòng khách sạn đa chi nhánh

Frontend: React (Vite) + Tailwind CSS. Dự kiến kết nối MongoDB/PostgreSQL ở giai đoạn sau.

## Chạy dự án

```bash
npm install
npm run dev
```

## Cấu trúc thư mục

```
src/
├── components/     # Component dùng chung
│   └── layout/     # Header, Footer
├── constants/      # routes, config
├── hooks/          # Custom hooks (sẽ bổ sung)
├── layouts/        # MainLayout (Header + Outlet + Footer)
├── pages/          # Trang: Home, Hotels, HotelDetail, Booking, BookingConfirm, About, Contact
├── utils/          # Helper (sẽ bổ sung)
├── App.jsx
├── main.jsx
└── index.css
```

## Luồng chính

- **Home**: Hero + form tìm kiếm (placeholder)
- **Hotel**: Danh sách chi nhánh (placeholder data)
- **Chi tiết KS**: `/khach-san/:hotelId` — thông tin chi nhánh, nút đặt phòng
- **Đặt phòng** → **Xác nhận**: Luồng đặt phòng (sẽ gắn API sau)
