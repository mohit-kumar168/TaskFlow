import { useNavigate } from "react-router-dom";

import { useOrganizationStore } from "@/store/organization.store";

type SettingsMenuProps = {
  onClose: () => void;
};

const SettingsMenu = ({ onClose }: SettingsMenuProps) => {
  const navigate = useNavigate();

  const { currentOrganization } = useOrganizationStore();

  const goTo = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">
          Settings
        </p>
      </div>

      {/* Personal settings */}
      <div className="hover:bg-gray-100 p-2">
        <button
          type="button"
          onClick={() => goTo("/settings")}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors"
        >

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800">
              General settings
            </p>
          </div>
        </button>
      </div>

      {/* Organization settings */}
      {currentOrganization && (
        <div className="hover:bg-gray-100 p-2">
          <button
            type="button"
            onClick={() =>
              goTo(
                `/organizations/${currentOrganization?.slug}/settings`,
              )
            }
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors"
          >

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800">
                Organization Settings
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;