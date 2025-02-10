"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

function SignInPage() {
  const [isSubmitting, setisSubmitting] = useState<boolean>(false)


  const router = useRouter()

  const {toast} = useToast()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (formData: z.infer<typeof signInSchema>) => {
    console.log(formData)
    
    setisSubmitting(true)
    const result =  await signIn('credentials',
      {
        redirect:false,
        email: formData.email,
        password: formData.password
      }
    )
    setisSubmitting(false)
    if (result?.error) {
      console.error('Sign in failed', result.error)
      toast({
        title: "Sign In Failed",
        description:result.error,
        variant: 'destructive',
      })
    } 
    if(result?.url) {
      toast({
        title: "Success",
        description: "You have signed in successfully",
        variant: 'default',
      })
      console.log(result)
      router.replace('/')
    }
  }

  return (
    <>
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
          <div className='text-center'>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Mystrey Message</h1>
            <p className='mb-4'>Sign in to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>


                      <Input
                        placeholder="email" {...field}
                      />


                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>


                      <Input
                        placeholder="password" {...field}
                      />


                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' variant={'outline'} className='mt-10'>{isSubmitting?<>
              <Loader2 className='w-4 h-4 animate-spin mr-4'/> Please wait...</>:"Sign In"}</Button>
              
            </form>
          </Form>
          <div className='text-center mt-4'>
            <p>
              Don&apos;t have an Account?{' '}
              <Link href={'/sign-up'} className='text-blue-500 hover:text-blue-700'>Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignInPage
