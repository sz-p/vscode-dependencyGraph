import * as fs from 'fs'
import pino from "pino";
import { getCurrentFolderPath } from "./getCurrentFolderPath"
import { getLog } from "./fileSystem/setting/setting"
const logFlag = getLog();
const dirPath = getCurrentFolderPath();
const streams = []
if (logFlag) {
  streams.push({
    level: "debug",
    stream: fs.createWriteStream(dirPath + "/.dependencygraph/dependencyGraph.log"),
  })
}
if (process.env.NODE_ENV === "development") {
  streams.push(
    {
      level: "debug",
      stream: {
        write(str) { console.log(JSON.parse(str)) }
      },
    })
}
export const logger = pino({
  level: "debug",
  base: undefined
}, pino.multistream(streams))
