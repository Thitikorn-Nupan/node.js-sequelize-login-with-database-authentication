import {configAndSequelize} from "../config/db.config.js";

const dbConfig = new configAndSequelize.dbConfig()
const {DataTypes} = configAndSequelize.sequelize
const getSequelizeConfigDb = dbConfig.sequelizeConfig('all_backup_tables') // for testing to change database name passed argument
const Book = getSequelizeConfigDb.define(
    'books', {
        bid: {
            type : DataTypes.INTEGER ,
            primaryKey : true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.DECIMAL,
        },
        sale: {
            type: DataTypes.INTEGER,
        }
    },
    {
        freezeTableName: true, // freeze name table not using *s on name
        timestamps: false // don't use createdAt/update
    }
)
export default Book