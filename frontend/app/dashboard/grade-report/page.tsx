import GradeReportCard from "@/app/components/GradeReportCard/GradeReportCard";
import React from "react";

const GradeReport = () => {
  return (
    <div className="bg-[#F6F6F6] min-h-screen pl-32 pr-20 pt-10">
      <header>
        <h1 className="font-bold text-2xl mb-4">Grade Report</h1>
      </header>
      <div className="flex flex-row">
        <p>Name:</p>
        <p className="pl-1 font-medium">William Saliba</p>
      </div>
      <p className="font-semibold text-lg mt-10">Enrolled Classes</p>
     
      <div className="">
          <GradeReportCard />
      </div>
    </div>
  );
};

export default GradeReport;
