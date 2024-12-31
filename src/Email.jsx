import React, { useEffect, useState, useRef } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './components/ui/button'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Toaster, toast } from 'sonner'
import { Mail, Loader2, Loader2Icon, LucideLoader, LucideLoaderCircle, LucideLoaderPinwheel, MailOpen, TrainTrack, ClipboardIcon, Clipboard } from "lucide-react"
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { getDomains, createAccount, getToken, getMessages, getMessageContentById } from './functions';
import { ClipboardCopyIcon, InfoCircledIcon, ResetIcon } from '@radix-ui/react-icons'
export default function Email() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isNameSelected, setIsNameSelected] = useState(false);
    const [name, setName] = useState('');
    const [isRandomemail, setIsRandomEmail] = useState(null);
    const [domains, setDomains] = useState(() => {
        return JSON.parse(sessionStorage.getItem('emailData'))?.domains || [];
    });
    const [email, setEmail] = useState(() => {
        return JSON.parse(sessionStorage.getItem('emailData'))?.email || '';
    });
    const [token, setToken] = useState(() => {
        return JSON.parse(sessionStorage.getItem('emailData'))?.token || '';
    });
    const [messages, setMessages] = useState(() => {
        return JSON.parse(sessionStorage.getItem('emailData'))?.messages || [];
    });
    const [seenMessages, setSeenMessages] = useState(() => {
        return JSON.parse(sessionStorage.getItem('emailData'))?.seenMessages || [];
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const recaptchaSecretKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
    const [messagesContent, setMessagesContent] = useState('');
    const [customEmail, setCustomEmail] = useState('');
    const [messagesReady, setMessagesReady] = useState(() => {
        return JSON.parse(sessionStorage.getItem('emailData'))?.email ? true : false
    });

    // Sets up click listener for handling links to open in new tab
    useEffect(() => {
        document.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                event.target.target = '_blank';
            }
        });
        return () => {
            document.removeEventListener('click', () => { });
        };
    }, []);

    // Fetches available email domains on component mount 
    useEffect(() => {
        fetchDomains();
    }, [])

    // Domain Fetching - Called by initial useEffect
    const fetchDomains = async () => {
        const fetchedDomains = await getDomains();
        setDomains(fetchedDomains);
        setSessionStorage(fetchedDomains);
    };

    // set session storage
    function setSessionStorage(fetchedDomainsF) {
        if (!JSON.parse(sessionStorage.getItem('emailData'))) {
            sessionStorage.setItem('emailData', JSON.stringify({ domains: [], seenMessages: [], messages: [], message: '', email: '', token: '' }));
        }
        updateSessionStorage('domains', fetchedDomainsF);
    }

    // update sessionstorage
    function updateSessionStorage(key, value) {
        const prevData = JSON.parse(sessionStorage.getItem('emailData'));
        prevData[key] = value;
        sessionStorage.setItem('emailData', JSON.stringify(prevData));
    }

    // User Interface Triggers - Called by UI interactions
    function beforeShowForm() {
        setIsRandomEmail(false);
        handleDrawerStateChange(true);
    }
    function beforeRandomEmailGenration() {
        setIsRandomEmail(true);
        handleDrawerStateChange(true);
    }

    // Validates name input in real-time using regex
    function checkNameValidaty(e) {
        const nameRegex = /^[a-z]*[a-z\d]*$/;
        if (nameRegex.test(e.target.value)) {
            setName(e.target.value);
        }
    }

    // Finalizes username selection if valid
    function setUserName(e) {
        e.preventDefault();
        const nameRegex = /^[a-z]*[a-z\d]*$/;
        if (nameRegex.test(name) & name.length > 0) {
            setIsNameSelected(true);
        }
    }

    // Controls the drawer's open/closed state
    function handleDrawerStateChange(open) {
        setIsDrawerOpen(open);
    }

    // Handles successful verification and triggers email generation
    function handleVerificationSuccess(token) {
        if (token) {
            if (isRandomemail) {
                setIsDrawerOpen(false);
                beforeGeneration();
            } else {
                setIsDrawerOpen(false);
                beforeGeneration();
            }
        } else {
            setIsFormVisible(false);
        }
    }

    // Determines whether to generate random email or show form
    function beforeGeneration() {
        if (isRandomemail) {
            generateRandomName();
        } else {
            setIsFormVisible(true);
        }
    }

    // Random Generation Functions
    function generateRandomName() {
        // Generates random username for email
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let namestr = '';
        for (var i = 0; i < 6; i++) {
            namestr += characters.charAt((Math.random() * (characters.length - 1) + 1).toFixed(0))
        }
        createRandomAccount(namestr);
    }

    function generatePassword() {
        // Generates random password for the account
        const charactersForPss = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/.,][-+_)(**&^%$##@!abcdefghijklmnopqrstuvwxyz0123456789';
        let ps = '';
        for (var i = 0; i < 25; i++) {
            ps += charactersForPss.charAt(Math.floor(Math.random() * (charactersForPss.length)));
        }
        return ps;
    }

    // Account Creation Flow
    function createRandomAccount(name) {
        // Creates email using random name and domain
        const randomEmail = `${name}@${domains[Math.floor(Math.random() * domains.length)].domain}`;
        const thePassaword = generatePassword();
        createAccountAndGenerateEmail(randomEmail, thePassaword);
    }

    function createNameAccount() {
        const the_Passaword = generatePassword();
        createAccountAndGenerateEmail(customEmail, the_Passaword);
    }

    const createAccountAndGenerateEmail = async (the_email, the_password) => {
        // Creates account with generated email and password
        try {
            const res = await createAccount(the_email, the_password);
            retrieveToken(res.data.address, the_password);
        } catch (error) {
            console.log(error)
            // setMessagesReady(false);
            // setIsFormVisible(false);
            resetEmail(true);
            toast.error("Failed to create account. Please try again.", {
                className: 'toast error text-red-500 !bg-white border-red-800 [&>button]:border-red-800 [&>button]:!bg-white [&>button]:transition-all',
            });
        }
    }

    // Token Retrieval Flow
    const retrieveToken = async (address, pss) => {
        try {
            const r_token = await getToken(address, pss);
            updateSessionStorage('email', address);
            updateSessionStorage('token', r_token);
            setEmail(address);
            setToken(r_token);
            setMessagesReady(true);
            toast.success("Temp email created successfully", {
                className: 'toast !bg-oneColor border-[#4b00c4] [&>button]:border-[#4b00c4] [&>button]:!bg-oneColor [&>button]:transition-all',
            });
        } catch (error) {
            toast.error("Failed to create account. Please try again.", {
                className: 'toast error text-red-500 !bg-white border-red-800 [&>button]:border-red-800 [&>button]:!bg-white [&>button]:transition-all',
            });
        }
    }

    // Sets up interval to check for new messages
    useEffect(() => {
        const messagesInterval = setInterval(retrieveMessages, 10000);
        return () => clearInterval(messagesInterval);
    }, [token]);

    // Fetches messages periodically if token exists
    const retrieveMessages = async () => {
        if (token) {
            const messagesVal = await getMessages(token);
            setMessages(messagesVal);
            updateSessionStorage('messages', messagesVal);
        }
    }

    // Message Content Handling
    const handleFetchMessageContent = async (id) => {
        try {
            const content = await getMessageContentById(id, token);
            setMessagesContent(content);
            const seenMsgs = seenMessages;
            seenMsgs.push(id);
            setSeenMessages(seenMsgs);
            updateSessionStorage('seenMessages', seenMessages);
        } catch (error) {
            console.error('Error fetching message content:', error);
            toast.error("Failed to get email content. Please try again.", {
                className: 'toast error text-red-500 !bg-white border-red-800 [&>button]:border-red-800 [&>button]:!bg-white [&>button]:transition-all',
            });
        }
    }

    // Copy email to clipBoard
    const CopyEmail = () => {
        navigator.clipboard.writeText(email);
        toast.success("Email address is copied to clipboard", {
            className: 'toast !bg-oneColor border-[#4b00c4] [&>button]:border-[#4b00c4] [&>button]:!bg-oneColor [&>button]:transition-all',
        });
    }

    // reset everything
    const resetEmail = (error) => {
        setEmail('');
        setToken('');
        setMessages([]);
        setMessagesContent('');
        setSeenMessages([]);
        setMessagesReady(false);
        setIsFormVisible(false);
        setCustomEmail("");
        setIsNameSelected('');
        setName('');
        const prevData = JSON.parse(sessionStorage.getItem('emailData'));
        const tempDomains = prevData?.domains;
        sessionStorage.setItem('emailData', JSON.stringify({ domains: tempDomains }));
        if (!error) {
            toast.success("Your previous temporary email has been reset. You can now generate a new one.", {
                className: 'toast !bg-oneColor border-[#4b00c4] [&>button]:border-[#4b00c4] [&>button]:!bg-oneColor [&>button]:transition-all',
            });
        }
    }

    return (
        <section
            className={`main relative w-full min-h-screen flex px-[5%] pb-[2%] sm:pb-0 flex-col items-center justify-between gap-2 ${email ? 'pt-[6%]' : 'pt-[10%]'}`}
        >
            {/* Gradiant shap at top */}
            <div className="bg z-0 w-full"></div>

            <div className="noise absolute w-full h-full inset-0 opacity-15"></div>

            {/* Container of title and form */}
            <div className='hero z-40 w-full'>
                <h1 className="text-white text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                    One Temp Mail <br />Temporary Email Service
                </h1>
                <span className="block mx-auto text-gray-400 max-w-[750px] text-center text-lg font-light text-foreground my-6 ">
                    Generate temporary email addresses for testing and privacy. Easily create, manage, and monitor your temp emails using our intuitive dashboard.
                </span>

                {/* ___________________________________________  Email created  */}
                {
                    email ? (
                        <div className="z-50 flex flex-col items-center justify-center">
                            <p className="text-gray-200 text-base sm:text-xl font-medium mb-2">Your temporary email address is:</p>
                            <div className="flex items-center gap-4">
                                <p className="text-white text-xl sm:text-4xl font-bold" id='EmailAddr'>{email}</p>
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger aria-label="Copy email" className='flex items-center justify-center' onClick={CopyEmail}>
                                            {/* <ClipboardCopyIcon className='translate-y-1 w-5 h-5 sm:w-8 sm:h-8 text-oneColor' /> */}
                                            <Clipboard className='translate-y-[.1rem] w-5 h-5 sm:w-8 sm:h-8 text-oneColor' />
                                            {/* <svg width='32' className='z-50 copySvg' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#7808ff" strokeWidth="1.5" data-darkreader-inline-stroke=""></path> <path opacity="0.5" d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#7808ff" strokeWidth="1.5" data-darkreader-inline-stroke=""></path> </g></svg> */}
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className='bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-50 border border-gray-600'
                                        >
                                            <p >Copy Email address</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger aria-label="Reset and Generate a New Email Address" className=' flex items-center justify-center'>

                                        <Dialog>
                                            <DialogTrigger>
                                                <ResetIcon className='mt-2 sm:-mb-2 w-4 h-4 sm:w-6 sm:h-5 text-oneColor' />
                                            </DialogTrigger>
                                            <DialogContent className="bg-black border-gray-700 max-w-[90%] sm:max-w-md rounded-xl *:text-start">
                                                <DialogHeader>
                                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                    <DialogDescription className="pt-4 flex flex-col gap-2 items-start">
                                                        This action cannot be undone. This will permanently delete this email
                                                        and remove all the messages.
                                                        <Button
                                                            onClick={() => resetEmail(false)}
                                                            className="active:translate-y-[2px] py-1 group relative flex items-center overflow-hidden px-8 whitespace-nowrap group gap-1 justify-start rounded-3xl bg-oneColor text-sm transition-colors duration-300 hover:bg-gray-100 active:bg-gray-400  hover:text-black shadow-sm font-medium h-9">
                                                            <span
                                                                className="ease absolute right-0 flex h-9 w-10 translate-x-full transform items-center justify-start duration-300 group-hover:translate-x-0">
                                                                <ResetIcon className='w-4 h-4 text-black' />
                                                            </span>
                                                            <span className="relative transform transition-transform duration-300 group-hover:-translate-x-3 ">Yes Reset</span>
                                                        </Button>
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>

                                    </TooltipTrigger>
                                    <TooltipContent
                                        className='bg-black/50 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-600'
                                    >
                                        <p >Reset and Generate a New Email Address</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ) :
                        //  ___________________________________________  select the domain
                        isNameSelected ? (
                            <>
                                <form action="#" onSubmit={createNameAccount} className='mx-auto *:w-full sm:w-1/2 md:max-w-1/4 flex gap-4 flex-col items-stretch justify-center sm:flex-row'>
                                    <Select
                                        onValueChange={(value) => setCustomEmail(value)}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px] rounded-full border-oneColor text-center">
                                            <SelectValue placeholder="Choose Email" className='text-center' />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#090A0F] text-white rounded-3xl border-gray-700 [&_.option]:rounded-full [&_.option]:hover:bg-gray-900 [&_.option]:hover:text-white">
                                            {
                                                domains.map((domain) => {
                                                    const domainName = domain.domain
                                                    return (
                                                        <SelectItem key={domainName} className="option" value={`${name}@${domainName}`}>
                                                            {`${name}@${domainName}`}
                                                        </SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        disabled={!customEmail}
                                        type="submit"
                                        className="w-full sm:w-fit justify-center active:translate-y-[2px] py-1 group relative flex items-center overflow-hidden px-12 whitespace-nowrap group gap-1 sm:justify-start rounded-3xl bg-oneColor text-sm transition-colors duration-300 hover:bg-gray-100 active:bg-gray-400  hover:text-black shadow-sm font-medium h-9">
                                        <span
                                            className="ease absolute right-0 flex h-9 w-10 translate-x-full transform items-center justify-start duration-300 group-hover:translate-x-0 group-active:-rotate-45 group-active:-translate-y-2 group-active:-translate-x-1">
                                            <svg width='1em' height='1em' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </span>
                                        <span className="relative transform transition-transform duration-300 -translate-x-2 group-hover:-translate-x-3 ">Create Email</span>
                                    </Button>
                                </form>
                            </>
                        ) :
                            //  ___________________________________________  choose email way
                            isFormVisible ? (
                                //  ___________________________________________  type the name 
                                <>
                                    <form action="#" onSubmit={setUserName} className='w-full sm:w-1/2 lg:w-1/3 mx-auto flex gap-4 flex-wrap items-stretch sm:flex-nowrap'>
                                        <Input value={name} onChange={(e) => { checkNameValidaty(e) }} className='rounded-full border-oneColor' placeholder="enter your name" />

                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger aria-label="note" className='hidden -ml-10 sm:flex items-center justify-center'>
                                                    <InfoCircledIcon className='w-4 h-4 text-white' />
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    className='bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-50 border border-gray-600 max-w-60 text-center'
                                                >
                                                    <p>
                                                        Choose a unique username for your temporary email. Avoid common names, brands, or well-known words
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Button
                                            disabled={!name}
                                            type="submit"
                                            className="w-full sm:w-fit justify-center active:translate-y-[2px] py-1 group relative flex items-center overflow-hidden px-12 whitespace-nowrap group gap-2 sm:justify-start rounded-3xl bg-oneColor text-sm transition-colors duration-300 hover:bg-gray-100 active:bg-gray-400  hover:text-black shadow-sm font-medium h-9">
                                            <span
                                                className="ease absolute right-0 flex h-9 w-10 translate-x-full transform items-center justify-start duration-300 group-hover:translate-x-0 group-active:-rotate-45 group-active:-translate-y-2 group-active:-translate-x-1">
                                                <svg width='1em' height='1em' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            </span>
                                            <span className="relative transform transition-transform duration-300 -translate-x-2 group-hover:-translate-x-3 ">Next</span>
                                        </Button>
                                    </form>
                                    <p className='text-xs text-center max-w-sm mx-auto mt-2 -mb-6 text-gray-400 z-50'>
                                        Choose a unique username for your temporary email. Avoid common names, brands, or well-known words
                                    </p>
                                </>
                            ) : (
                                //  ___________________________________________  choose email way
                                <>
                                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-center items-center z-50'>
                                        <button
                                            onClick={beforeRandomEmailGenration}
                                            className='w-[80%] sm:w-fit justify-center active:translate-y-[2px] whitespace-nowrap group flex pl-2 gap-2 items-center sm:justify-start rounded-3xl bg-oneColor py-3 px-4 text-sm transition-all duration-300 hover:bg-white active:bg-gray-400  hover:text-black shadow-sm font-medium h-10'>
                                            <span className='aspect-square p-1 bg-white rounded-full text-sm group-active:bg-gray-400 transition-colors duration-300'>
                                                <MailOpen
                                                    className='text-black text-[0px] w-0 h-0 -translate-y-[1px] group-hover:w-5 group-hover:h-5 group-active:scale-75 group-hover:text-lg group-hover:translate-x-0 transition-all duration-300'
                                                />
                                            </span >
                                            <span>
                                                Random Email
                                            </span>
                                        </button >
                                        <span>or</span>
                                        <button
                                            onClick={beforeShowForm}
                                            className='w-[80%] sm:w-fit justify-center active:translate-y-[2px] whitespace-nowrap group flex pl-2 gap-2 items-center sm:justify-start rounded-3xl border border-oneColor py-3 px-4 text-sm transition-all duration-300 hover:bg-gray-100 active:bg-gray-400 hover:border-transparent hover:text-black shadow-sm font-medium h-10'>
                                            <span className='aspect-square p-1 bg-white rounded-full text-sm group-hover:bg-black transition-colors duration-300'>
                                                <svg className='text-[0px] -translate-x-[200%] group-active:-rotate-45 group-hover:text-lg group-hover:translate-x-0 transition-all duration-300' width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                            </span>
                                            <span>
                                                Choose a name and domain
                                            </span>
                                        </button>
                                    </div >
                                </>
                            )
                }

            </div>

            <Drawer
                open={isDrawerOpen}
                onOpenChange={handleDrawerStateChange}
            >
                <DrawerContent className="bgshadowLight bg-black md:px-[35%] mx-auto border-gray-700">
                    <DrawerHeader className="[&>*]:text-center pt-8">
                        <DrawerTitle>Verify you're human</DrawerTitle>
                        <DrawerDescription>Please complete the captcha to continue</DrawerDescription>
                    </DrawerHeader>
                    <div className="captcha px-4 py-8 flex justify-center">
                        <HCaptcha
                            sitekey={recaptchaSecretKey}
                            onVerify={(token) => handleVerificationSuccess(token)}
                            theme="dark"
                        />
                    </div>
                    <DrawerFooter>
                        <DrawerClose
                            className="w-min mx-auto text-gray-300 border border-t-0 border-r-0 border-l-0 border-b-transparent hover:border-b-gray-300"
                        >
                            Cancel
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* ___________________________________________ Inbox container */}
            <div className="w-full flex flex-col items-stretch justify-start border border-gray-700 z-20 m-0 bgshadow mt-8 rounded-3xl p-8 min-h-60">
                <h1 className="text-white text-2xl select-none">Inbox</h1>
                <hr className="border-gray-700 mb-2" />
                {messages.length > 0 ? (
                    <div className=''>
                        <Accordion type="single" collapsible>
                            {messages.map(message => (
                                <AccordionItem value={message['@id']} key={message['@id']} className=' '>
                                    <AccordionTrigger onClick={() => handleFetchMessageContent(message.id)} className={`text-white text-start flex flex-wrap md:flex-nowrap justify-between w-full items-center p-2 px-4  my-1 ${seenMessages.includes(message.id) ? '' : 'border-l-8 rounded border-[#7808ff]'}`}>
                                        <div className='w-full md:w-fit mb-2 md:mb-0'>
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
                                        <div className=''>
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
                            <h2 className='text-white text-xl font-bold'>
                                {
                                    messagesReady ? (
                                        <span>Waiting for incoming emails</span>
                                    ) :
                                        (
                                            <span>Inbox is empty</span>
                                        )
                                }
                            </h2>
                            <h3 className='text-gray-500 text-lg font-light text-center'>
                                {
                                    messagesReady ? (
                                        <span>This operation is performed automatically</span>
                                    ) :
                                        (
                                            <span className='inline-block text-center'>
                                                {isFormVisible ? (
                                                    <span className='inline-block text-center'>
                                                        Enter your username and create your temporary email
                                                    </span>
                                                ) : (
                                                    <span className='inline-block text-center'>
                                                        Generate a random email or enter a username to create a temporary email
                                                    </span>
                                                )}
                                            </span>
                                        )
                                }
                            </h3>

                        </div>
                    )}
            </div>

            <Toaster
                closeButton
                theme='dark'
            />

        </section>
    )
}
