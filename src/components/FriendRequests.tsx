'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherkey } from '@/lib/utils'
import axios from 'axios'
import { Check, User, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC,  useEffect,  useState } from 'react'

interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequests, sessionId}) => {
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)
    const router = useRouter()

    useEffect(() => {
        pusherClient.subscribe(
            toPusherkey(`user:${sessionId}:incoming_friend_requests`)
        )

        const friendRequestsHandler = ({senderId, senderEmail}: IncomingFriendRequest) => {
            setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
        }

        pusherClient.bind('incoming_friend_requests', friendRequestsHandler)

        return () => {
            pusherClient.unsubscribe(
                toPusherkey(`user:${sessionId}:incoming_friend_requests`)
            )
            pusherClient.unbind('incoming_friend_requests', friendRequestsHandler)
        }
    }, [sessionId])

    const acceptFriend = async (senderID: string) => {
        await axios.post('/api/friends/accept', { id: senderID })

        setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderID))

        router.refresh()
    }

    const denyFriend = async (senderID: string) => {
        await axios.post('/api/friends/deny', { id: senderID })

        setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderID))

        router.refresh()
    }

    return (
        <>
            {friendRequests.length === 0 ? (
                <p className='text-sm text-zinc-500'>Nothing to show here...</p>
            ) : (
                friendRequests.map((request) => (
                    <div key={request.senderId} className='flex gap-4 items-center'>
                        <UserPlus className='text-black' />
                        <p className='text-lg font-md'>{request.senderEmail}</p>

                        <button onClick={() => acceptFriend(request.senderId)} aria-label='accept friend' className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                            <Check className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                        
                        <button onClick={() => denyFriend(request.senderId)} aria-label='deny friend' className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                            <X className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                    </div>
                )
            ))}
        </>
    )
}

export default FriendRequests