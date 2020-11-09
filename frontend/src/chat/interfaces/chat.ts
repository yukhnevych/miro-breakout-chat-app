export interface Message {
	text: string
	author: User
	createdAt: Date
}

export type Handler<T> = (arg: T) => void

export type EmitHandler = (error: any, response: any) => void

export enum ChatState {
	Loading,
	Unauthorized,
	Success
}

export interface ChatSettings {
	roomId: string
	token: string
	handlers: {
		auth: Handler<boolean>
		join: Handler<Message[]>
		receiveMessage: Handler<Message>
	}
}

export interface User {
	id: string
	name: string
	token?: string
}

export interface ChatController {
	sendMessage: (msg: string) => void
}
