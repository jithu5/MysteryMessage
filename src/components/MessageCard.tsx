"use client"
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { IMessage } from '@/model/User'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { IApiResponse } from '@/types/ApiResponse'

type MessageCardProp = {
    message: IMessage,
    onMessageDelete: (messageId: string) => void,

}

function MessageCard({ message, onMessageDelete }: MessageCardProp) {

    const { toast } = useToast()

    const handleDeleteConfirm = async () => {
        console.log('delete message')
        try {
            const { data } = await axios.delete<IApiResponse>(`/api/delete-message/${message?._id}`)
            if (data.success) {
                toast({
                    title: 'Message deleted',
                    description: 'Your message has been successfully deleted.',
                    variant: 'default',
                })
                onMessageDelete(message._id)
                return
            }
            toast({
                title: 'Error deleting message',
                description: 'Failed to delete your message. Please try again later.',
                variant: 'destructive',
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X className='w-5 h-5' /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CardDescription>test card</CardDescription>
                </CardHeader>

            </Card>
        </>
    )
}

export default MessageCard
