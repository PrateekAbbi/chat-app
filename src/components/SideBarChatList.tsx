'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherkey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'

interface SideBarChatListProps {
    friends: User[]
    sessionId: string
}

interface ExtendedMessage extends Message {
    senderImg: string,
    senderName: string
}

const SideBarChatList: FC<SideBarChatListProps> = ({ sessionId, friends }) => {
    const router = useRouter()
    const pathName = usePathname()

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const [activeChats, setActiveChats] = useState<User[]>(friends)

    useEffect(() => {
        pusherClient.subscribe(toPusherkey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherkey(`user:${sessionId}:friends`))

        const friendHandler = (newFriend: User) => {
            setActiveChats((prev) => [...prev, newFriend])
        }

        const chatHandler = (message: ExtendedMessage) => {
            const shouldNotify = pathName !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

            if (!shouldNotify) return

            toast.custom((t) => (
                <UnseenChatToast
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImg} senderMessage={message.text}
                    senderName={message.senderName}
                />
            ))
        }

        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', friendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherkey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherkey(`user:${sessionId}:friends`))

            pusherClient.unbind('new_message', chatHandler)
            pusherClient.unbind('new_friend', friendHandler)
        }
    }, [pathName, sessionId, router])

    useEffect(() => {
        if (pathName?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathName.includes(msg.senderId))
            })
        }
    }, [pathName])



    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            {activeChats.sort().map((friend) => {
                const unseenMessagesCount = unseenMessages.filter((unseenMessage) => {
                    return unseenMessage.senderId === friend.id
                }).length

                return (
                    <li key={friend.id}>
                        <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`} className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                            {friend.name}
                            {unseenMessagesCount > 0 && (
                                <div className='bg-indigo-600 font-md text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                                    {unseenMessagesCount}
                                </div>
                            )}
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}

export default SideBarChatList