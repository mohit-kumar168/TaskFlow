import crypto from "node:crypto";

export const generateInviteToken = () => {
	return crypto.randomBytes(32).toString("hex");
};
