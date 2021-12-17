import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import upload from './services/upload.js';
import Contenedor from './classes/Contenedor.js';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import products from './routes/products.js';
// import carrito from './routes/carrito.js';

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>{
    console.log(`Servidor escuchando en mi proyecto, products: ${PORT}`);
})
server.on('error', (error)=>console.log(`Error en el servidor ${error}`))

const contenedor = new Contenedor();
export const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(express.static(__dirname+'/public'));
app.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log(`Peticion hecha a las ${time.toTimeString().split(" ")[0]}`);
    next();
})

// Routes
app.use('/api/productos', products);
// app.use('/api/carrito',carrito);

//Definir motor de plantilla de la clase 12
app.engine('handlebars', engine());
app.set('views', __dirname+'/views');
app.set('view engine','handlebars')


// POST 
app.post('/api/uploadfile',upload.array('images'),(req,res)=>{
    const files = req.files;
    if(!files || files.length===0){
        res.status(500).send({message:"No se subio el archivo"})
    }
    res.send(files);
})

// clase 12

// socket mensajes clase 12

let messages = [];

io.on('connection', socket=>{
    socket.emit('chatHistory', messages)
    socket.on('message', data=>{
        messages.push(data)
        io.emit('chatHistory', messages);
    })
});