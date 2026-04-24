import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";

const navItems = [
  { path: ROUTES.HOME, label: "Trang chủ" },
  { path: ROUTES.HOTELS, label: "Khách sạn" },
  { path: ROUTES.ABOUT, label: "Giới thiệu" },
  { path: ROUTES.CONTACT, label: "Liên hệ" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-primary text-textWhite shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link
            to={ROUTES.HOME}
            className="text-lg font-semibold tracking-wide hover:text-secondary transition-colors"
          >
            Pullman Hotels
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`py-2 px-1 border-b-2 transition-colors ${
                    isActive(path)
                      ? "border-secondary text-secondary"
                      : "border-transparent hover:text-secondary"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.LOGIN}
                className={`px-3 py-1.5 rounded-lg text-sm border border-white/40 hover:bg-white/10 transition-colors ${
                  isActive(ROUTES.LOGIN) ? "bg-white/10" : ""
                }`}
              >
                Đăng nhập
              </Link>
              <Link
                to={ROUTES.SIGN_UP}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary text-primary hover:bg-secondary/90 transition-colors ${
                  isActive(ROUTES.SIGN_UP) ? "ring-2 ring-secondary/60" : ""
                }`}
              >
                Đăng ký
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              ) : (
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20">
            <ul className="flex flex-col gap-2">
              {navItems.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 px-2 rounded ${
                      isActive(path) ? "bg-secondary/20 text-secondary" : "hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setMenuOpen(false)}
                  className={`flex-1 py-2 px-2 text-center rounded border border-white/40 text-sm ${
                    isActive(ROUTES.LOGIN) ? "bg-white/10" : "hover:bg-white/10"
                  }`}
                >
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTES.SIGN_UP}
                  onClick={() => setMenuOpen(false)}
                  className={`flex-1 py-2 px-2 text-center rounded bg-secondary text-primary text-sm font-medium ${
                    isActive(ROUTES.SIGN_UP) ? "ring-2 ring-secondary/60" : "hover:bg-secondary/90"
                  }`}
                >
                  Đăng ký
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
