import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const EmptyState = ({ messagesReady, isFormVisible }) => (
    <div className="flex flex-col h-full w-full items-center justify-center">
        <div className="relative flex justify-center items-center min-h-[150px]">
            <svg width='70px' className='absolute' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M10.5 22V20M14.5 22V20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M11 20V20.75H11.75V20H11ZM14 19.25C13.5858 19.25 13.25 19.5858 13.25 20C13.25 20.4142 13.5858 20.75 14 20.75V19.25ZM17.5 5.25C17.0858 5.25 16.75 5.58579 16.75 6C16.75 6.41421 17.0858 6.75 17.5 6.75V5.25ZM7 5.25C6.58579 5.25 6.25 5.58579 6.25 6C6.25 6.41421 6.58579 6.75 7 6.75V5.25ZM9 19.25C8.58579 19.25 8.25 19.5858 8.25 20C8.25 20.4142 8.58579 20.75 9 20.75V19.25ZM15 20.75C15.4142 20.75 15.75 20.4142 15.75 20C15.75 19.5858 15.4142 19.25 15 19.25V20.75ZM10.25 11.25V20H11.75V11.25H10.25ZM11 19.25H4.23256V20.75H11V19.25ZM2.75 17.3953V11.25H1.25V17.3953H2.75ZM4.23256 19.25C3.51806 19.25 2.75 18.5323 2.75 17.3953H1.25C1.25 19.1354 2.48104 20.75 4.23256 20.75V19.25ZM6.5 6.75C8.46677 6.75 10.25 8.65209 10.25 11.25H11.75C11.75 8.04892 9.50379 5.25 6.5 5.25V6.75ZM6.5 5.25C3.49621 5.25 1.25 8.04892 1.25 11.25H2.75C2.75 8.65209 4.53323 6.75 6.5 6.75V5.25ZM21.25 11.25V17.4253H22.75V11.25H21.25ZM19.7931 19.25H14V20.75H19.7931V19.25ZM21.25 17.4253C21.25 18.5457 20.4934 19.25 19.7931 19.25V20.75C21.5305 20.75 22.75 19.1488 22.75 17.4253H21.25ZM22.75 11.25C22.75 8.04892 20.5038 5.25 17.5 5.25V6.75C19.4668 6.75 21.25 8.65209 21.25 11.25H22.75ZM7 6.75H18V5.25H7V6.75ZM9 20.75H15V19.25H9V20.75Z" fill="#ffffff"></path> <path d="M5 16H8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M16 9.88432V5.41121M16 5.41121V2.63519C16 2.39905 16.1676 2.19612 16.3994 2.15144L16.8855 2.05779C17.4738 1.94443 18.0821 1.99855 18.6412 2.214L18.7203 2.24451C19.2746 2.4581 19.8807 2.498 20.4582 2.35891C20.7343 2.2924 21 2.50168 21 2.78573V5.00723C21 5.2442 20.8376 5.45031 20.6073 5.5058L20.5407 5.52184C19.9095 5.67387 19.247 5.63026 18.6412 5.39679C18.0821 5.18135 17.4738 5.12722 16.8855 5.24058L16 5.41121Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
            <svg width="180" className={`absolute transition-all ${messagesReady ? 'opacity-100' : 'opacity-0'}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g><circle strokeLinecap="round" fill="none" strokeDasharray="50.26548245743669 50.26548245743669" stroke="#fff" strokeWidth="2" r="32" cy="50" cx="50"><animateTransform values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform" /></circle><g /></g></svg>
        </div>
        <h2 className='text-white text-xl font-bold'>
            {messagesReady ? "Waiting for incoming emails" : "Inbox is empty"}
        </h2>
        <h3 className='text-gray-500 text-lg font-light text-center'>
            {messagesReady ? "This operation is performed automatically" : (
                isFormVisible ? "Enter your username and create your temporary email" : "Generate a random email or enter a username to create a temporary email"
            )}
        </h3>
    </div>
);

const MessageList = ({ messages, seenMessages, onFetchMessageContent, messagesContent }) => (
    <Accordion type="single" collapsible>
        {messages.map(message => (
            <AccordionItem value={message['@id']} key={message['@id']}>
                <AccordionTrigger onClick={() => onFetchMessageContent(message.id)} className={`text-white text-start flex flex-wrap md:flex-nowrap justify-between w-full items-center p-2 px-4 my-1 ${!seenMessages.includes(message.id) ? 'border-l-8 rounded border-[#7808ff]' : ''}`}>
                    <div className='w-full md:w-fit mb-2 md:mb-0'>
                        <div className="flex gap-2">
                            <h3>{message.from.name}</h3>
                            {!seenMessages.includes(message.id) && <Badge className='rounded-xl bg-[#7808ff] text-[11px] px-2 leading-[0.55rem] h-min py-1'>New</Badge>}
                        </div>
                        <p className='font-light text-gray-300 '>{message.from.address}</p>
                    </div>
                    <div>
                        <span className='font-light'>{message.subject}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className='px-4'>
                    <iframe
                        srcDoc={messagesContent.html || ''}
                        title={`Email from ${message.from.name}`}
                        className="w-full h-56 border-0"
                        style={{ background: 'white' }}
                        sandbox="allow-popups allow-popups-to-escape-sandbox"
                    />
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
);

const Inbox = ({ messages, seenMessages, messagesContent, messagesReady, isFormVisible, onFetchMessageContent }) => (
    <div className="w-full flex flex-col items-stretch justify-start border border-gray-700 z-20 m-0 bgshadow mt-8 rounded-3xl p-8 min-h-60">
        <h1 className="text-white text-2xl select-none">Inbox</h1>
        <hr className="border-gray-700 mb-2" />
        {messages.length > 0 ? (
            <MessageList messages={messages} seenMessages={seenMessages} onFetchMessageContent={onFetchMessageContent} messagesContent={messagesContent} />
        ) : (
            <EmptyState messagesReady={messagesReady} isFormVisible={isFormVisible} />
        )}
    </div>
);

export default Inbox;