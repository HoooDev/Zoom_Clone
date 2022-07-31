const socket = io()

const welcome = document.getElementById('welcome')
const roomname = welcome.querySelector('#roomname')
const nickname = welcome.querySelector('#name')

const room = document.getElementById('room')

room.hidden = true

let roomName

function addMessage(message) {
  const ul = room.querySelector('ul')
  const li = document.createElement("li")
  li.innerText = message
  ul.appendChild(li)
}

function handleMessageSubmit(event) {
  event.preventDefault()
  const input = room.querySelector('#msg input')
  const value = input.value
  socket.emit('new_message', input.value, roomName, (nickname) => {
    addMessage(`${nickname}: ${value}`)
  })
  input.value = ''
}

function handleNicknameSubmit(event) {
  event.preventDefault()
  const input = nickname.querySelector('input')
  socket.emit('nickname', input.value)
}

function showRoom() {
  welcome.hidden = true
  room.hidden = false
  const h3 = room.querySelector('h3')
  h3.innerText = `Room ${roomName}`
  const msgForm = room.querySelector('#msg')
  msgForm.addEventListener('submit', handleMessageSubmit)

}

function createNickname() {
  const nameForm = welcome.querySelector('#name')
  nameForm.addEventListener('submit', handleNicknameSubmit)

}

function handleRoomSubmit(event) {
  event.preventDefault()
  const input = roomname.querySelector('input')
  socket.emit("enter_room", input.value, showRoom)
  roomName = input.value
  input.value = ''

}

roomname.addEventListener("submit", handleRoomSubmit)
nickname.addEventListener("submit", handleNicknameSubmit)

socket.on('welcome', (user) => {
  addMessage(`${user} joined!`)
})

socket.on("bye", (left) => {
  addMessage(`${left} left!`)
})

socket.on("new_message", addMessage)