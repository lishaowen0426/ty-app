import React, { useRef, useCallback, MouseEventHandler, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

type NoUndefinedState<T> = T extends [
  infer S | undefined,
  React.Dispatch<React.SetStateAction<infer S | undefined>>
]
  ? [S, React.Dispatch<React.SetStateAction<S>>]
  : never;

type SetStateType = NoUndefinedState<ReturnType<typeof useState<boolean>>>[1];

export interface AlertOverlayProps extends AlertDialogProps {
  title: React.ReactNode;
  message: React.ReactNode;
  setOpen: SetStateType;
}

export const AlertOverlay = ({
  title,
  message,
  open,
  setOpen,
  ...props
}: AlertOverlayProps) => {
  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (onDismiss) onDismiss();
    },
    [onDismiss]
  );

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClick}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>继续</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
