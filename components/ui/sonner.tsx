"use client"

import {
  CheckCircle2,
  Info,
  Loader2,
  AlertCircle,
  AlertTriangle,
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
        success: <CheckCircle2 className="size-4 text-[#89d185]" />,
        info: <Info className="size-4 text-[#3794ff]" />,
        warning: <AlertTriangle className="size-4 text-[#cca700]" />,
        error: <AlertCircle className="size-4 text-[#f14c4c]" />,
        loading: <Loader2 className="size-4 animate-spin text-[#007acc]" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group font-sans !bg-[#ffffff] dark:!bg-[#252526] !border-[#cecece] dark:!border-[#3c3c3c] !text-[#1e1e1e] dark:!text-[#cccccc] !rounded-lg !shadow-xl !shadow-black/20 dark:!shadow-black/60 !py-2.5 !px-3.5 !gap-2.5",
          title: "!text-xs !font-medium !text-[#1e1e1e] dark:!text-[#ffffff]",
          description: "!text-[11px] !text-[#6e6e6e] dark:!text-[#858585]",
          actionButton:
            "!bg-[#007acc] hover:!bg-[#0062a3] !text-white !text-xs !font-medium !rounded-md !h-7 !px-2.5",
          cancelButton:
            "!bg-[#f0f0f0] dark:!bg-[#1e1e1e] !border !border-[#cecece] dark:!border-[#3c3c3c] !text-[#1e1e1e] dark:!text-[#cccccc] !text-xs !rounded-md !h-7 !px-2.5",
          closeButton:
            "!bg-[#ffffff] dark:!bg-[#252526] !border-[#cecece] dark:!border-[#3c3c3c] !text-[#858585] hover:!text-[#1e1e1e] dark:hover:!text-[#ffffff]",
          success: "!border-l-2 !border-l-[#89d185]",
          error: "!border-l-2 !border-l-[#f14c4c]",
          info: "!border-l-2 !border-l-[#3794ff]",
          warning: "!border-l-2 !border-l-[#cca700]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
