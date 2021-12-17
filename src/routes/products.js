import express from 'express';
import {io} from '../app.js';
import { adminOrUser} from '../utils.js';
import ProductsClass from '../services/ProductsClass.js';

const router = express.Router();
const productService = new ProductsClass();

router.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Petición hecha a las: '+time.toTimeString().split(" ")[0])
    req.auth = admin;
    next()
})

const admin = true;

// GET

router.get('/', (req,res)=>{
    productService.getAll().then(result=>{
        console.log(result);
        let info = result.products;
        if(info === `Data esta vacio! Primero debes ingresar un pedido!`|| undefined){
            res.render('products',{
                noObject: true
            });
        }else{
            let preparedObject = {
                            products : info
                        }
            res.render('products', preparedObject);
        }
    })
})

router.get('/:id?', (req,res)=>{
    let id= parseInt(req.params.id);
    productService.getById(id).then(result=>{
        res.send(result.object);
    })
})

// POST

// router.post('/' ,adminOrUser,(req,res)=>{
//     let product = req.body;
//     product.precio = parseInt(product.precio);
//     console.log(req.body);
//     productService.save(product).then(result=>{
//         res.send(result);
//         if(result.message==="Pedido creado con exito"){
//             productService.getAll().then(result=>{
//                 io.emit('realTimeCards', result)
//             })
//         }
//     })
// })

router.post('/' ,adminOrUser,(req,res)=>{
    let product = req.body;
    product.precio = parseInt(product.precio);
    product.stock = parseInt(product.stock);
    console.log(product);
    productService.save(product).then(result=>{
        res.send(result);
    })
})


//PUT

router.put('/:id',adminOrUser,(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.id);
    console.log(body,id);
    productService.updateProduct(id,body).then(result=>{
        res.send(result);
    })
})


// DELETE

router.delete('/:id', adminOrUser , (req,res)=>{
    let id= parseInt(req.params.id);
    console.log(id);
    productService.deleteById(id).then(result=>{
        res.send(result)
    })
})




export default router;
