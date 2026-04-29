import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import BookingConfirm from "./pages/BookingConfirm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/account/Login";
import SignUp from "./pages/account/SignUp";
import AdminDashboard from "./pages/admin";
import { ROUTES } from "./constants";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.HOTELS} element={<Hotels />} />
          <Route path={ROUTES.HOTEL_DETAIL} element={<HotelDetail />} />
          <Route path={ROUTES.BOOKING} element={<Booking />} />
          <Route path={ROUTES.BOOKING_CONFIRM} element={<BookingConfirm />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
