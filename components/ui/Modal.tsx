"use client";
import { useCallback, useRef, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target == overlay.current || e.target == wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      id="modal-background"
      ref={overlay}
      onClick={onClick}
      className="fixed z-10 top-0 left-0 w-full h-full mx-auto bg-black/60"
    >
      <div
        ref={wrapper}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-10/12 md:w-8/12 lg:w-1/2 p-6"
      >
        {children}
      </div>
    </div>
  );
}

export function ModalAlert({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <Modal>
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{content}</AlertDescription>
      </Alert>
    </Modal>
  );
}
