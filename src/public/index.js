const socket = io();
// msgs
const $chat = document.getElementById('chat');
const $formChatLive = document.getElementById('formChatLive');
const $btnFormChat = document.getElementById('btnFormChat');

// table
const $divPostTD = document.querySelector('#formPost');
const $formOne = document.querySelector('#addProducts');
const $handlebarsTable = document.getElementById('handlebarsTable');


//dinamic mensages
$btnFormChat.addEventListener('click', (e)=>{
    e.preventDefault();
    let formData = new FormData($formChatLive);
    let mensaje = formData.get('message');
    let usuarioEmail = formData.get('email');
    fetch('http://localhost:8080/api/mensajes/',{
        method:'POST',
        body:JSON.stringify({
            usuarioEmail:usuarioEmail,
            mensaje:mensaje
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(result =>{
        return result.json();
    }).then(json=>{
        console.log(json);
    })
})


socket.on('chatHistory',data=>{
    console.log(data);
    console.log(data.history);
    let newData = JSON.parse(JSON.stringify(data.history));
    console.log(newData);
    let messagess = newData.map((msjs)=>{
        return `<div>
                    <span> <b class="text-primary">${msjs.usuarioEmail}</b> <span class="text-secondary"> ${msjs.created_at}</span> : <span class="text-success fst-italic">${msjs.mensaje}</span> </span>
                </div>`
    } ).join('');
    $chat.innerHTML= messagess
})


// dinamic table

socket.on('realTimeTable', data=>{
    let info = data.products;
    (info == `Data esta vacio! Primero debes ingresar un pedido!`) ? 
                                                                    prod = false
                                                                    : 
                                                                    prod = data.products;
    fetch('templates/productsTable.handlebars')
        .then(str=>str.text())
        .then(template=>{
            console.log(template);
            const templateTable = Handlebars.compile(template);
            const templateObj = {
                products:prod
            }
            const bodyHbs = templateTable(templateObj);
            $handlebarsTable.innerHTML= bodyHbs;
        })
})


$divPostTD.addEventListener('submit',(e)=>{
    e.preventDefault();
    let formData = new FormData($formOne);
    for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
    let nombre = formData.get('title');
    let precio = formData.get('price');
    let descripcion = formData.get('description');
    let stock = formData.get('stock');
    let foto = formData.get('image');
    fetch('http://localhost:8080/api/productos',{
        method:'POST',
        body:JSON.stringify({
            nombre:nombre,
            precio:precio,
            descripcion:descripcion,
            stock:stock,
            foto:foto
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(alert(`Usted ha añadido un nuevo producto!`))
    .then(result =>{
        return result.json();
    }).then(json=>{
        console.log(json);
    })
})
