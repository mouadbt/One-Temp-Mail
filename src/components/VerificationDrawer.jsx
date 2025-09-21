import React from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import HCaptcha from '@hcaptcha/react-hcaptcha';

const VerificationDrawer = ({ isOpen, onOpenChange, siteKey, onVerify }) => (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="bgshadowLight bg-black md:px-[35%] mx-auto border-gray-700">
            <DrawerHeader className="[&>*]:text-center pt-8">
                <DrawerTitle>Verify you're human</DrawerTitle>
                <DrawerDescription>Please complete the captcha to continue</DrawerDescription>
            </DrawerHeader>
            <div className="captcha px-4 py-8 flex justify-center">
                <HCaptcha sitekey={siteKey} onVerify={onVerify} theme="dark" />
            </div>
            <DrawerFooter>
                <DrawerClose className="w-min mx-auto text-gray-300 border border-t-0 border-r-0 border-l-0 border-b-transparent hover:border-b-gray-300">
                    Cancel
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
);

export default VerificationDrawer;