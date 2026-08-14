import { useState } from "react";
import { Bell, ChevronRight, Lock, Settings, User } from "lucide-react";

import ProfileSettings from "../../../modules/dashboard/components/ProfileSettings";
import PasswordSettings from "@/modules/dashboard/components/PasswordSettings";

type SettingSection = "profile" | "security" | "notifications" | "preferences";

const UserSetting = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>("profile");

  const settings = [
    {
      id: "profile" as const,
      title: "Profile",
    },
    {
      id: "security" as const,
      title: "Security",
    },
  ];

  const activeSetting = settings.find(
    (setting) => setting.id === activeSection,
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your TaskFlow account.
        </p>
      </div>

      <div className="flex min-h-150 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <aside className="w-72 shrink-0 border-r border-gray-200">
          <div className="p-3">
            {settings.map((setting) => {
              const isActive = activeSection === setting.id;

              return (
                <button
                  key={setting.id}
                  type="button"
                  onClick={() => setActiveSection(setting.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-orange-600" : "text-gray-800"
                      }`}
                    >
                      {setting.title}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className={isActive ? "text-orange-500" : "text-gray-300"}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex-1">
          <div className="p-8">
            {activeSection === "profile" && <ProfileSettings />}

            {activeSection === "security" && <PasswordSettings />}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserSetting;
