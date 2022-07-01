import app from "./app"
import {PORT} from "./util/conf"
import log from "./util/logger"

app.listen(PORT, () => {
	log.info(`Server running on port ${PORT}!`)
})
