import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "What is One Temp Mail? (Temporary Email, Disposable Email, Temp Mail)",
    a: "One Temp Mail is a free temporary email service that lets you instantly generate a disposable email address to receive emails online without exposing your real inbox. It's perfect for testing, sign-ups, one-time verification codes, and protecting your privacy.",
  },
  {
    q: "How does a temporary email address work?",
    a: "Click generate to create a unique temp mail address. Use it anywhere you need an email. Incoming messages appear in your inbox panel in real time—no registration required. You can discard the address when you're done.",
  },
  {
    q: "Is One Temp Mail secure and private?",
    a: "We never ask you to sign up to use a disposable email. Temporary emails reduce spam to your primary inbox and help keep your personal identity private. Do not use for sensitive data or account recovery—disposable mailboxes are intended for short-term use.",
  },
  {
    q: "How long are emails stored?",
    a: "Temporary inboxes are short-lived. Emails are retained only for a limited period suitable for testing and quick verifications. For long-term storage, use a permanent email provider.",
  },
  {
    q: "Can I receive attachments and verification codes?",
    a: "Yes, you can receive standard messages including common verification codes (OTP). Large or executable attachments may be blocked for safety.",
  },
  {
    q: "What are the benefits of disposable email vs. regular email?",
    a: "Disposable email protects your privacy, reduces spam, and keeps marketing lists away from your primary address. It's ideal for short-term needs like trials, downloads, beta testing, and one-time sign-ups.",
  },
  {
    q: "Is One Temp Mail free?",
    a: "Yes—generating and using temporary email addresses is free.",
  },
  {
    q: "Can I delete or change my temp email address?",
    a: "Absolutely. You can discard the current disposable address and generate a new one at any time.",
  },
  {
    q: "Do you support GDPR and data protection best practices?",
    a: "We follow privacy-first principles. Avoid using disposable addresses for sensitive personal information. Data is purged automatically on a rolling basis.",
  },
  {
    q: "Who should use One Temp Mail? (Developers, Testers, Privacy-focused users)",
    a: "Developers and QA can quickly test email flows. Privacy-focused users can avoid spam when registering on websites, downloading resources, or accessing gated content.",
  },
];

const FAQ = ({ className = "", onGenerate }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className={`w-full mx-auto ${className}`}>
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 pb-10">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Need Help?
            <br />
            <span className="text-white/60">We're here to assist.</span>
          </h2>
          <p className="text-md sm:text-lg text-white/50 md:text-xl">
            One Temp Mail is a simple, free tool for creating disposable emails. Check the answers on the right or generate an email to see how it works in seconds.
          </p>
          <Button onClick={onGenerate} className="w-full sm:w-fit justify-center active:translate-y-[2px] py-1 group relative flex items-center overflow-hidden px-12 whitespace-nowrap group gap-1 sm:justify-start rounded-3xl bg-oneColor text-sm transition-colors duration-300 hover:bg-gray-100 active:bg-gray-400  hover:text-black shadow-sm font-medium h-9">
            <span className="ease absolute right-0 flex h-9 w-10 translate-x-full transform items-center justify-start duration-300 group-hover:translate-x-0 group-active:-rotate-45 group-active:-translate-y-2 group-active:-translate-x-1">
              <svg width='1em' height='1em' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <span className="relative transform transition-transform duration-300 -translate-x-2 group-hover:-translate-x-3 ">Generate Email now</span>
          </Button>
        </div>

        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-white/30 last:border-b-0">
                <AccordionTrigger className="focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex-1 items-start justify-between gap-4 rounded-md py-4 text-sm font-medium outline-none hover:underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-white/70 leading-relaxed">
                    {item.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* FAQPage JSON-LD for enhanced SEO rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
};

export default FAQ;
