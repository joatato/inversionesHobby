import dotenv from 'dotenv'

dotenv.config()

export const config = {
    app: {
        PORT: process.env.PORT || 8080,
        TOKEN_SECRET: process.env.TOKEN_SECRET
        /* PERSISTENCIA:process.env.PERSISTENCIA */
    },
    database: {
        MONGOURL: process.env.MONGOURL,
        DBNAME: process.env.DBNAME,
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD
    }

}