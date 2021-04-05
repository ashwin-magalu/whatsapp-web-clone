import { Avatar } from "@material-ui/core";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/router";

const Chat = ({ id, users, user }) => {
	const router = useRouter();
	const recipientEmail = getRecipientEmail(users, user);
	const [recipientSnapshot] = useCollection(
		db.collection("whatsapp-users").where("email", "==", recipientEmail)
	);
	const recipient = recipientSnapshot?.docs?.[0]?.data();

	const enterChat = () => {
		router.push(`/chat/${id}`);
	};

	return (
		<Container onClick={enterChat}>
			{recipient ? (
				<UserAvatar src={recipient?.photoURL} />
			) : (
				<UserAvatar>{recipientEmail[0]}</UserAvatar>
			)}
			<p>{recipientEmail}</p>
		</Container>
	);
};

export default Chat;

const Container = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 15px;
	word-break: break-word;

	:hover {
		background-color: #e9eaeb;
	}
`;

const UserAvatar = styled(Avatar)`
	margin: 5px;
	margin-right: 15px;

	:hover {
		opacity: 0.8;
	}
`;
