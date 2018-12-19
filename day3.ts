import { data } from "./data";
import { dataTest } from "./data";

interface coor {
    x: number;
    y: number;
}

function getData(line: string): coor[] {
    let ret: coor[];
    ret = new Array<coor>();
    let stat = 'x';

    if (line.indexOf('y') == 0) {
        stat = 'y';
    }
    let tmp = line.split(', ');
    let coor1 = Number(tmp[0].substr(2));
    let coor2 = Number(tmp[1].split('..')[0].substr(2));
    let coor3 = Number(tmp[1].split('..')[1]);

    for (let i = coor2; i <= coor3; i++) {
        if (stat == 'y')
            ret.push({x: i, y: coor1});
        else
            ret.push({x: coor1, y: i});
    }

    return ret;
}

function getMinMaxXY(data: string[]): {max: coor, min: coor} {
    let retmax = {x: 0, y: 0};
    let retmin = {x: 100000000, y: 100000000};

    for (let line of data) {
        let tmp = getData(line);
        tmp.map(a => {
            if (a.x > retmax.x)
                retmax.x = a.x;
            if (a.y > retmax.y)
                retmax.y = a.y;
            if (a.x < retmin.x)
                retmin.x = a.x;
            if (a.y < retmin.y)
                retmin.y = a.y
        })
    }

    return {max: retmax, min: retmin};
}

class Table {
    max: coor;
    min: coor;
    storage: string[][];
    start = {x: 500, y: 0};

    constructor(min: coor, max: coor) {
        this.max = max;
        this.min = min;
        this.storage = new Array<string[]>();

        for (let y = 0; y< max.y+2; y++) {
            let tmp = new Array<string>();
            for(let x = 0; x < max.x+2; x++) {
                tmp.push('.');
            }
            this.storage.push(tmp);
        }
    }

    loadClay(data: string[]) {
        for(let line of data) {
            let tmp = getData(line);
            for (let t of tmp) {
                this.storage[t.y][t.x] = '#';
            }
        }
    }

    display() {
        console.log('State:');
        for(let y = this.min.y; y < this.max.y+2; y++) {
            let str = '';
            for(let x = this.min.x-3; x < this.max.x+1; x++) {
                str += this.storage[y][x];
            }
            console.log(str);
        }
    }

    getValue(p: coor) {
        return this.storage[p.y][p.x];
    }

    inRange(p: coor): boolean {
        if (p.x > this.max.x) return false;
        if (p.y > this.max.y) return false;

        return true;

    }

    whatIsDown(p: coor): string {
        if (this.inRange(p)) {
            return this.storage[p.y+1][p.x];
        }
        return '-';
    }

    getDown(p: coor): coor {
        return {x: p.x, y: p.y+1};
    }

    getUp(p: coor): coor {
        return {x: p.x, y: p.y-1};
    }

    setFallWater(p: coor) {
        this.storage[p.y][p.x] = '|';
    }

    fillHor(p: coor): coor[] {
        this.storage[p.y][p.x] = '~';
        for (let i = 0; '#' != this.storage[p.y][p.x+i] ;i++) {
            this.storage[p.y][p.x+i] = '~';
        }
        for (let i = 0; '#' != this.storage[p.y][p.x+i] ;i--) {
            this.storage[p.y][p.x+i] = '~';
        }

        return [this.getUp(p)];
    }

    isBane(p: coor): boolean {
        let ret = true;

        let i;
        for (i = 0; i < this.max.x + 2; i++) {
            let pos = {x: p.x+i, y: p.y};

            let down = this.getValue(this.getDown(pos));
            if ( (down == '#') || (down == '~') ) {}
            else {
                return false;
            }

            if (this.getValue(pos) == '#')
                break;
        }

        for (i = 0; p.x + i > this.min.x - 2; i--) {
            let pos = {x: p.x+i, y: p.y};

            let down = this.getValue(this.getDown(pos));
            if ( (down == '#') || (down == '~') ) {}
            else {
                return false;
            }

            if (this.getValue(pos) == '#')
                break;
        }

        return ret;
    }

