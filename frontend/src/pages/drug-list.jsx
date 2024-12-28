import DrugList from "@/components/DrugList";
import PaginationComponent from "@/components/PaginationComponent";
import PatientsList from "@/components/PatientsList";
import { Input } from "@/components/ui/input";
import { drugList, patientsList } from "@/data/examinations";
import React from "react";

const drug_list = () => {
  return (
    <div className="shadow-lg">
      <div className=" flex justify-between items-center">
        <span className="font-medium p-2 text-2xl">Drugs List</span>
        <span>
          <Input placeholder="Search drugs" className="" />
        </span>
      </div>
      <DrugList drugList={drugList}/>
      <PaginationComponent pageOptions={[5, 10, 20]} />
    </div>
  );
};

export default drug_list;
