import io from 'socket.io-client'

import {CHAT_HOST, CHAT_OPTIONS} from '../../config'
import type {ChatSettings, ChatController} from '../interfaces/chat'

const initChat = ({roomId, token, handlers}: ChatSettings) => {
	const socket = io(CHAT_HOST, {
		...CHAT_OPTIONS,
		query: {
			access_token: token
		}
	})

	socket.emit('join', roomId, (err, res) => {
		if (err) {
			console.warn(err)
		}

		handlers.join(res.messages || []);
		handlers.auth(!err);
	})

	socket.on('chat message', handlers.receiveMessage)

	return {
		sendMessage: (msg: string) => {
			socket.emit('chat message', msg, () => {})
		},
	} as ChatController
}

export default initChat
