import LogApp from "./log/log.app.js";
import {modulesApp} from "./services/modules.app.js";
import {routers} from "./router/router.app.js";

const app = modulesApp.app

app.use('/api/authen',routers.routerUser)
app.use('/api/books',routers.routerBook)

app.listen(3000,(errors) => {
    if (errors) throw errors
    else LogApp.winstonLogging.info('you are on port 3000')
})

