import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";

const SignUp = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-textPrimary mb-2 text-center">
          Đăng ký thành viên
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Tạo tài khoản để quản lý đặt phòng dễ dàng và nhận ưu đãi dành riêng cho thành viên.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="fullName">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nhapemail@vidu.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="phone">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="09xx xxx xxx"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          <div className="text-xs text-gray-500">
            Bằng việc đăng ký, bạn đồng ý với các điều khoản sử dụng hệ thống đặt phòng.
          </div>

          <button
            type="button"
            className="w-full bg-primary text-textWhite font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Tạo tài khoản
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Đã có tài khoản?{" "}
          <Link to={ROUTES.LOGIN} className="text-accent font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

