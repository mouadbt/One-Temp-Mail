import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getDomains, createAccount, getToken, getMessages, getMessageContentById } from './APICorsFunctions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
export default function Email() {
    const { toast } = useToast()
    const [email, setEmail] = useState(
        sessionStorage.getItem('email') || ''
    );
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState(
        sessionStorage.getItem('token') || ''
    );
    const [ErrorMessage, setErrorMessage] = useState('');
    const [ErrorEmail, setErrorEmail] = useState(false);
    const [userNameError, setuserNameError] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [domains, setDomains] = useState(
        JSON.parse(sessionStorage.getItem('domains')) || []
    );
    const [messages, setMessages] = useState(
        JSON.parse(sessionStorage.getItem('messages')) || []
    );
    const [messagesReady, setMessagesReady] = useState(false);
    const [messagesContent, setMessagesContent] = useState('');
    const [seenMessages, setSeenMessages] = useState([]);


    useEffect(() => {
        fetchDomains();
    }, []);
    const fetchDomains = async () => {
        const fetchedDomains = await getDomains();
        setDomains(fetchedDomains);
        sessionStorage.setItem('domains', JSON.stringify(fetchedDomains));
    };

    const handleCreateAccount = () => {
        setErrorEmail(false);
        setisLoading(true);
        const regex = /^[a-zA-Z0-9_]{4,16}$/;
        if (regex.test(userName)) {
            setuserNameError(false);
            createAccountAndGenerateEmail();
        } else {
            setuserNameError(true);
            setisLoading(false);
        }
    }

    const createAccountAndGenerateEmail = async () => {
        try {
            if (domains.length > 0) {
                const randomDomain = domains[Math.floor(Math.random() * domains.length)].domain;
                const emailV = userName + '@' + randomDomain;
                const passwordVal = generatePassword();
                const res = await createAccount(emailV, passwordVal);
                setEmail(res.address);
                const token = await getToken(res.address, passwordVal);
                setToken(token);
                sessionStorage.setItem('email', res.address);
                sessionStorage.setItem('token', token);
                setTimeout(clearSessionStorage, 3600000);
            } else {
                console.error('');
                setErrorEmail(true);
                setErrorMessage('No domains available, please try later.');
            }
            setisLoading(false);
        } catch (error) {
            setisLoading(false);
            setErrorEmail(true);
            setErrorMessage("Error, change your user name and try again.");
        }
    }

    const clearSessionStorage = () => {
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('messages');
    };

    useEffect(() => {
        if (token) {
            handleFetchMessages();
            const intervalId = setInterval(handleFetchMessages, 1000);
            return () => clearInterval(intervalId);
        }
    }, [token]);


    const handleFetchMessages = async () => {
        try {
            if (token) {
                const messagesVal = await getMessages(token);
                setMessages(messagesVal);
                sessionStorage.setItem('messages', JSON.stringify(messagesVal));
                setMessagesReady(true);
            } else {
                console.error('No token available.');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleFetchMessageContent = async (id) => {
        try {
            const content = await getMessageContentById(id, token);
            setMessagesContent(content);
            const seenMsgs = seenMessages;
            seenMsgs.push(id);
            setSeenMessages(seenMsgs);
            sessionStorage.setItem('seenMessages', JSON.stringify(seenMessages));
        } catch (error) {
            console.error('Error fetching message content:', error);
        }
    };

    const generatePassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
        setuserNameError(false);
        setMessagesReady(false);
    }

    const PreventSend = (e) => {
        e.preventDefault();
    }

    const CopyEmail = () => {
        navigator.clipboard.writeText(email);
        toast({
            title: "email address is copied to clipboard",
            description: "Email address is ready to use",
        })
    }

    return (
        <section className="relative main w-full min-h-screen flex pt-[14%] sm:pt-[8%] flex-col items-center gap-2">
            <div className="z-0 bg-container w-full absolute h-full -top-[10%] left-0 flex justify-center items-start">
                <div className="bg z-0"></div>
            </div>
            <h1 className="w-[90%] text-white z-50 text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                One Temp Mail <br />
                Temporary Email Service
            </h1>
            <span className="text-gray-400 z-50 max-w-[750px] w-[90%] text-center text-lg font-light text-foreground my-6" >
                Generate temporary email addresses for testing and privacy. Easily create, manage, and monitor your temp emails using our intuitive dashboard.
            </span>
            <form href="#" onSubmit={(e) => { PreventSend(e) }} className="flex gap-4 z-50 max-w-[90%] flex-wrap sm:flex-nowrap">
                <Input
                    placeholder='Enetr user name here'
                    value={userName}
                    onChange={handleUserNameChange}
                    className={`text-white rounded-3xl ${(userNameError || ErrorEmail) ? '!border-red-500' : ''}`}
                />
                <Button className='text-white border-none rounded-3xl min-w-48 w-full bg-[#7808ff]' variant="outline" onClick={handleCreateAccount} disabled={isLoading}>
                    {isLoading ? (
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="20"><g><circle strokeLinecap="round" fill="none" strokeDasharray="50.26548245743669 50.26548245743669" stroke="#000000" strokeWidth="8" r="32" cy="50" cx="50">
                            <animateTransform values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform" />
                        </circle><g /></g></svg>
                    ) : (
                        "Create Temporary Email"
                    )}
                </Button>
            </form>
            {userNameError && (
                <p className="text-red-500 text-sm mt-2">Username should be 4-16 characters long and contain only alphanumeric characters and underscores.</p>
            )}
            {ErrorEmail && (
                <p className="text-red-500 text-sm mt-2">{ErrorMessage}</p>
            )}
            {
                email && (
                    <div className="z-50 flex flex-col items-center justify-center mt-4">
                        <p className="text-gray-200 text-base sm:text-2xl font-medium mb-2">Your temporary email address is:</p>
                        <div className="flex items-center gap-4">
                            <p className="text-white text-xl sm:text-4xl font-bold" id='EmailAddr'>{email}</p>
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger aria-label="Copy email" onClick={CopyEmail}>
                                        <svg width='32' className='z-50 copySvg' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#7808ff" strokeWidth="1.5" data-darkreader-inline-stroke=""></path> <path opacity="0.5" d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#7808ff" strokeWidth="1.5" data-darkreader-inline-stroke=""></path> </g></svg>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className='bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-50 border border-gray-600'
                                    >
                                        <p >Copy Email address</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </div>
                    </div>
                )
            }
            <div className='border border-gray-700 z-40 w-[90%] mx-auto bgshadow mt-12 my-10 rounded-3xl p-8'>
                <h1 className='text-white text-2xl'>Inbox</h1>
                <hr className='border-gray-700 mb-2' />
                {messages.length > 0 ? (
                    <div>
                        {/* <h2>Messages:</h2> */}
                        <Accordion type="single" collapsible>
                            {messages.map(message => (
                                <AccordionItem value={message['@id']} key={message['@id']}>
                                    <AccordionTrigger onClick={() => handleFetchMessageContent(message.id)} className={`text-white text-start flex justify-between w-full items-center p-2 px-4  my-1 ${seenMessages.includes(message.id) ? '' : 'border-l-8 rounded border-[#7808ff]'}`}>
                                        <div>
                                            <div className="flex gap-2">
                                                <h3 >{message.from.name}</h3>
                                                {
                                                    seenMessages.includes(message.id) ? (
                                                        null
                                                    ) : <Badge className='rounded-xl bg-[#7808ff] text-[11px] px-2 leading-[0.55rem] h-min py-1'>New</Badge>
                                                }
                                            </div>
                                            <p className='font-light text-gray-300 '>{message.from.address}</p>
                                        </div>
                                        <div>
                                            <span className='font-light '>
                                                {message.subject}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='text-white px-4'>
                                        <section
                                            className='p-o m-0 bg-transparent w-full emailsContent'
                                            dangerouslySetInnerHTML={
                                                { __html: messagesContent.html }
                                            }
                                        ></section>

                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )
                    : (
                        <div className="flex flex-col h-full w-full items-center justify-center">

                            <div className="relative flex justify-center items-center min-h-[150px]">
                                <svg width='70px' className='absolute' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M10.5 22V20M14.5 22V20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M11 20V20.75H11.75V20H11ZM14 19.25C13.5858 19.25 13.25 19.5858 13.25 20C13.25 20.4142 13.5858 20.75 14 20.75V19.25ZM17.5 5.25C17.0858 5.25 16.75 5.58579 16.75 6C16.75 6.41421 17.0858 6.75 17.5 6.75V5.25ZM7 5.25C6.58579 5.25 6.25 5.58579 6.25 6C6.25 6.41421 6.58579 6.75 7 6.75V5.25ZM9 19.25C8.58579 19.25 8.25 19.5858 8.25 20C8.25 20.4142 8.58579 20.75 9 20.75V19.25ZM15 20.75C15.4142 20.75 15.75 20.4142 15.75 20C15.75 19.5858 15.4142 19.25 15 19.25V20.75ZM10.25 11.25V20H11.75V11.25H10.25ZM11 19.25H4.23256V20.75H11V19.25ZM2.75 17.3953V11.25H1.25V17.3953H2.75ZM4.23256 19.25C3.51806 19.25 2.75 18.5323 2.75 17.3953H1.25C1.25 19.1354 2.48104 20.75 4.23256 20.75V19.25ZM6.5 6.75C8.46677 6.75 10.25 8.65209 10.25 11.25H11.75C11.75 8.04892 9.50379 5.25 6.5 5.25V6.75ZM6.5 5.25C3.49621 5.25 1.25 8.04892 1.25 11.25H2.75C2.75 8.65209 4.53323 6.75 6.5 6.75V5.25ZM21.25 11.25V17.4253H22.75V11.25H21.25ZM19.7931 19.25H14V20.75H19.7931V19.25ZM21.25 17.4253C21.25 18.5457 20.4934 19.25 19.7931 19.25V20.75C21.5305 20.75 22.75 19.1488 22.75 17.4253H21.25ZM22.75 11.25C22.75 8.04892 20.5038 5.25 17.5 5.25V6.75C19.4668 6.75 21.25 8.65209 21.25 11.25H22.75ZM7 6.75H18V5.25H7V6.75ZM9 20.75H15V19.25H9V20.75Z" fill="#ffffff"></path> <path d="M5 16H8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M16 9.88432V5.41121M16 5.41121V2.63519C16 2.39905 16.1676 2.19612 16.3994 2.15144L16.8855 2.05779C17.4738 1.94443 18.0821 1.99855 18.6412 2.214L18.7203 2.24451C19.2746 2.4581 19.8807 2.498 20.4582 2.35891C20.7343 2.2924 21 2.50168 21 2.78573V5.00723C21 5.2442 20.8376 5.45031 20.6073 5.5058L20.5407 5.52184C19.9095 5.67387 19.247 5.63026 18.6412 5.39679C18.0821 5.18135 17.4738 5.12722 16.8855 5.24058L16 5.41121Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                                <svg width="180"
                                    className={`absolute transition-all ${messagesReady ? 'opacity-100' : 'opacity-0'}`}
                                    xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g><circle strokeLinecap="round" fill="none" strokeDasharray="50.26548245743669 50.26548245743669" stroke="#fff" strokeWidth="2" r="32" cy="50" cx="50">
                                        <animateTransform values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform" />
                                    </circle><g /></g>
                                </svg>
                            </div>
                            <h2 className='text-white text-xl'>
                                {
                                    messagesReady ? (
                                        <span>Waiting for incoming emails</span>
                                    ) :
                                        (
                                            <span>Inbox is empty</span>
                                        )
                                }
                            </h2>
                            <h3 className='text-gray-500 text-lg'>
                                {
                                    messagesReady ? (
                                        <span>This operation is performed automatically</span>
                                    ) :
                                        (
                                            <span>Enter your username and create your temporary email</span>
                                        )
                                }
                            </h3>

                        </div>
                    )}
            </div>
            <Toaster
                className='bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-50 border border-gray-600'
            />
        </section>
    )
}
