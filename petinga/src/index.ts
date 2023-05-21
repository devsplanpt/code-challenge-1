import {  Reporter } from "./types";
import { getChampionshipData } from "./parse";
import { computeReport } from "./report";

export const logChampionshipReport = async (path: string, reporter: Reporter) => {
  const data = await getChampionshipData(path);

  const report = computeReport(data, reporter);

  console.log(report);

  return report
};
