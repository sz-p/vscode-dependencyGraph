import * as inspector from "inspector"
import * as path from "path";
import * as fs from "fs"
export class Profile {
  label: string
  private profileFilePath: string
  private session: inspector.Session;
  private heapsnapshotFileId: number;
  private labelComplete: string;
  constructor(label: string) {
    this.label = label
    this.profileFilePath = path.resolve(__dirname, "../") + '/';
  }
  starGetCpuProfile() {
    console.profile(this.label + `-${this.labelComplete}`);
  }
  endGetCpuProfile() {
    console.profileEnd(this.label + `-${this.labelComplete}`);
  }
  startGetHeapsnapshot() {
    this.session = new inspector.Session();
    this.heapsnapshotFileId = fs.openSync(this.profileFilePath + this.label + `-${this.labelComplete}` + '.heapsnapshot', 'w');
    this.session.connect();
    this.session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
      fs.writeSync(this.heapsnapshotFileId, m.params.chunk);
    });
  }
  endGetHeapsnapshot() {
    this.session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
      this.session.disconnect();
      fs.closeSync(this.heapsnapshotFileId);
    });
  }
  start() {
    const now = new Date();
    this.labelComplete = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`
    // fist start get heapsnapshot
    this.startGetHeapsnapshot();
    this.starGetCpuProfile();
  }
  end() {
    // fist end get cpu profile
    this.endGetCpuProfile();
    this.endGetHeapsnapshot();
  }
}
