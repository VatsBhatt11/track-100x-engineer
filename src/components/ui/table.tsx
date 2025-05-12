import * as React from "react"
import { cn } from "@/lib/utils"
import '@/styles/table.css'

// Table Component
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="table-wrapper">
    <table
      ref={ref}
      className={cn("table", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

// Table Header Component
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("table-header", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

// Table Body Component
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("table-body", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

// Table Footer Component
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "table-footer",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

// Table Row Component
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "table-row",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

// Table Head Component
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "table-head",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

// Table Cell Component
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("table-cell", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

// Table Caption Component
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("table-caption", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

// Exporting all components
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
