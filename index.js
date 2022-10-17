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


let productos = new Contenedor("productos", options.mysql);
let mensajes = new Mensajes("mensajes", options.sqlite3)

// Conectamos websocket
io.on("connection", (socket) => {
    console.log('Usuario con id: ', socket.id, ' se ha conectado')

    // Socket Chat
    socket.emit('messages', mensajes.table);

	socket.on("new-message", async (data) => {
		fecha = new Date().toLocaleDateString()
        await mensajes.addMessage({
            ...data, fecha
        });
		
		io.sockets.emit("messages", mensajes.table);
});

    // Socket productos
    socket.emit("productosList", productos.table )

	socket.on("newProduct", async (data) => {
		let producto = await productos.getAll();
		productos.post(producto)
		io.sockets.emit("productList", productos.table)
	})

})

//establecemos la configuración de ejs

app.set("view engine", "ejs");
app.set("views", "./views");
//--------------------------------------------



app.use(express.static("public")); //quiza views?


app.use("/", router);


router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.post("/", (req, res) => {
	const producto = req.body;
	productos.addProduct(producto);
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

