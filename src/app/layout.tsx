"use client"

import AuthProvider from "@/context/AuthProvider";
import { SocketProvider } from "@/context/SocketProvider"; // Import your SocketProvider
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <SocketProvider> {/* Wrap your app with SocketProvider */}
                        {children}
                        <Toaster />
                    </SocketProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
