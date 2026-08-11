import { protect } from "@/middleware/auth.middleware";
import validateRequest from "@/middleware/validateRequest.middleware";
import { Router } from "express";
import { createOrganizationInviteSchema, createOrganizationSchema, updateOrganizationMemberRoleSchema, updateOrganizationSchema } from "./organization.validator";
import { acceptInvite, archiveOrganization, createOrganization, fetchAllOrganizationMembers, fetchAllOrganizations, fetchOrganization, fetchOrganizationMember, inviteMember, removeOrganizationMember, updateOrganization, updateOrganizationMemberRole } from "./organization.controller";

const router = Router({mergeParams: true});

router.use(protect);

router.post(
	"/",
	validateRequest(createOrganizationSchema),
	createOrganization,
);

router.get(
	"/",
	fetchAllOrganizations,
);

router.get(
	"/:slug",
	fetchOrganization,
);

router.patch(
	"/:slug",
	validateRequest(updateOrganizationSchema),
	updateOrganization,
);

router.delete(
	"/:slug",
	archiveOrganization,
);


router.post(
	"/:slug/invites",
	validateRequest(createOrganizationInviteSchema),
	inviteMember,
);

router.post(
	"/invites/:token/accept",
	acceptInvite,
);

router.get(
	"/:slug/members",
	fetchAllOrganizationMembers,
);

router.get(
	"/:slug/members/:memberId",
	fetchOrganizationMember,
);

router.patch(
	"/:slug/members/:memberId",
	validateRequest(updateOrganizationMemberRoleSchema),
	updateOrganizationMemberRole,
);

router.delete(
	"/:slug/members/:memberId",
	removeOrganizationMember,
);

export default router;
