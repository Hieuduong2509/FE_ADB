import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import {
  clearAuthSession,
  loginReceptionistApi,
  persistAuthSession,
} from "../../utils/auth";

const ReceptionistLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const authData = await loginReceptionistApi(formData);
      clearAuthSession();
      persistAuthSession(authData);
      navigate(ROUTES.RECEPTIONIST_DASHBOARD);
    } catch (error) {
      setErrorMessage(error.message || "Receptionist sign-in failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ea] px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
        <div className="text-xs uppercase tracking-[0.2em] text-accent">Receptionist Portal</div>
        <h1 className="mt-2 text-2xl font-semibold text-textPrimary">Receptionist sign in</h1>
        <p className="mt-2 text-sm text-gray-600">Manage check-in/check-out for assigned hotels.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-gray-700">Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              className="w-full rounded-xl border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-sm outline-none focus:border-[#17363f]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-gray-700">Password</span>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              className="w-full rounded-xl border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-sm outline-none focus:border-[#17363f]"
            />
          </label>

          {errorMessage ? (
            <div className="rounded-lg border border-[#e7c5bf] bg-[#fff2ee] px-3 py-2 text-sm text-[#aa4f3d]">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#17363f] py-2.5 text-sm font-semibold text-white hover:bg-[#102d34] disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReceptionistLogin;


