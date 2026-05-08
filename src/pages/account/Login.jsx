import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession, loginAdminApi, loginClientApi, persistAuthSession } from "../../utils/auth";
import { ROUTES } from "../../constants";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field) => (event) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      let authData = null;

      try {
        authData = await loginAdminApi(formData);
      } catch (adminError) {
        const shouldFallbackToClient =
          adminError?.status === 401 ||
          adminError?.code === "ROLE_NOT_ADMIN" ||
          adminError?.code === "INVALID_CREDENTIALS";

        if (!shouldFallbackToClient) {
          throw adminError;
        }

        authData = await loginClientApi(formData);
      }

      clearAuthSession();
      persistAuthSession(authData);
      navigate(authData?.user?.role === "admin" ? ROUTES.ADMIN : ROUTES.HOME);
    } catch (error) {
      setErrorMessage(error.message || "Đăng nhập thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-textPrimary mb-2 text-center">
          Đăng nhập Pullman Member
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Đăng nhập để quản lý booking Pullman và lưu thông tin lưu trú của bạn.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleFieldChange("email")}
              placeholder="guest@pullman-demo.com"
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
              value={formData.password}
              onChange={handleFieldChange("password")}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-[#e7c5bf] bg-[#fff2ee] px-3 py-2 text-sm text-[#aa4f3d]">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent/40"
              />
              <span className="text-gray-600">Nhớ đăng nhập</span>
            </label>
            <button type="button" className="text-accent hover:underline">
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-white font-medium py-2.5 rounded-lg transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Chưa có tài khoản?{" "}
          <Link to={ROUTES.SIGN_UP} className="text-accent font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
