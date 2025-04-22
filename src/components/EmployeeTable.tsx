import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState, getFilteredRowModel } from "@tanstack/react-table"
import { ArrowUpDown, Search } from "lucide-react"
import { Button } from "./ui/button"
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table"
import ColumnCellInput from "./ColumnCellInput"

export interface Employee {
    id: number;
    name: string;
    jobTitle?: string;
    age: number;
    nickname?: string;
    isEmployee: boolean;
}

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "name",
        header: ({ column }: { column: any }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name<br />
                    (job title)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }: { row: any }) => <div>
            <ColumnCellInput defaultValue={row.getValue("name")} />
            <ColumnCellInput defaultValue={row.getValue("jobTitle")} />
        </div>
    },
    {
        accessorKey: "age",
        header: ({ column }: { column: any }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Age
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }: { row: any }) => <ColumnCellInput defaultValue={row.getValue("age")} />,
    },
    {
        accessorKey: "nickname",
        header: "Nickname",
        cell: ({ row }: { row: any }) => {
            const nickname = row.getValue("nickname") as string
            return <ColumnCellInput defaultValue={nickname} />
        },
    },
    {
        accessorKey: "isEmployee",
        header: "Employee",
        cell: ({ row }: { row: any }) => {
            const isEmployee = row.getValue("isEmployee") as boolean
            return <input type="checkbox" checked={isEmployee} />
        },
    }
]

interface DataTableProps {
    data: Employee[]
}

const EmployeeTable = ({ data }: DataTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const tableContainerRef = useRef<HTMLDivElement>(null)

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    const { rows } = table.getRowModel()

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 45,
        overscan: 5,
    })

    const { getVirtualItems, getTotalSize } = rowVirtualizer

    const paddingTop = getVirtualItems().length > 0 ? getVirtualItems()[0]?.start || 0 : 0
    const paddingBottom = getVirtualItems().length > 0 
        ? getTotalSize() - (getVirtualItems()[getVirtualItems().length - 1]?.end || 0) 
        : 0

    return (
        <div className="rounded-md border">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
            </Table>
            <div 
                ref={tableContainerRef}
                className="h-[600px] overflow-auto"
            >
                <Table>
                    <TableBody>
                        {paddingTop > 0 && (
                            <tr>
                                <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
                            </tr>
                        )}
                        {getVirtualItems().map((virtualRow) => {
                            const row = rows[virtualRow.index]
                            return (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })}
                        {paddingBottom > 0 && (
                            <tr>
                                <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
                            </tr>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default EmployeeTable