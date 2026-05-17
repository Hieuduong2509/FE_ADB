import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession, persistAuthSession, registerClientApi } from "../../utils/auth";
import { ROUTES } from "../../constants";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password xác nhận không khớp.");
      return;
    }

    setIsSubmitting(true);

    try {
      const authData = await registerClientApi({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      clearAuthSession();
      persistAuthSession(authData);
      navigate(ROUTES.HOME);
    } catch (error) {
      setErrorMessage(error.message || "Sign up thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-textPrimary mb-2 text-center">
          Sign up Pullman Member
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Tạo tài khoản để thử đăng nhập, quản lý booking và lưu thông tin khách lưu trú Pullman.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleFieldChange("fullName")}
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
              value={formData.email}
              onChange={handleFieldChange("email")}
              placeholder="guest@pullman-demo.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleFieldChange("phone")}
              placeholder="09xx xxx xxx"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleFieldChange("password")}
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
              value={formData.confirmPassword}
              onChange={handleFieldChange("confirmPassword")}
              placeholder="Nhập lại mật khẩu"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-[#e7c5bf] bg-[#fff2ee] px-3 py-2 text-sm text-[#aa4f3d]">
              {errorMessage}
            </div>
          ) : null}

          <div className="text-xs text-gray-500">
            Bằng việc đăng ký, bạn đồng ý với các điều khoản sử dụng hệ thống booking Pullman.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-textWhite font-medium py-2.5 rounded-lg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Đã có tài khoản?{" "}
          <Link to={ROUTES.LOGIN} className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

