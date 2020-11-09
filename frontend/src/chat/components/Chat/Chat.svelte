<script lang="ts">
	import {onMount} from 'svelte'
	import Message from './Message.svelte'

	import type {
		Message as IMessage,
		ChatController,
		ChatSettings,
		User,
	} from '../../interfaces/chat'
	import { ChatState } from '../../interfaces/chat'

	export let chatFactory: (settings: ChatSettings) => ChatController
	export let roomId: string
	export let user: User

	let newMessageText: string = ''
	let chatController: ChatController = null
	let token = user.token
	let chatState = ChatState.Loading
	let messages: Array<IMessage> = []

	const handleMessageSend = () => {
		if (!newMessageText) return

		chatController.sendMessage(newMessageText)

		newMessageText = ''

		return false
	}

	onMount(() => {
		chatController = chatFactory({
			roomId,
			token,
			handlers: {
				auth: (isAuthorized) => chatState = isAuthorized ? ChatState.Success : ChatState.Unauthorized,
				join: (msgs) => messages = msgs,
				receiveMessage: (message) => messages = [...messages, {...message}]
			}
		})
	})
</script>

<style>
	.sidebar__container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}

	.sidebar__header {
		padding: 24px;
		height: 64px;
	}

	.sidebar__body {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: calc(100% - 140px);
		padding: 0 24px;
	}

	.chat__messages {
		min-height: 0;
		overflow: auto;
	}

	.sidebar__footer {
		padding: 0 8px;
	}

	.sidebar__footer input {
		width: 100%;
	}
</style>

<div class="sidebar__container">
	<div class="sidebar__header">
		<span class="miro-h2">Breakout Chat</span>
	</div>
	<div class="sidebar__body">
		<div class="chat__messages">
			{#each messages as message}
				<Message {message} />
			{/each}
		</div>
	</div>
	<div class="sidebar__footer">
		{#if chatState === ChatState.Loading}
			<p>Loading</p>
		{:else if chatState === ChatState.Unauthorized}
			<p>Not authorized</p>
		{:else}
			<form on:submit|preventDefault={handleMessageSend}>
				<input
					disabled={chatController === null}
					type="text"
					class="miro-input miro-input--primary"
					bind:value={newMessageText}
					placeholder="Type your message here" />
			</form>
		{/if}
	</div>
</div>
