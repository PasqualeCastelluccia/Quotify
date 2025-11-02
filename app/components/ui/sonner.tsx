import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: 'group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm',
          error: '!bg-red-50/95 dark:!bg-red-950/95 !text-red-900 dark:!text-red-100 !border-red-300 dark:!border-red-700 [&>button]:!text-red-900 dark:[&>button]:!text-red-100 [&>[data-icon]]:!text-red-700 dark:[&>[data-icon]]:!text-red-300 [&_[data-description]]:!text-red-800 dark:[&_[data-description]]:!text-red-200',
          success: '!bg-green-50/95 dark:!bg-green-950/95 !text-green-900 dark:!text-green-100 !border-green-300 dark:!border-green-700 [&>button]:!text-green-900 dark:[&>button]:!text-green-100 [&>[data-icon]]:!text-green-700 dark:[&>[data-icon]]:!text-green-300 [&_[data-description]]:!text-green-800 dark:[&_[data-description]]:!text-green-200',
          warning: '!bg-amber-50/95 dark:!bg-amber-950/95 !text-amber-900 dark:!text-amber-100 !border-amber-300 dark:!border-amber-700 [&>button]:!text-amber-900 dark:[&>button]:!text-amber-100 [&>[data-icon]]:!text-amber-700 dark:[&>[data-icon]]:!text-amber-300 [&_[data-description]]:!text-amber-800 dark:[&_[data-description]]:!text-amber-200',
          info: '!bg-blue-50/95 dark:!bg-blue-950/95 !text-blue-900 dark:!text-blue-100 !border-blue-300 dark:!border-blue-700 [&>button]:!text-blue-900 dark:[&>button]:!text-blue-100 [&>[data-icon]]:!text-blue-700 dark:[&>[data-icon]]:!text-blue-300 [&_[data-description]]:!text-blue-800 dark:[&_[data-description]]:!text-blue-200',
          title: '!font-semibold',
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
