import {configAndSequelize} from "../config/db.config.js";

const dbConfig = new configAndSequelize.dbConfig()
const {DataTypes} = configAndSequelize.sequelize
const getSequelizeConfigDb = dbConfig.sequelizeConfig('register') // for testing to change database name passed argument
const User = getSequelizeConfigDb.define (
    'users' , {
        uid : {
            type : DataTypes.INTEGER ,
            primaryKey : true,
            autoIncrement: true
        } ,
        username : {
            type : DataTypes.STRING,
        },
        password : {
            type : DataTypes.STRING,
        },
    },
    {
        freezeTableName: true , // freeze name table not using *s on name
        timestamps: false // don't use createdAt/update
    }
)
export default User