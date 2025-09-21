import React from 'react';
import { Toaster } from 'sonner';
import { useEmailManager } from './hooks/useEmailManager';

import Hero from './components/Hero';
import EmailDisplay from './components/EmailDisplay';
import EmailCreationFlow from './components/EmailCreationFlow';
import VerificationDrawer from './components/VerificationDrawer';
import Inbox from './components/Inbox';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function Email() {
    const {
        email, domains, messages, seenMessages, messagesContent, messagesReady,
        isFormVisible, isNameSelected, name, isDrawerOpen, customEmail,
        recaptchaSecretKey, beforeShowForm, beforeRandomEmailGenration,
        checkNameValidaty, setUserName, handleDrawerStateChange,
        handleVerificationSuccess, createNameAccount, handleFetchMessageContent,
        CopyEmail, resetEmail, setCustomEmail
    } = useEmailManager();

    return (
        <section className={`main relative w-full min-h-screen flex px-[5%] pb-[2%] sm:pb-0 flex-col items-center justify-between gap-2 ${email ? 'pt-[30%] md:pt-[6%]' : 'pt-[30%] md:pt-[10%]'}`}>
            <div className="bg z-0 w-full"></div>
            <div className="noise absolute w-full h-full inset-0 opacity-15"></div>

            <div className='hero z-40 w-full 2xl:mt-20'>
                <Hero />
                {email ? (
                    <EmailDisplay email={email} onCopy={CopyEmail} onReset={resetEmail} />
                ) : (
                    <EmailCreationFlow
                        isNameSelected={isNameSelected}
                        isFormVisible={isFormVisible}
                        domains={domains}
                        name={name}
                        customEmail={customEmail}
                        createNameAccount={createNameAccount}
                        setCustomEmail={setCustomEmail}
                        setUserName={setUserName}
                        checkNameValidaty={checkNameValidaty}
                        beforeRandomEmailGenration={beforeRandomEmailGenration}
                        beforeShowForm={beforeShowForm}
                    />
                )}
            </div>

            <VerificationDrawer
                isOpen={isDrawerOpen}
                onOpenChange={handleDrawerStateChange}
                siteKey={recaptchaSecretKey}
                onVerify={handleVerificationSuccess}
            />

            <Inbox
                messages={messages}
                seenMessages={seenMessages}
                messagesContent={messagesContent}
                messagesReady={messagesReady}
                isFormVisible={isFormVisible}
                onFetchMessageContent={handleFetchMessageContent}
            />

            <FAQ className="mt-20 z-50" onGenerate={beforeRandomEmailGenration} />
            <Footer />

            <Toaster
                closeButton
                theme='dark'
                toastOptions={{
                    className: 'toast !bg-oneColor border-[#4b00c4] [&>button]:border-[#4b00c4] [&>button]:!bg-oneColor [&>button]:transition-all',
                    error: {
                        className: 'toast error text-red-500 !bg-white border-red-800 [&>button]:border-red-800 [&>button]:!bg-white [&>button]:transition-all',
                    },
                }}
            />
        </section>
    );
}