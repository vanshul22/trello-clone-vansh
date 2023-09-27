"use client";
import { useBoardStore } from '@/store/BoardStore';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import React from 'react'
import Avatar from 'react-avatar';

const Search = () => {
    const [searchString, setSearchString] = useBoardStore((state) => [state.searchString, state.setSearchString]);

    return (
        <>
            {/* Search Bar */}
            <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                <input type="text" className='flex-1 outline-none p-2' placeholder='Search' value={searchString} onChange={e => setSearchString(e.target.value)} />
                <button type='submit' hidden>Search</button>
            </form>
            {/* Avatar */}
            <Avatar name="Foo Bar" round color='#0055D1' size='50' />
        </>
    )
}

export default Search