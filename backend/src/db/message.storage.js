class Message {
	constructor(text, author) {
		this.text = text
		this.createdAt = Date.now()
		this.author = author
	}
}

class MessageStorage {
	constructor() {
		this._messages = {}
	}

	add(roomId, text, author) {
		const message = new Message(text, author)

		if (!this._messages[roomId]) {
			this._messages[roomId] = []
		}

		this._messages[roomId].push(message)

		return message
	}

	all() {
		return { ...this._messages };
	}

	get(roomId) {
		const messages = this._messages[roomId] || [];

		return [ ...messages ]
	}

	remove(roomId) {
		if (roomId && this._messages[roomId]) {
			return delete this._messages[roomId]
		}

		return false
	}
}

module.exports = new MessageStorage();
