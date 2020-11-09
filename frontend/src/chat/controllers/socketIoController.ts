import io from 'socket.io-client'

import {CHAT_HOST, CHAT_OPTIONS, CLIENT_ID} from '../../config'
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

	// @ts-ignore
	miro.addListener(miro.enums.event.WIDGETS_DELETED, async (event) => {
		const state = await miro.__getRuntimeState()
		const roomId = state[CLIENT_ID]?.breakoutChatRoomId;

		if (roomId && event.data.find(item => item.id === roomId)) {
			socket.emit('delete room', roomId)
		}
	})

	return {
		sendMessage: (msg: string) => {
			socket.emit('chat message', msg, () => {})
		},
	} as ChatController
}

export default initChat
