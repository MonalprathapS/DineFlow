import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info"

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  variant?: ToastVariant
}

const ToastPrimitivesProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 sm:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-4 pr-8 shadow-elevated transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "border bg-white text-foreground",
        success: "border-success-100 bg-success-50 text-success-600",
        destructive: "border-destructive/20 bg-red-50 text-destructive",
        warning: "border-warning-100 bg-warning-50 text-warning-500",
        info: "border-blue-100 bg-blue-50 text-blue-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const IconMap: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="h-5 w-5 shrink-0" />,
  success: <CheckCircle2 className="h-5 w-5 shrink-0" />,
  destructive: <AlertCircle className="h-5 w-5 shrink-0" />,
  warning: <AlertCircle className="h-5 w-5 shrink-0" />,
  info: <Info className="h-5 w-5 shrink-0" />,
}

const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Root>, ToastProps>(
  ({ className, variant = "default", children, ...props }, ref) => (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {IconMap[variant]}
      <div className="flex-1 min-w-0">{children}</div>
      <ToastPrimitives.Close className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  )
)
Toast.displayName = ToastPrimitives.Root.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-snug", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 mt-0.5", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastItem = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: (opts: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    (opts: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, ...opts }])
      setTimeout(() => dismiss(id), 4500)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      <ToastPrimitivesProvider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant} onOpenChange={(open) => !open && dismiss(t.id)}>
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </Toast>
        ))}
        <ToastViewport />
      </ToastPrimitivesProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
