"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SearchAvatarComp from './SearchAvatarComp';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useBoardStore } from '@/store/BoardStore';
import fetchSuggestion from '@/lib/fetchSuggestions';


const Header = () => {
    const [board,] = useBoardStore((state) => [state.board]);

    const [loading, setLoading] = useState<boolean>(false);
    const [suggestion, setSuggestion] = useState<string>("");

    const fetchSuggestionsFunc = async () => {
        const suggestions = await fetchSuggestion(board);
        setSuggestion(suggestions);
        setLoading(false);
    }

    useEffect(() => {
        if (board.columns.size === 0) return;
        setLoading(true);
        // turn on when you have OPENAI Quota.
        // fetchSuggestionsFunc();

    }, [board])


    return (
        <header>
            <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>
                <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 z-[-50]' />
                <Image src="https://links.papareact.com/c2cdd5" alt='Trello Logo' priority width={300} height={100} className='w-44 md:w-56 pb-10 md:pb-0 object-contain' />
                <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
                    <SearchAvatarComp />
                </div>
            </div>

            <div className='flex items-center justify-center px-5 md:py-5 py-2'>
                <p className='flex items-center text-sm font-light p-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]'>
                    <UserCircleIcon className={`${loading && "animate-spin"} inline-block h-10 w-10 mr-1`} />
                    {/* {suggestion && !loading ? suggestion : "GPT is summarising your task for the day... "} */}
                    <span className=' mr-1'>Quota finished for openai</span>
                </p>
            </div>
        </header>
    )
}

export default Header;