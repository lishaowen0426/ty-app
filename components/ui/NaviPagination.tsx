import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

export default function NaviPagination({
  count,
  state,
}: {
  count: number;
  state: ReturnType<typeof useState<number>>;
}) {}
