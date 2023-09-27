import openai from '@/openai/openai';
import { NextResponse } from 'next/server'


export async function POST(request: Request) {
    // Todos in the body of POST req.
    const { todos } = await request.json();
    // console.log(todos);

    // Communicate with openAI GPT.

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        // Only get 1 response from n.
        n: 1,
        stream: false,
        messages: [
            {
                role: "system",
                content: `When responding, Welcome the user always as Mr. Vanshul and say welcome to Trello Clone App!!!. 
                Limit the response to 200 characters.`
            },
            {
                role: "user",
                content: `Hi there, provide the summary of the following todos. Count how many todos are in each category such as To Do, In progress and Done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(todos)}`
            },
        ]
    });
    const { choices } = response;

    // console.log("data is", choices)
    // console.log(choices[0].message)
    return NextResponse.json(choices[0].message);

}