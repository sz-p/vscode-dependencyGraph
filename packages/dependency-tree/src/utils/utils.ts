import * as fs from "fs";

export const isPathExists = function (p: string): boolean {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
};

export const isDirectory = function (p: string): boolean {
  const stat = fs.lstatSync(p);
  return stat.isDirectory();
};
