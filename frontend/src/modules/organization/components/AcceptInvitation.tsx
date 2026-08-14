import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/components/ui/Button";

import { acceptOrganizationInvite } from "@/api/organization.api";

const AcceptInvitation = () => {
  const { token } = useParams<{
    token: string;
  }>();

  const navigate = useNavigate();

  const [isAccepting, setIsAccepting] =
    useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAccept = async () => {
    if (!token) {
      setMessage({
        type: "error",
        text: "Invalid invitation link.",
      });
      return;
    }

    try {
      setIsAccepting(true);
      setMessage(null);

      await acceptOrganizationInvite(token);

      setMessage({
        type: "success",
        text: "Invitation accepted successfully.",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      console.error(
        "Failed to accept invitation:",
        error,
      );

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ??
          "Failed to accept invitation.",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">
          Organization Invitation
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          You have been invited to join an organization
          on TaskFlow.
        </p>

        {message && (
          <p
            className={`mt-5 text-sm ${
              message.type === "success"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-auto"
          >
            {isAccepting
              ? "Accepting..."
              : "Accept Invitation"}
          </Button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;