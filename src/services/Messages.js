import {databaseMessages} from "../config.js";

export default class MessagesClass{
    constructor(){
        databaseMessages.schema.hasTable('messages').then(result=>{
            if(!result){
                databaseMessages.schema.createTable('messages',table=>{
                    table.increments();
                    table.string('usuarioEmail').notNullable();
                    table.string('mensaje').notNullable();
                    table.timestamps(true,true)
                })
                .then(result=>{
                    console.log("Tabla de mensajes creada");
                })
            }
        })
        
    }
    async getHistoryMessages (){
        try {
            let messagesList = await databaseMessages.select().table('messages')
            if (messagesList.length === -1) {
                return {history:`No hay mensajes recientes!`};
            } else {
                return {history:messagesList};
            }
        } catch (error) {
            return console.log(`Algo salio mal al obtener los mensajes, no es tu culpa :/ ${error}!`);
        }
    }
    async pushMessages(msj){
        try {
            let messagesList = await databaseMessages.table('messages').insert(msj);
            return {message:"Mensaje enviado con exito", prod:messagesList}
        } catch (error) {
            return {message:`Algo salio mal al enviar el mensaje, no es tu culpa :/ ${error}!`};
        }
    }
}

