import env from "@/config/env";
import cloudinary from "../config/cloudinary";
import apiError from "./apiError";

interface UploadImageOptions {
  folder: string;
  publicId?: string;
}

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
}

export const uploadImageToCloudinary = (buffer: Buffer, options: UploadImageOptions): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,

        folder: options.folder,
        public_id: options.publicId,
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(
            new apiError(500, "Cloudinary upload failed")
          );
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        });
      },
    );
    uploadStream.end(buffer);
  })
};

export const deleteImageFromCloudinary = async (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
      } as any,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
};

export const getUserFolder = (userId: string) => `taskflow/users/user_${userId}`;

export const getOrganizationFolder = (organizationSlug: string) => `taskflow/organizations/organization_${organizationSlug}`;

export const getWorkspaceFolder = (workspaceSlug: string) => `taskflow/workspaces/workspace_${workspaceSlug}`;

export const getProjectFolder = (projectSlug: string) => `taskflow/projects/project_${projectSlug}`;


