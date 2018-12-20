import { example1 } from "./data";
import { example2 } from "./data";
import { example3 } from "./data";
import { dataTest } from "./data";
import { dataTest2 } from "./data";
import { dataTest3 } from "./data";
import { dataTest4 } from "./data";
import { dataTest5 } from "./data";
import { data } from "./data";

interface Pos {
    x: number;
    y: number;
}

interface Context {
    offset: Pos;
    pos: Pos;
}

class Laberint {
    storage: string[][];
    distance: number[][];
    pos: Pos;
    offset: Pos;
    input: string;
    context: Context[];

    getOffset(): Pos {
        return {x: this.offset.x, y: this.offset.y};
    }
    
    inRange(pos: Pos = undefined): boolean {
        if (pos == undefined) {
            pos = this.pos;
        }
        if (pos.x<0) return false;
        if (pos.y<0) return false;
        if (pos.y >= this.storage.length) return false;
        if (pos.x >= this.storage[pos.y].length) return false;

        return true;
    }
    
    addRowAtBegin() {
        this.offset.y -= 2;
        for (let y = 0; y < 2; y++) {
            let tmp = new Array<string>();
            for (let x = 0; x < this.storage[0].length; x++) {
                tmp.push(' ');
            }
            this.storage.unshift(tmp);
        }
        this.pos.y += 2;
    }
    
    addColumnAtEnd() {
        // #?#    #?#?#
        // ?X? -> ?X?.?
        // #?#    #?#?#
        for (let y = 0; y < this.storage.length; y++) {
                this.storage[y].push(' ');
                this.storage[y].push(' ');
        }
    }

    addColumnAtBegin() {
        this.offset.x -= 2;
        for (let y = 0; y < this.storage.length; y++) {
            this.storage[y].unshift(' ');
            this.storage[y].unshift(' ');
        }
        this.pos.x += 2;
    }

    addRowAtEnd() {
        for (let y = 0; y < 2; y++) {
            let tmp = new Array<string>();
            for (let x = 0; x < this.storage[0].length; x++) {
                tmp.push(' ');
            }
            this.storage.push(tmp);
        }
    }

    getPos(): Pos {
        return {x: this.pos.x, y: this.pos.y};
    }

    pushContext() {
        let tmp = { offset: this.getOffset(), pos: this.getPos() };
        this.context.push(tmp);
    }

    popContext() {
        let tmp = this.context.pop();
        let offset = this.getOffset();
        this.pos.x = tmp.pos.x + tmp.offset.x - offset.x;
        this.pos.y = tmp.pos.y + tmp.offset.y - offset.y;
    }

    

    buildpos(pos: number) {
        let i;
        for(i = pos; i < this.input.length; i++) {
            let c = this.input.charAt(i);
            console.log('Processing: ' + c + ' in pos ' + i + ' In level: ' + this.context.length);
            switch (c) {
                case 'E':
                    this.goE();
                    break;
                case 'N':
                    this.goN();
                    break;
                case 'S':
                    this.goS();
                    break;
                case 'W':
                    this.goW();
                    break;
                case ('('):
                    this.pushContext();
                    break;
                case ('|'):
                    this.popContext();
                    this.pushContext();
                    break;
                case ')':
                    this.popContext();
            }
        }

        console.log('State:');
        this.print();
    }

    build() {
        this.buildpos(0);
        this.finalWalls();
    }

    finalWalls() {
        for(let y = 0; y < this.storage.length; y++) {
            for (let x = 0; x < this.storage[y].length; x++) {
                if (this.storage[y][x] == '?') {
                    this.storage[y][x] = '#';
                }
            }
        }
    }

