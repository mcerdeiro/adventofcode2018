import { dataTest } from "./data";
import { data } from "./data";

function getData(val: string): number[] {
    let id: number;
    const pos: number[] = [0, 0];
    const size: number[] = [0, 0];

    const val_split = val.split(' '); // #1 @ 1,3: 4x4 -> '#1' '@' '1,3:' '4x4'
    id = Number(val_split[0].split('#')[1]);
    pos[0] = Number(val_split[2].split(',')[0]);
    pos[1] = Number(val_split[2].split(',')[1].split(':')[0]);
    size[0] = Number(val_split[3].split('x')[0]);
    size[1] = Number(val_split[3].split('x')[1]);

    console.log('Id: ' + id + ' x: ' + pos[0] + ' y:' + pos[1] + ' wide: ' + size[0] + ' high: ' + size[1]);

    return [id, pos[0], pos[1], size[1], size[0]];

}

function execute() {
    const area = new Area();
    for (const val1 of data) {
        console.log('Processing: ' + val1);
        const tmp = getData(val1);
        area.cuadrado(tmp[1], tmp[2], tmp[3], tmp[4]);
    }

    console.log('ovelap: ' + area.countOverlap());

    for (const val1 of data) {
        console.log('Processing: ' + val1);
        const tmp = getData(val1);
        if (area.checkOverlap(tmp[1], tmp[2], tmp[3], tmp[4])) {
            console.log('ID: ' + tmp[0] + ' does not overlap...');
            return;
        }
    }
}

class Area {
    area_colector: number[][];
    maxx = 0;
    maxy = 0;

    constructor() {
        this.area_colector = new Array();
    }
  
    setVal(x: number, y: number) {
      if (this.area_colector[x] === undefined) {
        this.area_colector[x] = new Array<number>();
        this.area_colector[x][y] = 1;
        // console.log('Setted1: ' + x + ' ' + y + ': ' + this.area_colector[x][y]);
      } else if (this.area_colector[x][y] === undefined) {
        this.area_colector[x][y] = 1;
        // console.log('Setted2: ' + x + ' ' + y + ': ' + this.area_colector[x][y]);
      }
      else {
        this.area_colector[x][y] = this.area_colector[x][y] + 1;
        // console.log('Setted3: ' + x + ' ' + y + ': ' + this.area_colector[x][y]);
      }
      // console.log('Setted: ' + x + ' ' + y + ': ' + this.area_colector[x][y]);
  
      if (x > this.maxx) {
        this.maxx = x;
      }
      if (y > this.maxy) {
        this.maxy = y;
      }
    }
  
    cuadrado(x: number, y: number, w: number, h: number) {
      console.log('Cuadr: ' + x + ' ' + y + ' - ' + w + ' ' + h);
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          this.setVal(x + j, y + i);
        }
      }
    }

    checkOverlap(x: number, y: number, w: number, h: number): boolean {
      console.log('Cuadr: ' + x + ' ' + y + ' - ' + w + ' ' + h);
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          // console.log('Overlap in: ' + i + ' ' + j + ' overlap: ' + this.area_colector[i][j]);
          if (this.area_colector[x+j][y+i] > 1) {
            return false;
          }
        }
      }
      return true;
    }
  
    countOverlap(): number {
      let ret = 0;
      for (let i = 0; i <= this.maxx; i++) {
        for (let j = 0; j <= this.maxy; j++) {
          // console.log('Cechking: ' + i + ' ' + j);
          if ( (this.area_colector[i] !== undefined) && (this.area_colector[i][j] !== undefined) ) {
            if (this.area_colector[i][j] > 1) {
                console.log('Overlap in: ' + i + ' ' + j + ' overlap: ' + this.area_colector[i][j]);
                ret++;
            }
          }
        }
      }
      return ret;
    }
  
  }

execute();


