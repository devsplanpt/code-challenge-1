import fs from "fs/promises";
import { Match } from "./types";
import { columns, dataPathCasts } from "./constants";

export const getChampionshipData = async (path: string) => {
    const rawData = await readFileSync(path);
  
    const data: Match[] = parseRawData(rawData);
  
    return data;
  };

 const parseRawData = (rawData: string): Match[] => {
  const lines = rawData.split("\n");
  const header = lines.at(0)?.split(",");

  if (isEmptyFile(rawData)) {
    throw new Error("empty file");
  }

  if (isInvalidHeader(header)) {
    throw new Error("invalid header");
  }

  const data: Match[] = lines
    .slice(1)
    .filter((line) => !!line)
    .map(mapLineToMatch(header));

  return data;
};

const isEmptyFile = (rawData: string) => rawData.trim().length === 0;

const isInvalidHeader = (header: string[] | undefined) =>
  !header || !header.every((column) => columns.includes(column));

const mapLineToMatch =
  (header: string[] | undefined) =>
  (line: string): Match => {
    const values = line.split(",");

    const obj: any = {};

    header?.forEach((key, index) => {
      obj[key] = castValue(key, values[index]);
    });

    return obj;
  };

const castValue = (key: string, value: string) => {
  const cast = dataPathCasts[key as keyof Match];

  return cast != null ? cast(value) : value;
};


const readFileSync = async (path: string) => {
    try {
      const data = await fs.readFile(path, "utf-8");
  
      return data;
    } catch (error) {
      throw new Error("unable to read file");
    }
  };
  