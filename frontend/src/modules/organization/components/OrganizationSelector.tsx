import { useState } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";

import { useOrganizationStore } from "@/store/organization.store";
import { useNavigate } from "react-router-dom";

const OrganizationSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { organizations, currentOrganization, setCurrentOrganization } =
    useOrganizationStore();

  const handleOrganizationChange = (
    organization: (typeof organizations)[number],
  ) => {
    setCurrentOrganization(organization);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-sm font-semibold text-white">
          {currentOrganization?.name?.charAt(0).toUpperCase() ?? "O"}
        </div>

        <span className="max-w-32 truncate">
          {currentOrganization?.name ?? "Select organization"}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          <button
            type="button"
            onClick={() => navigate("/workspaces/create")}
            className="flex items-center gap-2 rounded-lg py-2 pl-10 pr-4 text-sm text-orange-500 transition hover:bg-orange-50"
          >
            <Plus size={15} />
            <span>Create Workspace</span>
          </button>

          {organizations.map((organization) => (
            <button
              key={organization.id}
              type="button"
              onClick={() => handleOrganizationChange(organization)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
            >
              <span className="truncate">{organization.name}</span>

              {currentOrganization?.id === organization.id && (
                <Check size={16} className="text-orange-500" />
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
