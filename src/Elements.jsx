import React from 'react'

export default function Elements() {
    return (
        <div>
            <button class="group flex h-10 items-center gap-2 rounded-full text-black bg-neutral-200 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-black hover:pl-2 hover:text-white active:bg-neutral-700">
                <span class="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
                    <svg class="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
                <span>Hover this link</span>
            </button>
        </div>
    )
}
