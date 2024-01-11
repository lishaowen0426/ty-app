"use client";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Header } from "../dashboard/page";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Footer = () => {};

export default function MyTopic() {
  const { data: session, status } = useSession();
  return (
    <div className="h-full flex flex-col">
      <Header user={session?.user} title="我的话题" />
      <div></div>
    </div>
  );
}
