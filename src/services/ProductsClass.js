import database from "../config.js";

export default class ProductsClass{
    constructor(){
        database.schema.hasTable('products').then(result=>{
            if(!result){
                database.schema.createTable('products',table=>{
                    table.increments();
                    table.string('nombre').notNullable();
                    table.string('descripcion').notNullable();
                    table.integer('stock').notNullable();
                    table.string('foto').notNullable();
                    table.timestamps(true,true);
                    table.integer('codigo').notNullable();
                })
                .then(result=>{
                    console.log("Tabla de productos creada");
                })
            }
        })
        
    }
    async getAll(){
        try {
            let productList = await database.select().table('products')
            if (productList.length === 0) {
                return {products:`Data esta vacio! Primero debes ingresar un pedido!`};
            } else {
                return {products:productList};
            }
        } catch (error) {
            return console.log(`El archivo no existe!`);
        }
    }
    async getById(id){
        try {
            let productListId = await database.select.table('products').where('id',id)
            if (productListId) {
                return {object:object}
            }else{
                return  {object:'error : producto no encontrado'}
            }
        } catch (error) {
            return  {object:'error : producto no encontrado'}
        }
    }
}
