import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    (<ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          (<Toast key={id} {...props}  className='right-0 bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-50 border border-gray-600 text-white' >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className='text-white hover:text-[#b98af3]' />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}
