/* It is written within the [], because here param is passed and param is id */

import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

const Chat = ({ chat, messages }) => {
	const [user] = useAuthState(auth);

	return (
		<Container>
			<Head>
				<title>Chat with {getRecipientEmail(chat.users, user)}</title>
				<link
					rel="icon"
					href="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
				/>
			</Head>
			<Sidebar />
			<ChatContainer>
				<ChatScreen chat={chat} messages={messages} />
			</ChatContainer>
		</Container>
	);
};

export default Chat;

/* The logic written in below function happens in server side, even before the client visits the page */
export const getServerSideProps = async (context) => {
	const ref = db.collection("whatsapp-chats").doc(context.query.id);

	/* PREP the messages */
	const messagesRes = await ref
		.collection("messages")
		.orderBy("timestamp", "asc")
		.get();

	const messages = messagesRes.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.map((messages) => ({
			...messages,
			timestamp: messages.timestamp.toDate().getTime(),
		}));

	/* PREP the chats */
	const chatRes = await ref.get();
	const chat = {
		id: chatRes.id,
		...chatRes.data(),
	};

	return {
		props: {
			messages: JSON.stringify(messages),
			chat: chat,
		},
		// revalidate: 60; // this will do Incremental Static Regeneration every 60 seconds once
	};
};

const Container = styled.div`
	display: flex;
	width: 100%;
`;

const ChatContainer = styled.div`
	flex: 1;
	overflow: scroll;
	height: 100vh;

	::-webkit-scrollbar {
		display: none;
	}

	--ms-overflow-style: none;
	scrollbar-width: none;
`;
