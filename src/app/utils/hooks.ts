import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { signOut } from 'next-auth/react';
import { useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { FullConversationType } from './types';
import { User } from '@prisma/client';

export const useOtherUser = (
	conversation: FullConversationType | { users: User[] }
) => {
	const session = useSession();

	const otherUser = useMemo(() => {
		const currentUserEmail = session.data?.user?.email;

		const otherUser = conversation.users.filter(
			(user) => user.email !== currentUserEmail
		);

		return otherUser[0];
	}, [session.data?.user?.email, conversation.users]);

	return otherUser;
};

export const useConversation = () => {
	const params = useParams();

	const conversationId = useMemo(() => {
		if (!params?.conversationId) {
			return '';
		}

		return params.conversationId as string;
	}, [params?.conversationId]);

	const isOpen = useMemo(() => !!conversationId, [conversationId]);

	return useMemo(
		() => ({
			isOpen,
			conversationId
		}),
		[isOpen, conversationId]
	);
};

export const useAppRoutes = () => {
	const pathname = usePathname();
	const { conversationId } = useConversation();

	const routes = useMemo(
		() => [
			{
				label: 'Chat',
				href: '/conversations',
				icon: HiChat,
				active: pathname === '/conversations' || !!conversationId
			},
			{
				label: 'Users',
				href: '/users',
				icon: HiUsers,
				active: pathname === '/users'
			},
			{
				label: 'Logout',
				onClick: () => signOut(),
				href: '#',
				icon: HiArrowLeftOnRectangle
			}
		],
		[pathname, conversationId]
	);

	return routes;
};

export const useChat = () => {
	const params = useParams();

	const isOpen = useMemo(() => !!params.chatId, [params.chatId]);

	return useMemo(
		() => ({
			isOpen
		}),
		[isOpen]
	);
};
