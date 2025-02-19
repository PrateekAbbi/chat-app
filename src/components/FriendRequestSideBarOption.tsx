'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherkey } from '@/lib/utils'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

interface FriendRequestSideBarOptionProps {
    sessionId: string
    initialUnseenReqCount: number
}

const FriendRequestSideBarOption: FC<FriendRequestSideBarOptionProps> = ({ sessionId, initialUnseenReqCount }) => {
    const [unseenReqCount, setunseenReqCount] = useState<number>(initialUnseenReqCount)

    useEffect(() => {
        pusherClient.subscribe(
            toPusherkey(`user:${sessionId}:incoming_friend_requests`)
        )
        pusherClient.subscribe(
            toPusherkey(`user:${sessionId}:friends`)
        )

        const friendRequestsHandler = () => {
            setunseenReqCount((prev) => prev + 1)
        }

        const addedFriendHandler = () => {
            setunseenReqCount((prev) => prev - 1)
        }

        pusherClient.bind('incoming_friend_requests', friendRequestsHandler)
        pusherClient.bind('new_friend', addedFriendHandler)

        return () => {
            pusherClient.unsubscribe(
                toPusherkey(`user:${sessionId}:incoming_friend_requests`)
            )
            pusherClient.unsubscribe(
                toPusherkey(`user:${sessionId}:friends`)
            )
            pusherClient.unbind('incoming_friend_requests', friendRequestsHandler)
            pusherClient.unbind('new_friend', addedFriendHandler)
        }
    }, [sessionId])

    return (
        <Link href='/dashboard/requests' className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
            <div className='text-gray-400 border-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-md bg-white'>
                <UserIcon className='h-4 w-4' />
            </div>
            <p className='truncate'>Friend Requests</p>

            {unseenReqCount > 0 ? (
                <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>{unseenReqCount} </div>
            ) : null}
        </Link>
    )
}

export default FriendRequestSideBarOption