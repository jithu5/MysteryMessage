// pages/api/suggestions.js
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,  // Your OpenAI API Key
});

export async function POST(req: Request) {
    try {
        // Generate 3 different suggestions based on the prompt
        const prompt = "Give me some random messages."; // Default if no prompt is passed

        const responseStream = new ReadableStream({
            start(controller) {
                // Request completions with streaming enabled
                openai.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'gpt-4o-mini',  // or 'gpt-3.5-turbo'
                    max_tokens: 300,
                    stream: true, // Enable streaming
                })
                    .on('data', (data) => {
                        // On receiving data, enqueue it to the stream
                        controller.enqueue(data);
                    })
                    .on('end', () => {
                        // Close the stream when done
                        controller.close();
                    })
                    .on('error', (err) => {
                        // Handle errors
                        console.error('Error in streaming:', err);
                        controller.error(err);
                    });
            }
        });

        // Return the response as a stream
        return NextResponse.json({ responseStream, success: true, message: "succesfully fetched suggested messages" }, { status: 200 });
    } catch (error) {
        console.error("Error generating suggestions:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to generate suggestions",
            error,
        }, { status: 500 });
    }
}
