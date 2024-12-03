'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ChevronDown } from 'lucide-react'

interface ActionDropdownProps {
  t: (key: string) => string
  setIsModalOpen: (isOpen: boolean) => void
  params: any
}

export function ActionDropdown({ t, setIsModalOpen, params }: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {t("Actions")} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
          {t("Invite Students")}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={{
              pathname: `/dashboard/grading`,
              query: { class_id: params.posts },
            }}
          >
            {t("Upload grades")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={{
              pathname: `/dashboard/create_content`,
              query: { class_id: params.posts },
            }}
          >
            {t("Create Content")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

