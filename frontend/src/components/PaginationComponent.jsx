import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationComponent = (props) => {
  const { pageOptions } = props;
  return (
    <>
      <div className=" flex items-center justify-center gap-4">
        <div className="flex gap-4 items-center">
          <span>Rows per page: </span>
          <Select>
            <SelectTrigger className="w-18">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="w-5">
              {pageOptions?.map((page) => (
                <SelectItem value={page}>{page}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <span>Page: 1</span>
        </div>
        <div className="flex gap-2">
          <div className="cursor-pointer  hover:bg-red-100 p-2 rounded">
            <ChevronLeft />
          </div>
          <div className="cursor-pointer hover:bg-red-100 p-2 rounded">
            <ChevronRight />
          </div>
        </div>
      </div>
    </>
  );
};

export default PaginationComponent;
