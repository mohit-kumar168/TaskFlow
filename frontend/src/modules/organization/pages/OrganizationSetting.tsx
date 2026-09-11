import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import OrganizationGeneralSettings from "../components/OrganizationGeneratlSettings";
import OrganizationMembers from "../components/OrganizationMembers";

import { useOrganizationStore } from "@/store/organization.store";

const OrganizationSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { organizationSlug } = useParams<{
    organizationSlug: string;
  }>();

  const {
    currentOrganization,
    fetchOrganization,
  } = useOrganizationStore();

  const activeSection = location.pathname.endsWith("/members")
    ? "members"
    : "general";

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

  useEffect(() => {
    if (location.pathname === `/organizations/${organizationSlug}/settings` && organizationSlug) {
      navigate(
        `/organizations/${organizationSlug}/settings/general`,
        { replace: true },
      );
    }
  }, [location.pathname, organizationSlug, navigate]);

  if (!organizationSlug) {
    return null;
  }

  return (
    <div className="mx-auto w-full py-8 max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeSection === "general"
              ? "General"
              : "Members"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {activeSection === "general"
              ? "Manage your organization's basic information."
              : "Manage your organization members."}
          </p>
        </div>

        <div className="p-8">
          {activeSection === "general" && (
            <OrganizationGeneralSettings />
          )}

          {activeSection === "members" && (
            <OrganizationMembers />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetting;
