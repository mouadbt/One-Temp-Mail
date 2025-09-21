import React from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clipboard } from "lucide-react";
import { ResetIcon } from '@radix-ui/react-icons';

const EmailDisplay = ({ email, onCopy, onReset }) => (
    <div className="z-50 flex flex-col items-center justify-center">
        <p className="text-gray-200 text-base sm:text-xl font-medium mb-2">Your temporary email address is:</p>
        <div className="flex items-center gap-4">
            <p className="text-white text-lg sm:text-4xl font-bold" id='EmailAddr'>{email}</p>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger aria-label="Copy email" className='flex items-center justify-center' onClick={onCopy}>
                        <Clipboard className='translate-y-[.1rem] w-5 h-5 sm:w-8 sm:h-8 text-oneColor' />
                    </TooltipTrigger>
                    <TooltipContent className='bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-50 border border-gray-600'>
                        <p>Copy Email address</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <Dialog>
                    <DialogTrigger asChild>
                         <button aria-label="Reset and Generate a New Email Address" className='flex items-center justify-center'>
                            <ResetIcon className='mt-2 sm:-mb-2 w-4 h-4 sm:w-6 sm:h-5 text-oneColor' />
                         </button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-gray-700 max-w-[90%] sm:max-w-md rounded-xl *:text-start">
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription className="pt-4 flex flex-col gap-2 items-start">
                                This action cannot be undone. This will permanently delete this email and remove all the messages.
                                <Button onClick={() => onReset(false)} className="active:translate-y-[2px] py-1 group relative flex items-center overflow-hidden px-8 whitespace-nowrap group gap-1 justify-start rounded-3xl bg-oneColor text-sm transition-colors duration-300 hover:bg-gray-100 active:bg-gray-400  hover:text-black shadow-sm font-medium h-9">
                                    <span className="ease absolute right-0 flex h-9 w-10 translate-x-full transform items-center justify-start duration-300 group-hover:translate-x-0">
                                        <ResetIcon className='w-4 h-4 text-black' />
                                    </span>
                                    <span className="relative transform transition-transform duration-300 group-hover:-translate-x-3 ">Yes Reset</span>
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <TooltipContent className='bg-black/50 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-600'>
                    <p>Reset and Generate a New Email Address</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
);

export default EmailDisplay;