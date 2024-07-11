'use client'

import { FC, useState } from 'react'
import Button from './ui/Button'
import { addFriendValidater } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps { }

type FormData = z.infer<typeof addFriendValidater>

const AddFriendButton: FC<AddFriendButtonProps> = ({ }) => {
    const [successSate, setSuccessSate] = useState<boolean>(false)

    const {
        register, handleSubmit, setError, formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(addFriendValidater)
    })

    const addFriend = async (email: string) => {
        try {
            const validatedEmail = addFriendValidater.parse({ email })

            await axios.post('/api/friends/add', {
                email: validatedEmail
            })

            setSuccessSate(true)

        } catch (error) {
            if (error instanceof z.ZodError) setError('email', { message: error.message })
            else if (error instanceof AxiosError) setError('email', { message: error.response?.data })
            else setError('email', { message: 'Something went wrong!' })

            return
        }
    }

    const onSubmit = (data: FormData) => {
        addFriend(data.email)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                Add friend by EMAIL
            </label>

            <div className='mt-2 flex gap-4'>
                <input
                    {...register('email')}
                    type='text'
                    className='block w-full rounded-medium border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-onset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='you@example.com'
                />
                <Button>Add</Button>
            </div>
            <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
            {successSate && (
                <p className='mt-1 text-sm text-green-600'>Friend Request sent</p>
            )}
        </form>
    )
}

export default AddFriendButton