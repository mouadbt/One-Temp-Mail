import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getDomains, createAccount, getToken, getMessages, getMessageContentById } from '../functions';

export const useEmailManager = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isNameSelected, setIsNameSelected] = useState(false);
    const [name, setName] = useState('');
    const [isRandomemail, setIsRandomEmail] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [customEmail, setCustomEmail] = useState('');
    const [messagesContent, setMessagesContent] = useState('');

    const getInitialState = (key, defaultValue) => {
        const storedData = JSON.parse(sessionStorage.getItem('emailData'));
        return storedData?.[key] || defaultValue;
    };

    const [domains, setDomains] = useState(() => getInitialState('domains', []));
    const [email, setEmail] = useState(() => getInitialState('email', ''));
    const [token, setToken] = useState(() => getInitialState('token', ''));
    const [messages, setMessages] = useState(() => getInitialState('messages', []));
    const [seenMessages, setSeenMessages] = useState(() => getInitialState('seenMessages', []));
    const [messagesReady, setMessagesReady] = useState(() => !!getInitialState('email', false));

    const updateSessionStorage = (key, value) => {
        const prevData = JSON.parse(sessionStorage.getItem('emailData')) || {};
        const newData = { ...prevData, [key]: value };
        sessionStorage.setItem('emailData', JSON.stringify(newData));
    };

    const fetchDomains = async () => {
        const fetchedDomains = await getDomains();
        setDomains(fetchedDomains);
        if (!JSON.parse(sessionStorage.getItem('emailData'))) {
            sessionStorage.setItem('emailData', JSON.stringify({ domains: fetchedDomains, seenMessages: [], messages: [], message: '', email: '', token: '' }));
        } else {
            updateSessionStorage('domains', fetchedDomains);
        }
    };

    useEffect(() => {
        const handleClick = (event) => {
            if (event.target.tagName === 'A') event.target.target = '_blank';
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        fetchDomains();
    }, []);

    const retrieveToken = async (address, pss) => {
        try {
            const r_token = await getToken(address, pss);
            updateSessionStorage('email', address);
            updateSessionStorage('token', r_token);
            setEmail(address);
            setToken(r_token);
            setMessagesReady(true);
            toast.success("Temp email created successfully");
        } catch (error) {
            toast.error("Failed to create account. Please try again.");
        }
    };

    const resetEmail = (errorOccurred = false) => {
        const prevData = JSON.parse(sessionStorage.getItem('emailData'));
        const tempDomains = prevData?.domains || [];
        sessionStorage.setItem('emailData', JSON.stringify({ domains: tempDomains, seenMessages: [], messages: [], message: '', email: '', token: '' }));

        setEmail('');
        setToken('');
        setMessages([]);
        setMessagesContent('');
        setSeenMessages([]);
        setMessagesReady(false);
        setIsFormVisible(false);
        setCustomEmail("");
        setIsNameSelected(false);
        setName('');

        if (!errorOccurred) {
            toast.success("Your previous temporary email has been reset.");
        }
    };

    const createAccountAndGenerateEmail = async (the_email, the_password) => {
        toast.success("Loading...");
        try {
            const res = await createAccount(the_email, the_password);
            await retrieveToken(res.data.address, the_password);
        } catch (error) {
            resetEmail(true);
            toast.error("Failed to create account. Please try again.");
        }
    };

    const beforeShowForm = () => {
        setIsRandomEmail(false);
        setIsDrawerOpen(true);
    };

    const beforeRandomEmailGenration = () => {
        setIsRandomEmail(true);
        setIsDrawerOpen(true);
    };

    const checkNameValidaty = (e) => {
        if (/^[a-z]*[a-z\d]*$/.test(e.target.value)) {
            setName(e.target.value);
        }
    };

    const setUserName = (e) => {
        e.preventDefault();
        if (/^[a-z]*[a-z\d]*$/.test(name) && name.length > 0) {
            setIsNameSelected(true);
        }
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/.,][-+_)(**&^%$##@!abcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 25 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    const createRandomAccount = (name) => {
        const randomEmail = `${name}@${domains[Math.floor(Math.random() * domains.length)].domain}`;
        createAccountAndGenerateEmail(randomEmail, generatePassword());
    };

    const generateRandomName = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const namestr = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        createRandomAccount(namestr);
    };

    const beforeGeneration = () => {
        if (isRandomemail) {
            generateRandomName();
        } else {
            setIsFormVisible(true);
        }
    };

    const handleVerificationSuccess = (token) => {
        setIsDrawerOpen(false);
        if (token) {
            beforeGeneration();
        } else {
            setIsFormVisible(false);
        }
    };

    const createNameAccount = (e) => {
        e.preventDefault();
        createAccountAndGenerateEmail(customEmail, generatePassword());
    };

    const retrieveMessages = async () => {
        if (token) {
            const messagesVal = await getMessages(token);
            setMessages(messagesVal);
            updateSessionStorage('messages', messagesVal);
        }
    };

    useEffect(() => {
        const messagesInterval = setInterval(retrieveMessages, 10000);
        return () => clearInterval(messagesInterval);
    }, [token]);

    const handleFetchMessageContent = async (id) => {
        try {
            const content = await getMessageContentById(id, token);
            setMessagesContent(content);
            setSeenMessages(prev => {
                const newSeen = [...prev, id];
                updateSessionStorage('seenMessages', newSeen);
                return newSeen;
            });
        } catch (error) {
            toast.error("Failed to get email content. Please try again.");
        }
    };

    const CopyEmail = () => {
        navigator.clipboard.writeText(email);
        toast.success("Email address is copied to clipboard");
    };

    return {
        email, domains, messages, seenMessages, messagesContent, messagesReady,
        isFormVisible, isNameSelected, name, isDrawerOpen, customEmail,
        recaptchaSecretKey: import.meta.env.VITE_HCAPTCHA_SITE_KEY,
        beforeShowForm, beforeRandomEmailGenration, checkNameValidaty,
        setUserName, handleDrawerStateChange: setIsDrawerOpen,
        handleVerificationSuccess, createNameAccount, handleFetchMessageContent,
        CopyEmail, resetEmail, setCustomEmail
    };
};