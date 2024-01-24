import * as React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { field: string }
>(({ className, children, field, ...props }, ref) => {
  console.log("enter");
  const form = useFormContext();
  const { isDirty, isTouched, invalid, error } = form!.getFieldState(field)!;

  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={field}
      className={cn(
        "text-sm font-medium text-red-500 dark:text-red-900",
        className
      )}
      {...props}
    >
      {body}
    </p>
  );
});

export { FormMessage };
