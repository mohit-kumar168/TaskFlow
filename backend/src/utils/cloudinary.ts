import { createHash } from "node:crypto";
import cloudinary from "@/config/cloudinary";

interface UploadOptions {
  folder: string;
  publicId?: string;
  resourceType?: "image" | "raw" | "video" | "auto";
}

interface UploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes: number;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format?: string;
  bytes: number;
  error?: { message?: string };
}

export const uploadToCloudinary = async (
  buffer: Buffer,
  options: UploadOptions,
): Promise<UploadResult> => {
  const config = cloudinary.config();
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureParams: Record<string, string | number> = {
    folder: options.folder,
    timestamp,
  };

  if (options.publicId) {
    signatureParams.public_id = options.publicId;
  }

  const signatureString = Object.keys(signatureParams)
    .sort()
    .map((key) => `${key}=${signatureParams[key]}`)
    .join("&");
  const signature = createHash("sha1")
    .update(`${signatureString}${config.api_secret}`)
    .digest("hex");

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([new Uint8Array(buffer)]),
    options.publicId ?? "upload",
  );
  formData.append("api_key", config.api_key!);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", options.folder);

  if (options.publicId) {
    formData.append("public_id", options.publicId);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloud_name}/${options.resourceType ?? "auto"}/upload`,
    { method: "POST", body: formData },
  );
  const result = await response.json() as CloudinaryUploadResponse;

  if (!response.ok) {
    throw new Error(result?.error?.message ?? "Cloudinary upload failed");
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    format: result.format,
    bytes: result.bytes,
  };
};

export const deleteFromCloudinary = (
  publicId: string,
  resourceType:
    | "image"
    | "raw"
    | "video"
    | "auto" = "image",
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );
  });
};

export const getUserFolder = (userId: string) => `taskflow/users/user_${userId}`;

export const getOrganizationFolder = (organizationSlug: string) => `taskflow/organizations/organization_${organizationSlug}`;

export const getWorkspaceFolder = (workspaceSlug: string) => `taskflow/workspaces/workspace_${workspaceSlug}`;

export const getProjectFolder = (projectSlug: string) => `taskflow/projects/project_${projectSlug}`;
