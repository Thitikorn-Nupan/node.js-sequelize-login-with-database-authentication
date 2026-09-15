import User from "../models/user.js";
import Book from "../models/book.js";
import {modulesApp} from "./modules.app.js"
import path from "path";
import {fileURLToPath} from 'url';
import {createLogger} from "../log/log.appv2.js";

const __filename = fileURLToPath(import.meta.url);
const filename = path.basename(__filename);
const logger = createLogger(filename);
const bcrypt = modulesApp.bcrypt

class CrudApp {

    constructor() {
        logger.info('CrudApp\'s constructor is worked')
    }

    login = async (username, password) => {
        return await User.findAll({where: {username: username}}).then(async (found) => {
                if (found.length !== 0) { // if user has existed
                    const hashedPassword = found[0].password
                    const check = await bcrypt.compare(password, hashedPassword)
                    logger.info('\nhashed password : ' + hashedPassword + '\npassword : ' + password)
                    logger.info('check : ' + check)
                    if (check) {
                        logger.info('password user has matched')
                        return 'password user is matched'
                    } else {
                        logger.warn('password user hasn\'t matched')
                        return 'password user hasn\'t matched'
                    }
                } else if (found.length === 0) { // if user has not existed
                    logger.debug('user hasn\'t exited')
                    return 'user hasn\'t exited'
                }
            }
        )
    } // ended login()

    createUser = async (username, passwordPainText) => {
        const password = await bcrypt.hash(passwordPainText, 10)
        logger.info('this is password ' + passwordPainText + ' then I hashed it ' + password)
        return await User.create({username, password}).then((user) => {
            return user
        }).catch((e) => {
            logger.debug('somethings was wrong : ' + e.message)
            return false
        })
    }

    loginThenGetsBooks = async (username, password) => {
        return await User.findAll({where: {username: username}}).then(async (found) => {
                    if (found.length !== 0) { // if user has existed
                        const hashedPassword = found[0].password
                        const check = await bcrypt.compare(password, hashedPassword)
                        if (check) {
                            /*
                                Next If login is successfully
                                then get the data on bookstore database
                            */
                            logger.info('password user has matched')
                            return await Book.findAll()
                        } else {
                            logger.warn('password user hasn\'t matched')
                            return 'password user hasn\'t matched'
                        }
                    } else if (found.length === 0) { // if user has not existed
                        logger.debug('user hasn\'t exited')
                        return 'user hasn\'t exited'
                    }
                }
            )
    }
}

export default CrudApp