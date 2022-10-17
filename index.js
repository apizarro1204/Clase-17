const express = require("express");
const Contenedor = require('./models/productsModel')
const Mensajes = require('./models/messageModel')
const {options} = require('./connection');
const startTable = require('./models/tables');
const router = express.Router();
const app = express();


const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;


let prod = new Contenedor("productos", options.mysql);
let msg = new Mensajes("mensajes", options.sqlite3)

// Conectamos websocket
io.on("connection", async (socket) => {
    console.log('Usuario con id: ', socket.id, ' se ha conectado')

    let productos = await prod.getAll();
    let mensajes = await msg.getAll();
    // Socket Chat
    socket.emit('messages', mensajes);

	socket.on("new-message", async (data) => {
		data.fecha = new Date().toLocaleDateString()
        mensajes.push(data.fecha);
        msg.addMessage(data);

        console.log(data)
		
		io.sockets.emit("messages", mensajes);
});

    // Socket productos
    socket.emit("productosList", productos);


	socket.on("newProduct", async (data) => {
        await productos.addProduct(data);

        // let producto = new Contenedor(data.title, data.price, data.thumbnail)
        // await prod.addProduct(producto)
        //     productos = await prod.getAll();
		// let producto = await prod.getAll();
		// productos.post(producto)
        //await prod.addProduct(producto)
        console.log(data)
		io.sockets.emit("productList", productos)
	})

})

//establecemos la configuración de ejs

app.set("view engine", "ejs");
app.set("views", "./views");
//--------------------------------------------



app.use(express.static("./public"));
app.set("socketio", io);


app.use("/", router);


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// Agrega el producto a la base de datos mysql
router.post("/", (req, res) => {
	const producto = req.body;
	prod.addProduct(producto);
	res.redirect("/");
});

function start(){
    const inicio = new startTable();

    let prod = inicio.prod();
    let mess = inicio.mess();
}


start();

httpServer.listen(PORT, () => console.log("servidor Levantado"));

// Test para ver si funciona agregar los datos
// const productoNuevo = {
//     title: "Estuche",
//     price: 10.99,
//     thumbnail: "https://cdn2.iconfinder.com/data/icons/flat-pack-1/64/Pencil-256.png"
// }

// async function test(){
//     try{
//         const contenedor = new Contenedor("productos", options.mysql);

//         let add = await contenedor.addProduct(productoNuevo);
//     }catch(err){
//         throw err;
//     }
// }

// test();

