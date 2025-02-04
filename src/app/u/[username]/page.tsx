"use client"
import { useParams } from 'next/navigation'
import React from 'react'

function MessagePage() {
  const {username}= useParams()
  return (
    <>
       {username} 
    </>
  )
}

export default MessagePage
