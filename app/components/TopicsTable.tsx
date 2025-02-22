import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Topic } from "../utils/db"
import Image from "next/image"

export function TopicsTable({ topics }: { topics: Topic[] }) {
  return (
    <div className="p-4 overflow-x-auto bg-gradient-to-r from-[#f3f1ea] to-[#e0d8c3]">
      <div className="backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Icon
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {topic.icon_url && (
                    <Image
                      src={topic.icon_url}
                      alt={topic.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {topic.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {topic.description}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(topic.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
