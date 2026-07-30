import env from "./config/env.ts";
import app from "./app";
import logger from "./config/logger.ts";

const PORT = env.PORT;

app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`);
});
