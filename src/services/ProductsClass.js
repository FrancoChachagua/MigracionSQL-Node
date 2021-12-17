import {databaseEcommerce} from "../config.js";
import { JSClock } from "../utils.js";

export default class ProductsClass{
    constructor(){
        databaseEcommerce.schema.hasTable('ecommerce').then(result=>{
            if(!result){
                databaseEcommerce.schema.createTable('ecommerce',table=>{
                    table.increments();
                    table.string('nombre').notNullable();
                    table.string('descripcion').notNullable();
                    table.integer('precio').notNullable();
                    table.integer('stock').notNullable();
                    table.string('foto').notNullable();
                    table.timestamps(true,true);
                })
                .then(result=>{
                    console.log("Tabla de productos creada");
                })
            }
        })
        
    }
    async getAll(){
        try {
            let productList = await databaseEcommerce.select().table('ecommerce')
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
            let productListId = await databaseEcommerce.select().table('ecommerce').where('id',id);
            if (productListId) {
                return {object:productListId}
            }else{
                return  {object:'error : producto no encontrado'}
            }
        } catch (error) {
            return  {object:'error : producto no encontrado'}
        }
    }
    async save(prod){
        try {
            let existsName = await databaseEcommerce.table('ecommerce').select().where('nombre', prod.nombre).first();
            if (existsName) {
                return {product:"Ya has realizado este pedido"}
            } else {
                let productList = await databaseEcommerce.table('ecommerce').insert(prod);
                return {message:"Pedido creado con exito", prod:productList}
            }
        } catch (error) {
            return {message: `No se pudo crear el pedido ${error}`}
        }
    }
    async deleteById(id){
        try {
            let productListIdExist = await databaseEcommerce.select().table('ecommerce').where('id',id);
            if (!productListIdExist) {
                return  {object:'error : Producto no encontrado'}
            }else{
                let productListId = await databaseEcommerce.select().table('ecommerce').del().where('id',id);
                if(productListId===0) return {object:'error : Producto no encontrado'}
                return {message:"Producto borrado con exito!", prod:productListId}
            }
        }catch (error) {
            return {error:'producto no encontrado'}
        }
    }
    async updateProduct(id,body){
        try {
            let existsName = await databaseEcommerce.table('ecommerce').select().where('id', id).first();
            if (!existsName) {
                return {product:"Error: Producto no encontrado :("}
            } else {
                await databaseEcommerce.table('ecommerce').where('id',id).update(body);
                return {message:"Pedido actualizado con exito!! Bravo"}
            }
        } catch (error) {
            return {message: `Error: No se pudo actualizar el pedido ${error}`}
        }
    }
    
}
