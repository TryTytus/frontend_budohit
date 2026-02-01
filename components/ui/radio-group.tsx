"use client"

import * as React from "react"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (value: string) => void }
>(({ className, value, onValueChange, children, ...props }, ref) => {
    return (
        <div className={cn("grid gap-2", className)} ref={ref} {...props}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { checked: child.props.value === value, onChange: onValueChange });
                }
                return child;
            })}
        </div>
    )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; checked?: boolean; onChange?: (value: string) => void }
>(({ className, value, checked, onChange, ...props }, ref) => {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            value={value}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            onClick={() => onChange?.(value)}
            ref={ref}
            {...props}
        >
            <span className={cn("flex items-center justify-center", checked ? "opacity-100" : "opacity-0")}>
                <Circle className="h-2.5 w-2.5 fill-current text-current" />
            </span>
        </button>
    )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
