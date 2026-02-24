"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface PromptInputContextValue {
  value: string
  onValueChange: (value: string) => void
  isLoading: boolean
  onSubmit: () => void
  maxHeight: number | string
}

const PromptInputContext = React.createContext<PromptInputContextValue | null>(null)

function usePromptInput() {
  const ctx = React.useContext(PromptInputContext)
  if (!ctx) {
    throw new Error("PromptInput components must be used within PromptInput")
  }
  return ctx
}

interface PromptInputProps {
  value: string
  onValueChange: (value: string) => void
  isLoading?: boolean
  onSubmit?: () => void
  maxHeight?: number | string
  children: React.ReactNode
  className?: string
}

function PromptInput({
  value,
  onValueChange,
  isLoading = false,
  onSubmit = () => {},
  maxHeight = 240,
  children,
  className,
}: PromptInputProps) {
  return (
    <PromptInputContext.Provider
      value={{
        value,
        onValueChange,
        isLoading,
        onSubmit,
        maxHeight,
      }}
    >
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            "flex flex-col rounded-full border border-border bg-card px-4 py-2.5 shadow-sm",
            className
          )}
        >
          {children}
        </div>
      </TooltipProvider>
    </PromptInputContext.Provider>
  )
}

interface PromptInputTextareaProps
  extends Omit<React.ComponentProps<"textarea">, "value" | "onChange"> {
  disableAutosize?: boolean
  disabled?: boolean
  className?: string
}

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(
  (
    {
      disableAutosize = false,
      disabled = false,
      className,
      onKeyDown,
      placeholder,
      ...props
    },
    ref
  ) => {
    const { value, onValueChange, onSubmit, maxHeight, isLoading } = usePromptInput()
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const maxHeightPx =
      typeof maxHeight === "number" ? maxHeight : parseInt(String(maxHeight).replace(/\D/g, ""), 10) || 120

    const adjustHeight = React.useCallback(() => {
      const el = textareaRef.current
      if (!el || disableAutosize) return
      el.style.height = "24px"
      const newHeight = Math.min(el.scrollHeight, maxHeightPx)
      el.style.height = `${newHeight}px`
    }, [disableAutosize, maxHeightPx])

    React.useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const setRefs = (el: HTMLTextAreaElement | null) => {
      textareaRef.current = el
      if (typeof ref === "function") ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
      onKeyDown?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onValueChange(e.target.value)
      requestAnimationFrame(adjustHeight)
    }

    return (
      <textarea
        ref={setRefs}
        value={value}
        onChange={handleChange}
        disabled={disabled || isLoading}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className={cn(
          "font-wenkai-mono-bold placeholder:font-wenkai-mono-bold min-h-[24px] min-w-0 flex-1 resize-none overflow-y-auto border-0 bg-transparent px-2 py-1 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{
          maxHeight: `${maxHeightPx}px`,
        }}
        rows={1}
        {...props}
      />
    )
  }
)
PromptInputTextarea.displayName = "PromptInputTextarea"

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

function PromptInputActions({ children, className, ...props }: PromptInputActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

interface PromptInputActionProps {
  tooltip: React.ReactNode
  children: React.ReactNode
  className?: string
  side?: "top" | "bottom" | "left" | "right"
  disabled?: boolean
}

function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  disabled = false,
}: PromptInputActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild disabled={disabled} className={className}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
}
