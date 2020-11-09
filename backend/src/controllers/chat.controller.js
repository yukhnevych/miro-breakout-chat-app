const roomsStorage = require('../db/room.storage')
const messageStorage = require('../db/message.storage')

class ChatController {
	constructor(io, socket) {
		const data = socket.request.user

		this.io = io
		this.socket = socket
		this.isConnected = false

		if (data) {
			this.user = data.user
			this.scopes = data.scopes.reduce((acc, scope) => ({
				...acc,
				[scope]: true
			}), {})
		}
	}

	isAuthorized() {
		return this.user && this.scopes['boards:write'] && this.scopes['boards:read'];
	}

	connect(roomId, callback) {
		if (!roomId || !this.isAuthorized()) {
			if (callback) {
				callback('roomId is required and user must be authorized')
			}

			console.warn(`${this.socket.id} attempting to connect without roomId or unauthorized`, {
				roomId,
				user: this.user
			})

			return
		}

		roomsStorage.setCurrentRoomId(roomId)

		let room = roomsStorage.get(roomId);

		if (!room) {
			room = roomsStorage.add(roomId);
		}

		room.addSocket(this.socket)
		room.addName(this.socket, this.user.name)
		this.socket.join(roomId)

		this.io.to(roomId).emit('system message', `${this.user.name} joined ${roomId}`)

		if (callback) {
			callback(null, {
				success: true,
				messages: messageStorage.get(roomId)
			})
		}

		this.isConnected = true
	}

	sendMessage(msg) {
		if (!this.isConnected) return

		const roomId = roomsStorage.currentRoomId();
		const message = messageStorage.add(roomId, msg, this.user)

		this.io.to(roomId).emit('chat message', message)

		console.log(messageStorage.all())
	}

	disconnect() {
		if (!this.isConnected) return

		const roomId = roomsStorage.currentRoomId()
		const room = roomsStorage.get(roomId)

		this.io.to(roomId).emit('system message', `${this.user.name} left ${roomId}`)

		console.log(messageStorage.all())

		if (room) {
			room.removeSocket(this.socket)
			room.removeName(this.socket)

			if (!room.hasSockets()) {
				roomsStorage.remove(roomId)
			}
		}
	}
}

module.exports = ChatController
