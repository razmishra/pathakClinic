import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import moment from "moment";

const decideActionButton = (action) => {
  // Implement logic to decide button color based on action
  if (action === true) {
    return (
      <div className="flex justify-center">
        <Stethoscope
          className="bg-green-500 p-1 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
          size={32}
        />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <Eye
          className="bg-blue-500 p-1 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
          size={32}
        />
      </div>
    );
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

  const toggleRowSelection = (e, row) => {
    e.stopPropagation();
    const caseId = row?.caseId ?? null;
    if (!caseId) return;
    setSelectedRows((prev) =>
      prev?.some((record) => record.caseId === caseId)
        ? prev?.filter((record) => record.caseId !== caseId)
        : [...prev, row]
    );
  };

  return (
    <div className="rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800">
            {tableColumns?.map((column) => (
              <TableHead
                key={column.Header}
                className="text-white font-semibold py-4"
              >
                {column.Header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows.length > 0 ? (
            tableRows.map((row) => {
              const isSelected = selectedRows?.some(
                (record) => record.caseId === row?.caseId
              );
              return (
                <TableRow
                  key={row.case}
                  className={`
                    ${isSelected ? "bg-slate-100" : ""}
                    hover:bg-slate-50 transition-colors
                    border-b
                  `}
                >
                  <TableCell className="font-medium">
                    {moment(row.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {row.caseId}
                  </TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.contact}</TableCell>
                  <TableCell className="flex items-center justify-center">
                    {isSelected ? (
                      <Eye
                        className="bg-blue-500 p-1 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors cursor-pointer"
                        size={32}
                        onClick={(e) => toggleRowSelection(e, row)}
                      />
                    ) : (
                      <EyeOff
                        className="bg-gray-400 p-1 text-white rounded-md shadow-sm hover:bg-gray-500 transition-colors cursor-pointer"
                        size={32}
                        onClick={(e) => toggleRowSelection(e, row)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={tableColumns?.length || 6}
                className="text-center py-8 text-gray-500"
              >
                No patients found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
