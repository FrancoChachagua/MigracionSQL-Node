import knex from "knex";
import {__dirname} from "./utils.js";

export const databaseEcommerce = knex({
    client:'sqlite3',
    connection:{filename:__dirname+'/db/ecommerce.sqlite'}
})

export const databaseMessages = knex({
    client:'sqlite3',
    connection:{filename:__dirname+'/db/messages.sqlite'}
})