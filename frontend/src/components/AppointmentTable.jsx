import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import QueueButton from "./QueueButton";

const AppointmentTable = (props) => {
  const { appointmentList, appointmentColumn } = props;
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800">
            {appointmentColumn?.map((column) => (
              <TableHead key={column.Header} className="text-white">
                {column.Header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointmentList.map((row) => (
            <TableRow key={row.case} className="hover:bg-muted/100">
              <TableCell>
                {moment(row?.createdAt).format("DD-MM-YYYY HH:mm:ss") || "NA"}
              </TableCell>
              <TableCell className="font-medium">
                {row?.caseId || "NA"}
              </TableCell>
              <TableCell>{row?.name || "NA"}</TableCell>
              <TableCell>{row?.address || "NA"}</TableCell>
              <TableCell>{row?.contact || "NA"}</TableCell>
              <TableCell>
                <QueueButton
                  appointmentId={row?.caseId}
                  showOnDashboard={row?.showOnDashboard ?? false}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AppointmentTable;
