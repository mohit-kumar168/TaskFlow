import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ProfileSettings from "@/modules/dashboard/components/ProfileSettings";
import PasswordSettings from "@/modules/dashboard/components/PasswordSettings";

const UserSetting = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const section = location.pathname.endsWith("/security")
    ? "security"
    : "profile";

  const activeSection = section;

  useEffect(() => {
    if (location.pathname === "/settings") {
      navigate("/settings/profile", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="mx-auto w-full py-8 max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeSection === "profile"
              ? "Profile"
              : "Security"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {activeSection === "profile"
              ? "Manage your personal information."
              : "Manage your password and account security."}
          </p>
        </div>

        <div className="p-2">
          {activeSection === "profile" && (
            <ProfileSettings />
          )}

          {activeSection === "security" && (
            <PasswordSettings />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSetting;
