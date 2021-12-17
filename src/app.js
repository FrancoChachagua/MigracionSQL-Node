import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import upload from './services/upload.js';
import Contenedor from './classes/Contenedor.js';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import productos from './routes/products.js';
import MessagesClass from './services/Messages.js';

// import carrito from './routes/carrito.js';

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>{
    console.log(`Servidor escuchando en mi proyecto, products: ${PORT}`);
})
server.on('error', (error)=>console.log(`Error en el servidor ${error}`))

const messagesService = new MessagesClass();
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
app.use('/api/productos', productos);

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

// socket mensajes clase 11

// GET

app.get('/api/mensajes/', (req,res)=>{
    messagesService.getHistoryMessages().then(result=>{
        res.send(result.history);
    })
})

//POST

app.post('/api/mensajes/', (req,res)=>{
    let msg = req.body;
    messagesService.pushMessages(msg).then(result=>{
        res.send(result)
        if(result.message==="Mensaje enviado con exito"){
            messagesService.getHistoryMessages().then(result=>{
                io.emit('chatHistory', result)
            })
        }
    })
})

io.on('connection', socket=>{
    messagesService.getHistoryMessages().then(result=>{
        socket.emit('chatHistory',result)
    })
});
