import React from 'react';
import { Button } from './ui/button';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MailOpen } from "lucide-react";
import { InfoCircledIcon } from '@radix-ui/react-icons';

const EmailCreationFlow = ({
    isNameSelected, isFormVisible, domains, name, customEmail,
    createNameAccount, setCustomEmail, setUserName, checkNameValidaty,
    beforeRandomEmailGenration, beforeShowForm
}) => {
    if (isNameSelected) {
        return (
            <form action="#" onSubmit={createNameAccount} className='mx-auto *:w-full sm:w-1/2 md:max-w-1/4 flex gap-4 flex-col items-stretch justify-center sm:flex-row'>
                <Select onValueChange={(value) => setCustomEmail(value)}>
                    <SelectTrigger className="w-full sm:w-[180px] rounded-full border-oneColor text-center">
                        <SelectValue placeholder="Choose Email" className='text-center' />
                    </SelectTrigger>
                    <SelectContent className="bg-[#090A0F] text-white rounded-3xl border-gray-700 [&_.option]:rounded-full [&_.option]:hover:bg-gray-900 [&_.option]:hover:text-white">
                        {domains.map((domain) => (
                            <SelectItem key={domain.domain} className="option" value={`${name}@${domain.domain}`}>
                                {`${name}@${domain.domain}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button disabled={!customEmail} type="submit" className="w-full sm:w-fit justify-center active:translate-y-[2px] py-1 group relative flex items-center overflow-hidden px-12 whitespace-nowrap group gap-1 sm:justify-start rounded-3xl bg-oneColor text-sm transition-colors duration-300 hover:bg-gray-100 active:bg-gray-400  hover:text-black shadow-sm font-medium h-9">
                    <span className="ease absolute right-0 flex h-9 w-10 translate-x-full transform items-center justify-start duration-300 group-hover:translate-x-0 group-active:-rotate-45 group-active:-translate-y-2 group-active:-translate-x-1">
                        <svg width='1em' height='1em' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                    <span className="relative transform transition-transform duration-300 -translate-x-2 group-hover:-translate-x-3 ">Create Email</span>
                </Button>
            </form>
        );
    }

    if (isFormVisible) {
        return (
            <>
                <form action="#" onSubmit={setUserName} className='w-full sm:w-1/2 lg:w-1/3 mx-auto flex gap-4 flex-wrap items-stretch sm:flex-nowrap'>
                    <Input value={name} onChange={checkNameValidaty} className='rounded-full border-oneColor' placeholder="enter your name" />
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger aria-label="note" className='hidden -ml-10 sm:flex items-center justify-center'>
                                <InfoCircledIcon className='w-4 h-4 text-white' />
                            </TooltipTrigger>
                            <TooltipContent className='bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-50 border border-gray-600 max-w-60 text-center'>
                                <p>Choose a unique username for your temporary email. Avoid common names, brands, or well-known words</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button disabled={!name} type="submit" className="w-full sm:w-fit justify-center active:translate-y-[2px] py-1 group relative flex items-center overflow-hidden px-12 whitespace-nowrap group gap-2 sm:justify-start rounded-3xl bg-oneColor text-sm transition-colors duration-300 hover:bg-gray-100 active:bg-gray-400  hover:text-black shadow-sm font-medium h-9">
                        <span className="ease absolute right-0 flex h-9 w-10 translate-x-full transform items-center justify-start duration-300 group-hover:translate-x-0 group-active:-rotate-45 group-active:-translate-y-2 group-active:-translate-x-1">
                            <svg width='1em' height='1em' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                        <span className="relative transform transition-transform duration-300 -translate-x-2 group-hover:-translate-x-3 ">Next</span>
                    </Button>
                </form>
                <p className='text-xs text-center max-w-sm mx-auto mt-2 -mb-6 text-gray-400 z-50'>
                    Choose a unique username for your temporary email. Avoid common names, brands, or well-known words
                </p>
            </>
        );
    }

    return (
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-center items-center z-50'>
            <button onClick={beforeRandomEmailGenration} className='w-[80%] sm:w-fit justify-center active:translate-y-[2px] whitespace-nowrap group flex pl-2 gap-2 items-center sm:justify-start rounded-3xl bg-oneColor py-3 px-4 text-sm transition-all duration-300 hover:bg-white active:bg-gray-400  hover:text-black shadow-sm font-medium h-10'>
                <span className='aspect-square p-1 bg-white rounded-full text-sm group-active:bg-gray-400 transition-colors duration-300'>
                    <MailOpen className='text-black text-[0px] w-0 h-0 -translate-y-[1px] group-hover:w-5 group-hover:h-5 group-active:scale-75 group-hover:text-lg group-hover:translate-x-0 transition-all duration-300' />
                </span>
                <span>Random Email</span>
            </button>
            <span>or</span>
            <button onClick={beforeShowForm} className='w-[80%] sm:w-fit justify-center active:translate-y-[2px] whitespace-nowrap group flex pl-2 gap-2 items-center sm:justify-start rounded-3xl border border-oneColor py-3 px-4 text-sm transition-all duration-300 hover:bg-gray-100 active:bg-gray-400 hover:border-transparent hover:text-black shadow-sm font-medium h-10'>
                <span className='aspect-square p-1 bg-white rounded-full text-sm group-hover:bg-black transition-colors duration-300'>
                    <svg className='text-[0px] -translate-x-[200%] group-active:-rotate-45 group-hover:text-lg group-hover:translate-x-0 transition-all duration-300' width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </span>
                <span>Choose a name and domain</span>
            </button>
        </div>
    );
};

export default EmailCreationFlow;