"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { IApiResponse } from '@/types/ApiResponse';

function Page() {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (formData: z.infer<typeof verifySchema>) => {
        console.log(formData)
        try {
            const { data } = await axios.post(`/api/verify-code`,
                {
                    username: params.username,
                    code: formData.code
                },
                {
                    withCredentials: true
                }
            )
            if (!data.success) {
                toast({
                    title: "Verification Failed",
                    description: data.message,
                    variant: 'destructive',
                })
                return
            }
            toast({
                title: "Success",
                description: data.message,
                variant: 'default',
            })
            router.replace(`/sign-in`)
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast({
                title: "Verification Error",
                description: axiosError.response?.data.message ?? "Error checking username",
                variant: 'destructive',
            })
        }
    }

    return (
        <>
            <div className='flex justify-center items-center min-h-screen bg-gray-100'>
                <div className='w-full max-w-md space-y-8 bg-white rounded-lg shadow-md'>
                    <div className='text-center'>
                        <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify Your Account</h1>
                        <p className='mb-4'>Enter the verification code sent to your email</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 px-5'>
                            <FormField control={form.control}
                                name='code'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder='veriy code' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' variant={'outline'}>Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Page