    goS() {
        this.pos.y += 2;
        if (this.inRange() == false) {
            this.addRowAtEnd();
        }

        // build corners of the new room
        //        #?#
        //        ?.? 
        // #?#    #-#
        // ?X? -> ?X?
        // #?#    #?#
        this.storage[this.pos.y+1][this.pos.x-1] = '#';
        this.storage[this.pos.y+1][this.pos.x+1] = '#';
        // doors
        if (this.storage[this.pos.y+1][this.pos.x] == ' ') this.storage[this.pos.y+1][this.pos.x] = '?';
        if (this.storage[this.pos.y][this.pos.x-1] == ' ') this.storage[this.pos.y][this.pos.x-1] = '?';
        if (this.storage[this.pos.y][this.pos.x+1] == ' ') this.storage[this.pos.y][this.pos.x+1] = '?';
        if (this.storage[this.pos.y][this.pos.x] == ' ' ) this.storage[this.pos.y][this.pos.x] = '.';
        this.storage[this.pos.y-1][this.pos.x] = '-';
    }

    goN() {
        this.pos.y -= 2;
        if (this.inRange() == false) {
            this.addRowAtBegin();
        }

        // build corners of the new room
        //        #?#
        //        ?.? 
        // #?#    #-#
        // ?X? -> ?X?
        // #?#    #?#
        this.storage[this.pos.y-1][this.pos.x-1] = '#';
        this.storage[this.pos.y-1][this.pos.x+1] = '#';
        // doors
        if (this.storage[this.pos.y-1][this.pos.x] == ' ') this.storage[this.pos.y-1][this.pos.x] = '?';
        if (this.storage[this.pos.y][this.pos.x-1] == ' ') this.storage[this.pos.y][this.pos.x-1] = '?';
        if (this.storage[this.pos.y][this.pos.x+1] == ' ') this.storage[this.pos.y][this.pos.x+1] = '?';
        if (this.storage[this.pos.y][this.pos.x] == ' ' ) this.storage[this.pos.y][this.pos.x] = '.';
        this.storage[this.pos.y+1][this.pos.x] = '-';
    }

    goW() {
        this.pos.x -= 2;

        if (this.inRange() == false) {
            // extend laberinth
            this.addColumnAtBegin();
        }

        // build corners of the new room
        // #?#    #?#?#
        // ?X? -> ?X|.?
        // #?#    #?#?#
        this.storage[this.pos.y-1][this.pos.x-1] = '#';
        this.storage[this.pos.y+1][this.pos.x-1] = '#';
        // doors
        if (this.storage[this.pos.y-1][this.pos.x] == ' ') this.storage[this.pos.y-1][this.pos.x] = '?';
        if (this.storage[this.pos.y+1][this.pos.x] == ' ') this.storage[this.pos.y+1][this.pos.x] = '?';
        if (this.storage[this.pos.y][this.pos.x-1] == ' ') this.storage[this.pos.y][this.pos.x-1] = '?';
        if (this.storage[this.pos.y][this.pos.x] == ' ') this.storage[this.pos.y][this.pos.x] = '.';

        this.storage[this.pos.y][this.pos.x+1] = '|';
    }

    goE() {
        this.pos.x += 2;

        if (this.inRange() == false) {
            console.log('not in range')
            this.addColumnAtEnd();
        }

        // build corners of the new room
        // #?#    #?#?#
        // ?X? -> ?X|.?
        // #?#    #?#?#
        this.storage[this.pos.y-1][this.pos.x+1] = '#';
        this.storage[this.pos.y+1][this.pos.x+1] = '#';
        // doors
        if (this.storage[this.pos.y-1][this.pos.x] == ' ') this.storage[this.pos.y-1][this.pos.x] = '?';
        if (this.storage[this.pos.y+1][this.pos.x] == ' ') this.storage[this.pos.y+1][this.pos.x] = '?';
        if (this.storage[this.pos.y][this.pos.x+1] == ' ') this.storage[this.pos.y][this.pos.x+1] = '?';
        if (this.storage[this.pos.y][this.pos.x] == ' ') this.storage[this.pos.y][this.pos.x] = '.';

        this.storage[this.pos.y][this.pos.x-1] = '|';
        
    }

    getStart(): Pos {
        for (let y = 0; y < this.storage.length; y++) {
            for (let x = 0; x < this.storage[y].length; x++) {
                if (this.storage[y][x] == 'X')
                    return {x: x, y: y};
            }
        }

        throw('Could not find center');
    }

