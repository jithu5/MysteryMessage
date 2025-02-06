"use client"
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { IMessage } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { IApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Session } from 'inspector/promises'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

function DashboardPage() {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => (prev.filter(message => message?._id !== messageId)))
  }

  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessge = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const { data } = await axios.get<IApiResponse>('/api/accept-mesage');
      if (!data.success) {
        return
      }
      setValue('acceptMessages', data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Error fetching messages",
        description: axiosError.response?.data.message || "Failed to fetch message settings.",
        variant: 'destructive',
      })
    }
    finally {
      setIsSwitchLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const { data } = await axios.get<IApiResponse>('/api/get-messages')
      if (!data.success) {
        return
      }
      setMessages(data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed messages",
          description: "Showing latest messages.",
          variant: 'default',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Error fetching messages",
        description: axiosError.response?.data.message || "Failed to fetch message settings.",
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setMessages, setIsLoading])

  useEffect(() => {
    if (!session || !session.user) {
      return
    }

    fetchAcceptMessge()
    fetchMessages()
  }, [session, setValue, fetchAcceptMessge, fetchMessages])

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const { data } = await axios.post<IApiResponse>('/api/accept-message',
        { acceptMessages: !acceptMessages },
        { withCredentials: true }
      )
      if (!data.success) {
        return
      }
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: "Message settings updated",
        description: acceptMessages ? "Messages will now be accepted." : "Messages will now be rejected.",
        variant: 'default',
      })
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Error fetching messages",
        description: axiosError.response?.data.message || "Failed to fetch message settings.",
        variant: 'destructive',
      })
    }
  }


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "Copied",
      description: "Profile URL copied to clipboard.",
      variant: 'default',
    })
  }

  if (!session || !session.user) {
    return (
      <div>Please login</div>
    )
  }

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`
  return (
    <>
      <div className='my-8 x-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
        <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold mb-2'>Copy your Unique Link</h2>{' '}
          <div className='flex items-center'>
            <input type='text' value={profileUrl} disabled className='input input-bored w-full border border-stone-800 rounded-md px-3 py-2 mr-2' />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className='mb-4'>
          <Switch
            {...register('acceptingMessages')}
            checked={acceptMessages}
            onChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className='ml-2'>
            Accept Messages : {acceptMessages ? "on" : "off"}
          </span>
        </div>
        <Separator />
        <Button className='mt-4' variant={'outline'}
          onClick={(e) => {
            e.preventDefault()
            fetchMessages(true)
          }}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (<RefreshCcw className='h-4 w-4' />)}
        </Button>
        <div className='mt-4 grid grid-cols-1 md:rid-cols-2 gap-6'>
          {
            messages.length >0 ?(
              messages.map((message,index)=>(
                <MessageCard key={message._id}
                message={message} onMessageDelete={handleDeleteMessage} />
              ))
            ):(
              <p className='text-center text-lg'>No messages found.</p>
            )
          }
        </div>
      </div>
    </>
  )
}

export default DashboardPage
