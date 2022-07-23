import app from "./app.js";
import {PORT} from "./util/conf.js";
import log from "./util/logger.js";

app.listen(PORT, () => {
	log.info(`Server running on port ${PORT}!`)
})
