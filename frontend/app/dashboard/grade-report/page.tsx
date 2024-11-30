// page.tsx
"use client";
import GradeReportCard from "@/app/components/GradeReportCard/GradeReportCard";
import React, { useEffect, useState } from "react";

import { useJwtDecoder } from "@/hooks/useJwtDecoder";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentGradesQuery } from "@/lib/redux/api/getApi";
import ErrorAlert from "@/app/components/core/ErrorAlert";
import Cookie from "js-cookie";
import { useTranslations } from "next-intl";

const GradeReport = () => {
  // const token = localStorage.getItem("token");
  const token = Cookie.get("token");
  const t = useTranslations("GradeReport")
  const studentId = useJwtDecoder(token); // Decode the token to get the student ID
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [shouldFetchGrades, setShouldFetchGrades] = useState(false);

  useEffect(() => {
    if (token) {
      setAccessToken(token);
    }
  }, [token]);

  // Trigger the query only after studentId is available
  useEffect(() => {
    if (studentId) {
      setShouldFetchGrades(true);
    }
  }, [studentId]);

  // Only fetch the grades when the studentId is available
  const { data, error, isLoading } = useGetStudentGradesQuery(
    {
      studentId: studentId ?? "",
      accessToken: accessToken ?? "",
    },
    {
      skip: !shouldFetchGrades, // Skip the query until the studentId is ready
    }
  );

  const noGradesAvailable =
    !isLoading &&
    data?.data?.every(
      (classroom: any) => classroom.grades.records.length === 0
    );

  return (
    <>
      {error && (
        <ErrorAlert message="Failed to load grade reports. Please try again." />
      )}
      <div className="bg-[#F6F6F6] min-h-screen pl-32 pr-20 pt-10">
        <header>
          <h1 className="font-bold text-2xl mb-4">{t("Grade Report")}</h1>
        </header>
        <div className="flex flex-row">
          <p>{t("Name")}:</p>
          <p className="pl-1 font-medium">William Saliba</p>
        </div>
        <p className="font-semibold text-lg mt-10">{t("Enrolled Classes")}</p>

        <div>
          {isLoading ? (
            // Render 2 skeletons while loading
            <>
              <Skeleton className="w-full h-32 bg-gray-200 rounded-lg mb-6" />
              <Skeleton className="w-full h-32 bg-gray-200 rounded-lg mb-6" />
            </>
          ) : noGradesAvailable ? (
            // Fallback for when no grades are available across all classrooms
            <div className="flex flex-col items-center justify-center w-full h-64">
              <p className="text-gray-500 text-lg font-medium">
                {t("No grades available yet")}
              </p>
            </div>
          ) : (
            // Render GradeReportCard only if records array is not empty
            data?.data?.map((classroom: any) => {
              if (classroom.grades.records.length > 0) {
                return (
                  <GradeReportCard
                    key={classroom.classroom_id}
                    classroom={classroom}
                  />
                );
              } else if (classroom.grades.records.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center w-full h-64">
                    <p className="text-gray-500 text-lg font-medium">
                      {t("No grades available yet")}
                    </p>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default GradeReport;
