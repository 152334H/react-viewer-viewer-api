import app from "./app"
import {PORT} from "./util/conf"

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}!`)
})
