export const generateSlug = (value: string) => {
	const baseSlug = value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

	const randomSuffix = Math.random()
		.toString()
		.substring(2, 8);

	return `${baseSlug}-${randomSuffix}`;
}
