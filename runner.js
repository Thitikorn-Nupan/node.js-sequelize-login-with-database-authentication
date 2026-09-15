import {modulesApp} from "./services/modules.app.js";
import {routers} from "./router/router.app.js";
import path from "path";
import {fileURLToPath} from 'url';
import {createLogger} from "./log/log.appv2.js";

const __filename = fileURLToPath(import.meta.url);
const filename = path.basename(__filename);
const logger = createLogger(filename);

const app = modulesApp.app
app.use('/api/authen',routers.routerUser)
app.use('/api/books',routers.routerBook)

app.listen(3000,(errors) => {
    if (errors) throw errors
    else logger.info('you are on port 3000')
})

