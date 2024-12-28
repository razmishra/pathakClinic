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
import { CircleMinus, CirclePlus, Edit, Trash2 } from "lucide-react";
const DrugList = (props) => {
  const { drugList } = props;
  return (
    <Table>
      {/* <TableCaption>A list of queued patients.</TableCaption> */}
      {/* <TableHeader>
        <TableRow className="bg-slate-800">
            {patientsColumn?.map((column) => (
              <TableHead key={column.Header} className="text-white">
                {column.Header}
              </TableHead>
            ))}
          </TableRow>
      </TableHeader> */}
      <TableBody>
        {drugList.map((row, index) => {
          // Implement logic to decide button color based on action
          return (
            <TableRow
              key={index}
              // onClick={() => toggleActionButton(row?.case ?? null)}
              // className="cursor-pointer hover:bg-muted/100"
            >
              <TableCell className="font-medium">{index+1}</TableCell>
              <TableCell>{row.drugName}</TableCell>
              <TableCell className="cursor-pointer hover:bg-muted/100">{<Edit />}</TableCell>
              <TableCell className="cursor-pointer hover:bg-muted/100">{<CirclePlus />}</TableCell>
              <TableCell >{row.quantity}</TableCell>
              <TableCell className="cursor-pointer hover:bg-muted/100">{<CircleMinus />}</TableCell>
              <TableCell className="cursor-pointer hover:bg-muted/100">{<Trash2 />}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DrugList;
