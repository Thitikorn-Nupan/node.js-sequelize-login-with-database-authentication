import LogApp from "../log/log.app.js";
import path from "path";
import dotenv from 'dotenv'
import sequelize from 'sequelize'

class DbConfig {
    constructor() {
        //** config the environment file
        dotenv.config({ path : path.resolve('./env/.env'),debug:true })
        LogApp.winstonLogging.info('DbConfig\'s constructor is worked')
    }
    sequelizeConfig(database) {
        return new sequelize(
            database,
            process.env.MYSQL_USERNAME,
            process.env.MYSQL_PASSWORD,
            {
                /* set different port */
                dialect : 'mysql' ,
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                pool : {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        ) // ended new sequelize()
    }
}

/**
check to config. it was gonna good or bad
new DbConfig().sequelizeConfig("register").authenticate().then(() => {
    LogApp.winstonLogging.info('connected successfully!!')
}).catch((error) => {
    LogApp.winstonLogging.debug('failed connect!!')
    throw error
})
*/
export const configAndSequelize = {
    sequelize : sequelize ,
    dbConfig : DbConfig
}