"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Topic, TopicWithStats } from "@/app/utils/db"
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
  
  const handleClick = async () => {
    const response = await fetch(`/api/topics/slug?name=${encodeURIComponent(topic.name)}`)
    const { slug } = await response.json()
    router.push(`/topics/${slug}`)
  }
  
  return (
    <Button
      variant="ghost"
      className={`
        ${colorClasses}
        px-4 h-9
        font-bold
        rounded-lg
        border
        shadow-sm
        transition-colors
        uppercase
        tracking-wide
        flex items-center gap-2
      `}
      onClick={handleClick}
    >
      View Topic
      <ArrowRight className="h-4 w-4" />
    </Button>
  )
}

export const columns: ColumnDef<TopicWithStats>[] = [
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
          className="hover:bg-gray-100/50"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    size: 200,
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
    size: 300,
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-md truncate text-base text-gray-600">
          {description || "No description available"}
        </div>
      )
    },
  },
  {
    accessorKey: "total_communities",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-gray-100/50"
      >
        Communities
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 120,
    cell: ({ row }) => {
      const count = row.getValue("total_communities") as number
      return (
        <div className="font-medium text-center bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
          {count}
        </div>
      )
    },
  },
  {
    accessorKey: "total_members",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-gray-100/50"
      >
        Members
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 120,
    cell: ({ row }) => {
      const count = row.getValue("total_members") as number
      return (
        <div className="font-medium text-center bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg">
          {new Intl.NumberFormat('en-US').format(count)}
        </div>
      )
    },
  },
  {
    accessorKey: "total_votes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-gray-100/50"
      >
        Votes
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 120,
    cell: ({ row }) => {
      const count = row.getValue("total_votes") as number
      return (
        <div className="font-medium text-center bg-amber-50 text-amber-600 px-3 py-1 rounded-lg">
          {new Intl.NumberFormat('en-US').format(count)}
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
