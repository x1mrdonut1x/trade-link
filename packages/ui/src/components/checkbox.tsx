import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@tradelink/ui/lib/utils"

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
    <div className="relative">
      <input
        type="checkbox"
        ref={ref}
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />
      <div
        className={cn(
          "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          checked && "bg-primary text-primary-foreground",
          className
        )}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
      >
        {checked && (
          <Check className="h-4 w-4 text-current" />
        )}
      </div>
    </div>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
