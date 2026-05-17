import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-textWhite mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-secondary mb-3">Pullman Hotels</h3>
            <p className="text-sm text-white/90 leading-7">
              Giao diện mới tập trung vào danh sách khách sạn Pullman đang hot, tìm kiếm phòng,
              xem amenities chi tiết và chọn facilities trước khi booking.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-secondary mb-3">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.HOME} className="hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HOTELS} className="hover:text-secondary transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link to={ROUTES.BOOKING} className="hover:text-secondary transition-colors">
                  Booking
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-secondary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-secondary mb-3">Contact</h3>
            <p className="text-sm text-white/90 leading-7">
              Hotline: 1900 Pullman
              <br />
              Email: reservations@pullman-demo.com
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/80">
          © {currentYear} Pullman Hotels. Search stays, view room amenities, add booking facilities.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

