import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Stethoscope } from "lucide-react";
import { useState } from "react";

const decideActionButton = (action) => {
  // Implement logic to decide button color based on action
  if (action === "Queued") {
    return (
      <Stethoscope
        className="bg-green-400 p-1 text-white rounded-sm"
        size={30}
      />
    );
  } else if (action === "Viewing") {
    return <Eye className="bg-green-400 p-1 text-white rounded-sm" size={30} />;
  }
};

export function TableComponent(props) {
  const {
    tableRows,
    setTableRows,
    tableColumns,
    selectedRows,
    setSelectedRows,
  } = props;

  const toggleActionButton = (caseId) => {
    if (!caseId) return;
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.case === caseId
          ? {
              ...row,
              action: row.action === "Queued" ? "Viewing" : "Queued",
            }
          : row
      )
    );
    setSelectedRows((prev) =>
      prev.includes(caseId)
        ? prev.filter((id) => id !== caseId)
        : [...prev, caseId]
    );
  };

  return (
    <Table>
      {/* <TableCaption>A list of queued patients.</TableCaption> */}
      <TableHeader>
        <TableRow className="bg-slate-800">
          {tableColumns?.map((column) => (
            <TableHead key={column.Header} className="text-white">
              {column.Header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableRows.map((row) => {
          // Implement logic to decide button color based on action
          const isSelected = selectedRows?.includes(row.case);
          return (
            <TableRow
              key={row.case}
              style={{ backgroundColor: isSelected ? "#dad3d3" : "" }}
              onClick={() => toggleActionButton(row?.case ?? null)}
              className="cursor-pointer hover:bg-muted/100"
            >
              <TableCell className="font-medium">{row.case}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.contact}</TableCell>
              <TableCell>{decideActionButton(row?.action)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
