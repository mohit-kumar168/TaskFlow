import { useEffect, useState } from "react";
import {
  ChevronRight,
} from "lucide-react";
import { useParams } from "react-router-dom";

import OrganizationGeneralSettings from "../components/OrganizationGeneratlSettings";

import { useOrganizationStore } from "@/store/organization.store";
import OrganizationMembers from "../components/OrganizationMembers";

type SettingSection = "general" | "members";

const OrganizationSetting = () => {
  const { organizationSlug } = useParams<{
    organizationSlug: string;
  }>();

  const {
    currentOrganization,
    fetchOrganization,
  } = useOrganizationStore();

  const [activeSection, setActiveSection] =
    useState<SettingSection>("general");

  useEffect(() => {
    if (!organizationSlug) {
      return;
    }

    if (
      !currentOrganization ||
      currentOrganization.slug !== organizationSlug
    ) {
      fetchOrganization(organizationSlug);
    }
  }, [
    organizationSlug,
    currentOrganization,
    fetchOrganization,
  ]);

  const settings = [
    {
      id: "general" as const,
      title: "General",
    },
    {
      id: "members" as const,
      title: "Members",
    },
  ];

  const activeSetting = settings.find(
    (setting) => setting.id === activeSection,
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Organization Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your organization and its members.
        </p>
      </div>

      <div className="flex min-h-150 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 border-r border-gray-200">
          <div className="p-3">
            {settings.map((setting) => {

              const isActive =
                activeSection === setting.id;

              return (
                <button
                  key={setting.id}
                  type="button"
                  onClick={() =>
                    setActiveSection(setting.id)
                  }
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-orange-600"
                          : "text-gray-800"
                      }`}
                    >
                      {setting.title}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className={
                      isActive
                        ? "text-orange-500"
                        : "text-gray-300"
                    }
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex-1">
          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeSetting?.title}
            </h2>
          </div>

          <div className="p-8">
            {activeSection === "general" && (
              <OrganizationGeneralSettings />
            )}

            {activeSection === "members" && (
              <OrganizationMembers />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrganizationSetting;