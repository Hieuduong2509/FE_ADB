import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-textWhite mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-secondary mb-3">Đặt phòng khách sạn</h3>
            <p className="text-sm text-white/90">
              Hệ thống đặt phòng khách sạn đa chi nhánh toàn Việt Nam. Đặt phòng nhanh, giá tốt.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-secondary mb-3">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.HOME} className="hover:text-secondary transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HOTELS} className="hover:text-secondary transition-colors">
                  Khách sạn
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-secondary transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="hover:text-secondary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-secondary mb-3">Liên hệ</h3>
            <p className="text-sm text-white/90">
              Hotline: 1900 xxxx
              <br />
              Email: support@example.com
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/80">
          © {currentYear} Đặt phòng khách sạn. Đa chi nhánh toàn Việt Nam.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
