import CrudApp from "../services/crud.app.js";
import {modulesApp} from "../services/modules.app.js";
import path from "path";
import {fileURLToPath} from 'url';
import {createLogger} from "../log/log.appv2.js";

const __filename = fileURLToPath(import.meta.url);
const filename = path.basename(__filename);
const logger = createLogger(filename);

const crudApp = new CrudApp()
const bodyParser = modulesApp.bodyParser
const routerUser = modulesApp.router
const routerBook = modulesApp.router

// setting middle ware
routerUser.use(bodyParser.json())
routerUser.use(bodyParser.urlencoded({extended:true}))
routerBook.use(bodyParser.json())
routerBook.use(bodyParser.urlencoded({extended:true}))


routerUser.post('/login' , async (req,res) => {
    try {
        const {username , password} = req.body
        await crudApp.login(username,password).then((result) => {
            if (result.localeCompare('password user is matched') === 0) {
                return res.status(202).json({
                    status: "accepted",
                    data: result
                })
            }
            else if (result.localeCompare('password user hasn\'t matched') === 0) {
                return res.status(401).json({
                    status: "unauthorized",
                    data: result
                })
            }
            else if (result.localeCompare('user hasn\'t exited') === 0) {
                return res.status(403).json({
                    status: "forbidden",
                    data: result
                })
            }
        }).catch( (e) => {
            logger.warn(`cause from login(username,password) method async : ${e.message}`)
            throw e
        })

    } catch (e) {
        res.status(405).json({
            status:'method not allowed',
            message : `cause from /login async method (post) : ${e.message}`
        })
        throw e
    }
})

routerUser.post('/create' , async (req,res) => {
    try {
        const {username , password} = req.body
        await crudApp.createUser(username,password).then((result) => {
            if (result === false) {
                return res.status(406).json({
                    status: "not acceptable",
                    data: result
                })
            }
            else {
                return res.status(201).json({
                    status: "created",
                    data: result
                })
            }

        }).catch( (e) => {
            logger.warn(`cause from createUser(username,password) method async : ${e.message}`)
            throw e
        })
    } catch (e) {
        res.status(405).json({
            status:'method not allowed',
            message : `cause from /create async method (post) : ${e.message}`
        })
        throw e

    }

})

routerBook.get('/reads' , async (req,res) => {
    try {
        const {username , password} = req.body
        await crudApp.loginThenGetsBooks(username,password).then((result) => {
            if (typeof result === "string") { // check the result type
                logger.info('result is type string')
                if (result.localeCompare('password user hasn\'t matched') === 0) {
                    return res.status(401).json({
                        status: "unauthorized",
                        data: result
                    })
                }
                else if (result.localeCompare('user hasn\'t exited') === 0) {
                    return res.status(403).json({
                        status: "forbidden",
                        data: result
                    })
                }
            } else {
                logger.info('result is not type string')
                return res.status(200).json({
                    status: "ok",
                    data: result
                })
            }
        }).catch( (e) => {
            logger.warn(`cause from loginThenReadsBooks(username,password) method async : ${e.message}`)
            throw e
        })
    } catch (e) {
        res.status(405).json({
            status:'method not allowed',
            message : `cause from /books async method (get) : ${e.message}`
        })
        throw e

    }
})

export const routers = {
    routerUser : routerUser ,
    routerBook : routerBook
}


