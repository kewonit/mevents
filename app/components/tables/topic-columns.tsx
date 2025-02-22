"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Topic } from "@/app/utils/db"
import Image from "next/image"
import { ArrowUpDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

// Update pastel colors to be more subtle and muted
const pastelColors = [
  "bg-pink-50/80 hover:bg-pink-100/60 text-pink-600/90 border-pink-200/60",
  "bg-blue-50/80 hover:bg-blue-100/60 text-blue-600/90 border-blue-200/60",
  "bg-green-50/80 hover:bg-green-100/60 text-green-600/90 border-green-200/60",
  "bg-purple-50/80 hover:bg-purple-100/60 text-purple-600/90 border-purple-200/60",
  "bg-amber-50/80 hover:bg-amber-100/60 text-amber-600/90 border-amber-200/60",
  "bg-indigo-50/80 hover:bg-indigo-100/60 text-indigo-600/90 border-indigo-200/60",
]

function ActionButton({ topic, colorIndex }: { topic: Topic; colorIndex: number }) {
  const router = useRouter()
  const colorClasses = pastelColors[colorIndex]
  
  const slug = topic.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  
  return (
    <Button
      variant="ghost"
      className={`
        ${colorClasses}
        px-4 h-9
        font-instrument-serif font-bold
        rounded-lg
        border
        shadow-sm
        transition-colors
        uppercase
        tracking-wide
        flex items-center gap-2
      `}
      onClick={() => router.push(`/topics/${slug}`)}
    >
      View Topic
      <ArrowRight className="h-4 w-4" />
    </Button>
  )
}

export const columns: ColumnDef<Topic>[] = [
  {
    id: "number",
    header: "#",
    size: 70,
    cell: ({ row }) => {
      const rowNumber = row.index + 1
      const colorIndex = row.index % pastelColors.length
      return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${pastelColors[colorIndex]}`}>
          {rowNumber}
        </div>
      )
    },
  },
  {
    accessorKey: "icon_url",
    header: "Icon",
    size: 100,
    cell: ({ row }) => {
      const icon_url = row.getValue("icon_url") as string
      return icon_url ? (
        <Image
          src={icon_url}
          alt={row.getValue("name")}
          width={48}
          height={48}
          className="rounded-full"
          draggable={false}
        />
      ) : null
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    size: 250,
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const colorIndex = row.index % pastelColors.length
      const colorClasses = pastelColors[colorIndex]
      
      return (
        <div className="flex items-center">
          <Badge 
            className={`
              ${colorClasses}
              px-4 py-1.5
              text-sm font-medium
              rounded-lg
              border
              shadow-sm
              uppercase
              tracking-wide
            `}
          >
            {name}
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-md truncate font-instrument-serif font-normal text-base">
          {description || "No description available"}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    size: 130,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <ActionButton 
            topic={row.original} 
            colorIndex={row.index % pastelColors.length} 
          />
        </div>
      )
    },
  },
]
