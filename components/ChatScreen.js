import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, InsertEmoticon, Mic, MoreVert } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { useRef, useState } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {
	const [user] = useAuthState(auth);
	const [input, setInput] = useState("");
	const endOfMessageRef = useRef(null);
	const router = useRouter();
	const [messagesSnapShot] = useCollection(
		db
			.collection("whatsapp-chats")
			.doc(router.query.id)
			.collection("messages")
			.orderBy("timestamp", "asc")
	);

	const [recipientSnapshot] = useCollection(
		db
			.collection("whatsapp-users")
			.where("email", "==", getRecipientEmail(chat?.users, user))
	);

	const showMessages = () => {
		if (messagesSnapShot) {
			return messagesSnapShot.docs.map((message) => (
				<Message
					key={message?.id}
					user={message?.data()?.user}
					message={{
						...message?.data(),
						timestamp: message?.data()?.timestamp?.toDate().getTime(),
					}}
				/>
			));
		} else {
			return JSON.parse(messages).map((message) => (
				<Message key={message?.id} user={message?.user} message={message} />
			));
		}
	};

	const scrollToBottom = () => {
		endOfMessageRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const sendMessage = (e) => {
		e.preventDefault();

		db.collection("whatsapp-users").doc(user.uid).set(
			{
				lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);

		db.collection("whatsapp-chats")
			.doc(router.query.id)
			.collection("messages")
			.add({
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				message: input,
				user: user.email,
				photoURL: user.photoURL,
			});

		setInput("");
		scrollToBottom();
	};

	const recipient = recipientSnapshot?.docs?.[0]?.data();
	const recipientEmail = getRecipientEmail(chat.users, user);

	return (
		<Container>
			<Header>
				{recipient ? (
					<Avatar src={recipient?.photoURL} />
				) : (
					<Avatar>{recipientEmail[0]}</Avatar>
				)}
				<HeaderInfo>
					<h3>{recipientEmail}</h3>
					{recipientSnapshot ? (
						<p>
							Last seen:{" "}
							{recipient?.lastSeen?.toDate() ? (
								<TimeAgo datetime={recipient?.lastSeen?.toDate()} />
							) : (
								"Unavailable"
							)}
						</p>
					) : (
						<p>Loading...</p>
					)}
				</HeaderInfo>
				<HeaderIcons>
					<IconButton>
						<AttachFile />
					</IconButton>
					<IconButton>
						<MoreVert />
					</IconButton>
				</HeaderIcons>
			</Header>

			<MessageContainer>
				{showMessages()}
				<EndOfMessage ref={endOfMessageRef} />
			</MessageContainer>
			<InputContainer>
				<InsertEmoticon />
				<Input value={input} onChange={(e) => setInput(e.target.value)} />
				<button hidden disabled={!input} type="submit" onClick={sendMessage}>
					Send Message
				</button>
				<Mic />
			</InputContainer>
		</Container>
	);
};

export default ChatScreen;

const Container = styled.div`
	height: 100vh;
`;

const Header = styled.div`
	position: sticky;
	background-color: white;
	top: 0;
	z-index: 100;
	display: flex;
	padding: 11px;
	align-items: center;
	border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
	margin-left: 15px;
	flex: 1;

	> h3 {
		margin-bottom: 3px;
	}

	> p {
		font-size: 14px;
		color: gray;
	}
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
	padding: 30px;
	background-color: #e5ded8;
	min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`;

const Input = styled.input`
	flex: 1;
	padding: 20px;
	background-color: whitesmoke;
	outline: 0;
	border: none;
	border-radius: 10px;
	margin-right: 15px;
	margin-left: 15px;
`;
