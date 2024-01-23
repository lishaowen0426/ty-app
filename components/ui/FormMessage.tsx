import * as React from "react";
import { useForm, useFormContext } from "react-hook-form";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { field: string }
>(({ className, children, field, ...props }, ref) => {
  const form = useFormContext();
  const { isDirty, isTouched, invalid, error } = form!.getFieldState(field)!;
  console.log(error);
  /*
  const { error, formMessageId } = useFormField();

  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        "text-sm font-medium text-red-500 dark:text-red-900",
        className
      )}
      {...props}
    >
      {body}
    </p>
  );
  */

  return <p>form message</p>;
});

export { FormMessage };
