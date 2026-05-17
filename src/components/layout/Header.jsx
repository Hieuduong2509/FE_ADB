import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { clearAuthSession, isAdminSession, readAuthSession } from "../../utils/auth";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(() => readAuthSession());
  const location = useLocation();
  const isAdmin = isAdminSession(session);
  const navItems = [
    { path: ROUTES.HOME, label: "Home" },
    { path: ROUTES.HOTELS, label: "Search" },
    { path: ROUTES.BOOKING, label: "Booking" },
    ...(session?.user && !isAdmin ? [{ path: ROUTES.BOOKING_HISTORY, label: "Lịch sử" }] : []),
    ...(isAdmin ? [{ path: ROUTES.ADMIN, label: "Admin" }] : []),
    { path: ROUTES.CONTACT, label: "Contact" },
  ];

  useEffect(() => {
    setSession(readAuthSession());
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === ROUTES.HOTELS) {
      return location.pathname.startsWith("/khach-san");
    }

    if (path === ROUTES.ADMIN) {
      return location.pathname.startsWith("/admin");
    }

    if (path === ROUTES.BOOKING_HISTORY) {
      return location.pathname.startsWith(ROUTES.BOOKING_HISTORY);
    }

    return location.pathname === path;
  };

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
    setMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-[rgba(248,244,237,0.88)] text-textPrimary shadow-[0_10px_30px_rgba(31,33,33,0.07)] backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-[74px]">
          <Link
            to={ROUTES.HOME}
            className="text-lg font-semibold tracking-[0.22em] text-[#17363f] transition-colors hover:text-accent"
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
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-600 hover:text-[#17363f]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {session?.user ? (
                <>
                  <div className="rounded-full border border-[#d8ccb8] bg-white px-4 py-2 text-sm text-textPrimary">
                    Hello, {session.user.fullName || session.user.email}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full bg-[#17363f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#102d34]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className={`rounded-full border border-[#d8ccb8] px-4 py-2 text-sm transition-colors ${
                      isActive(ROUTES.LOGIN) ? "bg-[#faf5ec]" : "hover:bg-white"
                    }`}
                  >
                    Sign in
                  </Link>
                  <Link
                    to={ROUTES.SIGN_UP}
                    className={`rounded-full bg-[#17363f] px-4 py-2 text-sm font-medium text-white transition-colors ${
                      isActive(ROUTES.SIGN_UP) ? "ring-2 ring-[#17363f]/30" : "hover:bg-[#102d34]"
                    }`}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            className="rounded-full p-2 transition hover:bg-white md:hidden"
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
          <nav className="border-t border-[#e7dcc8] py-4 md:hidden">
            <ul className="flex flex-col gap-2">
              {navItems.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 px-2 rounded ${
                      isActive(path) ? "bg-[#faf5ec] text-accent" : "hover:bg-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {session?.user ? (
                <>
                  <li className="mt-2 rounded-xl border border-[#e7dcc8] bg-white px-3 py-3 text-sm text-textPrimary">
                    Hello, {session.user.fullName || session.user.email}
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-full bg-[#17363f] py-2 px-2 text-center text-sm font-medium text-white hover:bg-[#102d34]"
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <li className="mt-2 flex gap-2">
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMenuOpen(false)}
                    className={`flex-1 rounded-full border border-[#d8ccb8] py-2 px-2 text-center text-sm ${
                      isActive(ROUTES.LOGIN) ? "bg-[#faf5ec]" : "hover:bg-white"
                    }`}
                  >
                    Sign in
                  </Link>
                  <Link
                    to={ROUTES.SIGN_UP}
                    onClick={() => setMenuOpen(false)}
                    className={`flex-1 rounded-full bg-[#17363f] py-2 px-2 text-center text-sm font-medium text-white ${
                      isActive(ROUTES.SIGN_UP) ? "ring-2 ring-[#17363f]/30" : "hover:bg-[#102d34]"
                    }`}
                  >
                    Sign up
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