    calculateDistance() {
        this.distance = new Array<number[]>();
        for (let y = 0; y < this.storage.length; y++) {
            let tmp = new Array<number>();
            for (let x = 0; x < this.storage[y].length; x++) {
                tmp.push(undefined);
            }
            this.distance.push(tmp);
        }

        let current = this.getStart();
        this._calculateDistanceCycle(current, 0);
    }

    _calculateDistanceCycle(p: Pos, d: number) {
        console.log('Distance: ' + d);
        this.setDistance(p, d);
        let vecinos = this.getVecinos(p);
        console.log(vecinos);
        vecinos = vecinos.filter(a => ((this.distance[a.y][a.x] == undefined) || (this.distance[a.y][a.x] > this.getDistance(p)+1)));
        console.log(vecinos);
        vecinos.map(a => this._calculateDistanceCycle(a, d+1));
    }

    countRooms() {
        let count = 0;
        for (let y = 0; y < this.distance.length; y++) {
            for (let x = 0; x < this.distance[y].length; x++) {
                let pos = {x:x,y:y};
                if (this.getDistance(pos)>=1000) {
                    count++;
                }
            }
        }
        console.log('How many rooms ahead than 1000: ' + count);
    }

    findMaxDistance() {
        let max = 0;
        let maxx = 0;
        let maxy = 0;
        for (let y = 0; y < this.storage.length; y++) {
            for (let x = 0; x < this.storage[y].length; x++) {
                if (max < this.getDistance({x:x, y:y})) {
                    max = this.getDistance({x:x, y:y});
                    maxx = x;
                    maxy = y;
                }
            }
        }

        this.storage[maxy][maxy] = 'm';
        return {max: max, x: maxx, y: maxy}
    }

    setDistance(p: Pos, v: number) {
        this.distance[p.y][p.x] = v; 
    }

    getDistance(p: Pos): number {
        return this.distance[p.y][p.x];
    }

    getVecinos(p: Pos): Pos[] {
        let ret = new Array<Pos>();

        if (this.storage[p.y][p.x+1] == '|') ret.push({x: p.x+2, y:p.y});
        if (this.storage[p.y][p.x-1] == '|') ret.push({x: p.x-2, y:p.y});
        if (this.storage[p.y+1][p.x] == '-') ret.push({x: p.x, y:p.y+2});
        if (this.storage[p.y-1][p.x] == '-') ret.push({x: p.x, y:p.y-2});

        return ret;
    }

    constructor(data: string) {
        this.context = new Array<Context>();
        this.input = data.substr(1).substr(0, data.length-2);
        // console.log('Input: ' + this.input);

        this.storage = new Array<string[]>();
        for (let y = 0; y < 3; y++) {
            let tmp = new Array<string>();
            for (let x = 0; x < 3; x++) {
                tmp.push(' ');
            }
            this.storage.push(tmp);
        }

        this.storage[1][1] = 'X';
        this.storage[0][0] = '#';
        this.storage[0][2] = '#';
        this.storage[2][0] = '#';
        this.storage[2][2] = '#';
        this.storage[1][0] = '?';
        this.storage[0][1] = '?';
        this.storage[2][1] = '?';
        this.storage[1][2] = '?';

        this.pos = {x: 1, y: 1};
        this.offset = {x: 1, y: 1};
        
    }

    print() {
        for (let y = 0; y < this.storage.length; y++) {
            let str = '';
            for (let x = 0; x < this.storage[y].length; x++) {
                str += this.storage[y][x];
            }
            console.log(str);
        }
    }
}

function execute(data: string) {
    let lab = new Laberint(data);

    console.log('Initial');
    lab.print();

    lab.build();

    console.log('Final:');
    lab.print();

    lab.calculateDistance();
    console.log(lab.findMaxDistance());

    console.log('Final widht distance:');
    lab.print();

    lab.countRooms();
}

execute(data);