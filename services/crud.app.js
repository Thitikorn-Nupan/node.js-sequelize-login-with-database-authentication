import LogApp from "../log/log.app.js";
import User from "../models/user.js";
import Book from "../models/book.js";
import {modulesApp} from "./modules.app.js"

const bcrypt = modulesApp.bcrypt

class CrudApp {

    constructor() {
        LogApp.winstonLogging.info('CrudApp\'s constructor is worked')
    }

    login = async (username, password) => {
        return await User.findAll({where: {username: username}}).then(async (found) => {
                if (found.length !== 0) { // if user has existed
                    const hashedPassword = found[0].password
                    const check = await bcrypt.compare(password, hashedPassword)
                    LogApp.winstonLogging.info('\nhashed password : ' + hashedPassword + '\npassword : ' + password)
                    LogApp.winstonLogging.info('check : ' + check)
                    if (check) {
                        LogApp.winstonLogging.info('password user has matched')
                        return 'password user is matched'
                    } else {
                        LogApp.winstonLogging.warn('password user hasn\'t matched')
                        return 'password user hasn\'t matched'
                    }
                } else if (found.length === 0) { // if user has not existed
                    LogApp.winstonLogging.debug('user hasn\'t exited')
                    return 'user hasn\'t exited'
                }
            }
        )
    } // ended login()

    createUser = async (username, passwordPainText) => {
        const password = await bcrypt.hash(passwordPainText, 10)
        LogApp.winstonLogging.info('this is password ' + passwordPainText + ' then I hashed it ' + password)
        return await User.create({username, password}).then((user) => {
            return user
        }).catch((e) => {
            LogApp.winstonLogging.debug('somethings was wrong : ' + e.message)
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
                            LogApp.winstonLogging.info('password user has matched')
                            return await Book.findAll()
                        } else {
                            LogApp.winstonLogging.warn('password user hasn\'t matched')
                            return 'password user hasn\'t matched'
                        }
                    } else if (found.length === 0) { // if user has not existed
                        LogApp.winstonLogging.debug('user hasn\'t exited')
                        return 'user hasn\'t exited'
                    }
                }
            )
    }
}

export default CrudApp