import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getFriendsByUserId } from '@/helper/get-friend-by-user-id'
import { fetchRedis } from '@/helper/redis'
import { chatHrefConstructor } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const page = async ({}) => {
    const session = await getServerSession(authOptions)
    if (!session) return notFound()

    const friends = await getFriendsByUserId(session.user.id)

    const friendsWithLastMessage = await Promise.all(
        friends.map(async (friend) => {
            const [rawLastMessage] = await fetchRedis('zrange', `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`, -1, -1) as string[]

            const lastMessage = JSON.parse(rawLastMessage) as Message

            return {
                ...friend,
                lastMessage
            }
        })
    )

    return <div className='container py-12'>
        <h1 className='font-bol text-5xl mb-8'>Recent chats</h1>
        {friendsWithLastMessage.length === 0 ? (
            <p className='text-sm text-zinc-500'>
                Nothing to show here...
            </p>
        ) : friendsWithLastMessage.map((friend) => (
            <div key={friend.id} className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
                <div className='absolute right-4 inset-y-0 flex items-center'>
                    <ChevronRight className='h-7 w-7 text-zinc-400' />
                </div>

                <Link className='relative sm:flex' href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`}>
                    <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                        <div className="relative h-6 w-6">
                            <Image referrerPolicy='no-referrer' className='rouned-full' alt={`${friend.name} profile`} src={friend.image} fill />
                        </div>
                    </div>

                    <div className=''>
                        <h4 className="text-lg font-semibold">{friend.name}</h4>
                        <p className="mt-1 max-w-md">
                            <span className="text-zinc-400">
                                {friend.lastMessage.senderId === session.user.id && 'You: '}
                            </span>
                            {friend.lastMessage.text}
                        </p>
                    </div>
                </Link>
            </div>
        ))}
    </div>
}
export default page