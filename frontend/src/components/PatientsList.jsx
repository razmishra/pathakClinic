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
import { Edit } from "lucide-react";
const PatientsList = (props) => {
  const { patientsList, patientsColumn } = props;
  const toggleActionButton = () => {};
  return (
    <Table>
      {/* <TableCaption>A list of queued patients.</TableCaption> */}
      <TableHeader>
        <TableRow className="bg-slate-800">
          {patientsColumn?.map((column) => (
            <TableHead key={column.Header} className="text-white">
              {column.Header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {patientsList.map((row) => {
          // Implement logic to decide button color based on action
          return (
            <TableRow
              key={row.case}
              onClick={() => toggleActionButton(row?.case ?? null)}
              className="cursor-pointer hover:bg-muted/100"
            >
              <TableCell className="font-medium">{row.caseId}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.contact}</TableCell>
              <TableCell>{row.occupation}</TableCell>
              <TableCell>{row.age}</TableCell>
              <TableCell>{row.sex}</TableCell>
              <TableCell>{<Edit />}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PatientsList;
