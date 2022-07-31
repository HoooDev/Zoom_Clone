import http from "http"
import SocketIO from "socket.io"
import express from "express"

const app = express()

app.set("view engine", "pug")
app.set("views", __dirname + "/public/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"))
app.get("/*", (req, res) => res.redirect("/"))

// const handleListen = () => console.log(`Listening on http//localhost:3000`)

const httpServer = http.createServer(app)
const wsServer = SocketIO(httpServer)

// const nickname = socket.nickname
wsServer.on("connection", (socket) => {
	socket['nickname'] = 'anon'
	socket.onAny((event) => {
		console.log(`Socket Event: ${event}`)
	})
	socket.on("enter_room", (roomName, done) => {
		socket.join(roomName)
		done()
		socket.to(roomName).emit('welcome', socket.nickname)
	})
	socket.on('disconnecting', () => {
		socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname))
	})
	socket.on('new_message', (msg, room, done) => {
		socket.to(room).emit('new_message', ` ${socket.nickname}: ${msg}`)
		done(socket.nickname)
	})
	socket.on('nickname', (nickname) => {
		socket["nickname"] = nickname

	})
})

// const sockets = []
// const wss = new WebSocket.Server({ server })
// wss.on("connection", (socket) => {
// 	sockets.push(socket)
// 	socket["nickname"] = "Anon"
// 	console.log("Connected to Browser ✅")
// 	socket.on("close", () => console.log("Disconnected from the Browser ❌"))
// 	socket.on("message", (msg) => {
// 		const message = JSON.parse(msg)
// 		switch (message.type) {
// 			case "new_message":
// 				console.log(socket.nickname)
// 				console.log(message.payload)
// 				sockets.forEach((aSocket) =>
// 					aSocket.send(`${socket.nickname}: ${message.payload}`))
// 				break
// 			case "nickname":
// 				console.log(message.payload)
// 				socket["nickname"] = message.payload
// 				break
// 		}

// if (message.type === 'new_message') {
// 	sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`))
// } else if (message.type === 'nickname') {
// 	socket["nickname"] = message.payload
// }
// 	})
// })

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen)
