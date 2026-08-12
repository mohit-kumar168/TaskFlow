import { useState } from "react";
import { ChevronDown, Check, Plus, Building2 } from "lucide-react";
import { useOrganizationStore } from "@/store/organization.store";
import { type OrganizationProps } from "@/api/organization.api";
import { useNavigate } from "react-router-dom";

const OrganizationSelector = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const { organizations, currentOrganization, setCurrentOrganization } =
    useOrganizationStore();

  const handleOrganizationChange = (organization: OrganizationProps) => {
    setCurrentOrganization(organization);
	navigate(`/organizations/${organization.slug}/workspaces`);
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-w-0 max-w-44 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:max-w-56 sm:px-3"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-500 text-sm font-semibold text-white">
          {currentOrganization?.name?.charAt(0).toUpperCase() ?? "O"}
        </div>

        <span className="hidden max-w-32 truncate sm:block">
          {currentOrganization?.name ?? "Select organization"}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 max-w-72 rounded-lg border border-gray-200 bg-white p-1 shadow-lg sm:w-64">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate("/organizations/create");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-orange-500 transition hover:bg-orange-50"
          >
            <Plus size={15} />
            <span>Create Organization</span>
          </button>

          <div className="my-1 border-t border-gray-100" />

          {organizations.map((organization) => (
            <button
              key={organization.id}
              type="button"
              onClick={() => handleOrganizationChange(organization)}
              className="flex w-full min-w-0 items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-600">
                  {organization.name.charAt(0).toUpperCase()}
                </div>

                <span className="truncate">{organization.name}</span>
              </div>

              {currentOrganization?.id === organization.id && (
                <Check size={16} className="shrink-0 text-orange-500" />
              )}
            </button>
          ))}

          {organizations.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No organizations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationSelector;
