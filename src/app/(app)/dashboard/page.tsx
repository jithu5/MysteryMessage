"use client"
import { useToast } from '@/hooks/use-toast'
import { IMessage } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

function DashboardPage() {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)

  const {toast} = useToast();

  const handleDeleteMessage = (messageId: string)=>{
    setMessages(prev=>(prev.filter(message=>message?._id !== messageId)))
  }

  const {data: session} = useSession()
  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form;

  const acceptMessages = watch('acceptMessages');

  


  return (
    <>
      dash
    </>
  )
}

export default DashboardPage