    fillHorNoBane(p: coor): coor[] {
        let ret = new Array<coor>();
        let i;
        for (i = 0; i < this.max.x + 2; i++) {
            let pos = {x: p.x+i, y: p.y};
            if (this.getValue(pos) == '#')
                break;

            let down = this.getValue(this.getDown(pos));
            if ( (down == '#') || (down == '~') ) {
                this.storage[p.y][p.x+i] = '|';
            } else {
                this.storage[p.y][p.x+i] = '|';
                ret.push(pos);
                break;
            }
        }

        for (i = 0; p.x + i > this.min.x - 2; i--) {
            let pos = {x: p.x+i, y: p.y};

            if (this.getValue(pos) == '#')
                break;
            let down = this.getValue(this.getDown(pos));
            if ( (down == '#') || (down == '~') ) {
                this.storage[p.y][p.x+i] = '|';
            } else {
                this.storage[p.y][p.x+i] = '|';
                ret.push(pos);
                break;
            }
        }
    
        return ret;
    }
    
    set(i:coor, v: string) {
        this.storage[i.y][i.x] = v;
    }

    fill(posarray: coor[]): coor[] {
        if (posarray.length == 0) {
            posarray.push(this.start);
        }
        
        let ret = new Array<coor>();
        let oldsize = 0;
        while (posarray.length > 0) {
            posarray = posarray.filter(function(item, pos) {
                return posarray.indexOf(item) == pos;
            })
            let pos = posarray.pop();
            let wid = this.whatIsDown(pos);
            console.log('Y: ' + pos.y + ' Size: ' + posarray.length);
            // if (posarray.length > 5) {
            //     for (let i of posarray) {
            //         this.set(i, 'x');
            //     }
                //this.display();
                //console.log(posarray);
                //throw('final');
            // }
                
            oldsize = posarray.length

            switch(wid) {
                case '.':
                    this.setFallWater(this.getDown(pos));
                    posarray.push(this.getDown(pos));
                    break;
                case '|':
                    //let down = this.getDown(pos) 
                    //posarray.push(down);
                    break;
                case '#':
                    if (this.isBane(pos)) {
                        let tmp = this.fillHor(pos)
                        posarray.push(this.getUp(pos));
                    } else {
                        let tmp = this.fillHorNoBane(pos);
                        tmp.map(a => ret.push(a));
                    }
                    break;
                case '~':
                    if (this.isBane(pos)) {
                        let tmp = this.fillHor(pos)
                        tmp.map(a => ret.push(a));
                    } else {
                        let tmp = this.fillHorNoBane(pos);
                        tmp.map(a => ret.push(a));
                    }
                    break;
            }
        }
        
        // console.log('Ret:');
        // console.log(ret);

        return ret;
    }

    countWater(): number {
        let count =  0;
        for(let y = this.min.y; y < this.max.y+1; y++) {
            for(let x = this.min.x-2; x < this.max.x + 2 ; x++) {
                let p = {x: x, y: y};
                let v = this.getValue(p);
                if ((v == '|') || (v == '~')) {
                    count++;
                }
            }
        }
        return count;
    }

    countWater2(): number {
        let count =  0;
        for(let y = this.min.y; y < this.max.y+1; y++) {
            for(let x = this.min.x-2; x < this.max.x + 2 ; x++) {
                let p = {x: x, y: y};
                let v = this.getValue(p);
                if (v == '~') {
                    count++;
                }
            }
        }
        return count;
    }

    findErrors(): coor[] {
        let tmp = new Array<coor>();
        for(let y = this.min.y; y < this.max.y+1; y++) {
            for(let x = this.min.x-2; x < this.max.x + 2 ; x++) {
                let p = {x:x,y:y};
                if ((this.getValue(p) == '|') && (this.getValue(this.getDown(p)) == '.')) {
                    tmp.push(this.getDown(p));
                }
            }
        }

        return tmp;
    }

}

function execute(data: string[]) {
    let minmax = getMinMaxXY(data);
    let table = new Table(minmax.min, minmax.max);
    table.loadClay(data);
    
    let ret = [table.start];
    do {

        ret = table.fill(ret);
        console.log('Ret Size: ' + ret.length);
        
    } while(ret.length != 0)


    table.display();
    console.log('Count: ' + table.countWater());
    console.log('Count: ' + table.countWater2());
}

execute(data);
