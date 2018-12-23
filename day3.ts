import { data } from "./data";
import { dataTest } from "./data";

interface Pos {
    x: number,
    y: number
}

enum Using {
    tourch,
    climbinggear,
    nothing
}

const ChangeTime = 7;
const MaxDinstance = 1000;

interface Distance {
    [Using.tourch]: number;
    [Using.climbinggear]: number;
    [Using.nothing]: number;
}

class PrioList {
    elements: CaveElement[] = [];

    private parentIndex(nodeIndex: number): number {
        return Math.floor((nodeIndex - 1) / 2);
    }

    private siftUp(index: number): void {
        // let str = '';
        // this.elements.map(a => str += ' ' + a.minDistance());
        // console.log(str);
        let parent = index-1;
        /// 1 3 4 7 10 6
        while (index > 0 && (this.elements[parent].minDistance() < this.elements[index].minDistance())) {
            let tmp = this.elements[parent];
            this.elements[parent] = this.elements[index];
            this.elements[index] = tmp;
            index = parent;
            parent = index - 1;
        }
        // str = '';
        // this.elements.map(a => str += ' ' + a.minDistance());
        // console.log(str);
    }

    addElement(ce: CaveElement) {
        this.elements.push(ce);
        // this.elements.sort((a,b)=> b.minDistance() - a.minDistance());
        this.siftUp(this.elements.length - 1);
    }

    isEmpty(): boolean {
        if (this.elements.length == 0) return true;
        return false;
    }

    pop(): CaveElement {
        // let str = 'Pop: ';
        // this.elements.map(a => str += ' ' + a.minDistance());
        // console.log(str);
        // console.log('Pop: ' + this.elements.length);
        let tmp = this.elements.pop();
        // console.log('Pop2: ' + this.elements.length);
        // str = 'Pop2: ';
        // this.elements.map(a => str += ' ' + a.minDistance());
        // console.log(str);

        return tmp;
    }
}

class CaveElement {
    type: string;
    gi: number;
    el: number;
    distance: Distance;
    pos: Pos;
    cave: Cave;

    minDistance() {
        let dist: number[] = [];
        if (this.distance[Using.tourch] != undefined) dist.push(this.distance[Using.tourch]);
        if (this.distance[Using.climbinggear] != undefined) dist.push(this.distance[Using.climbinggear]);
        if (this.distance[Using.nothing] != undefined) dist.push(this.distance[Using.nothing]);

        dist.sort((a,b) => a - b);

        return dist[0];
    }

    constructor(p: Pos, c: Cave) {
        this.type = ' ';
        this.gi = undefined;
        this.el = undefined;
        this.distance = { [Using.nothing]: undefined, [Using.climbinggear]: undefined, [Using.tourch]: undefined };
        this.pos = {x: p.x, y: p.y};
        this.cave = c;
    }

    getVecinos(): Array<CaveElement> {
        let tmp = new Array<CaveElement>();

        if (this.pos.y+1 < this.cave.size.y)
            tmp.push(this.cave.storage[this.pos.y+1][this.pos.x]);
        if (this.pos.x+1 < this.cave.size.x)
            tmp.push(this.cave.storage[this.pos.y][this.pos.x+1]);
        if (this.pos.x > 0)
            tmp.push(this.cave.storage[this.pos.y][this.pos.x-1]);
        if (this.pos.y > 0)
            tmp.push(this.cave.storage[this.pos.y-1][this.pos.x]);

        return tmp;
    }

    canCarry(u: Using): boolean {
        switch (this.type) {
            case '.':
            case 'M':
            case 'T':
                if (u == Using.climbinggear) return true;
                if (u == Using.tourch) return true;
                if (u == Using.nothing) return false;
                break;
            case '=':
                if (u == Using.climbinggear) return true;
                if (u == Using.tourch) return false;
                if (u == Using.nothing) return true;
                break;
            case '|':
                if (u == Using.climbinggear) return false;
                if (u == Using.tourch) return true;
                if (u == Using.nothing) return true;
                break;
        }

        throw ('Something wents wrong');
    }

    getListOfCarry(): Using[]  {
        let ret = new Array<Using>();
        switch (this.type) {
            case 'M':
            case 'T':
            case '.':
                // rock
                ret.push(Using.climbinggear);
                ret.push(Using.tourch);
                break;
            case '=':
                // wet
                ret.push(Using.climbinggear);
                ret.push(Using.nothing);
                break;
            case '|':
                // narrow
                ret.push(Using.tourch);
                ret.push(Using.nothing);
                break;
            default:
                throw('Something went wrong');
        }
        return ret;
    }

    getToolToMove(to: CaveElement): Using[] {
        let ccs = this.getListOfCarry();
        let ret = new Array<Using>();

        for (let cc  of ccs) {
            if (to.canCarry(cc) == true) ret.push(cc);
        }

        return ret;
    }

    setDistance(d: Distance): boolean {
        let ccs = this.getListOfCarry();
        let cont = false;
        let minimal = 1000000000000000000000;
        for (let cc of ccs) {
            if (d[cc] != undefined) {
                if (this.distance[cc] == undefined) {
                    this.distance[cc] = d[cc];
                    cont = true;
                    if (minimal > d[cc]) {
                        minimal = d[cc];
                    }
                } else if (d[cc] < this.distance[cc]) {
                    this.distance[cc] = d[cc];
                    if (minimal > d[cc]) {
                        minimal = d[cc];
                    }
                    cont = true;
                }
            }
        }

        for (let cc of ccs) {
            if (this.distance[cc] == undefined) {
                this.distance[cc] = minimal+ChangeTime;
            }
        }

        // if ((this.pos.x == 1) && (this.pos.y == 1)) {
        //     console.log(this.distance);
        //     throw('Final');
        // }

        if (this.distance[ccs[0]] > this.distance[ccs[1]]+ChangeTime) {
            this.distance[ccs[0]] = this.distance[ccs[1]]+ChangeTime;
            cont = true;
        }
            
        if (this.distance[ccs[1]] > this.distance[ccs[0]]+ChangeTime) {
            this.distance[ccs[1]] = this.distance[ccs[0]]+ChangeTime;
            cont = true;
        }

        return cont;
    }

    calculateDistance(d: Distance, t: CaveElement) {
        let prioList = new PrioList();
        this.setDistance(d);
        prioList.addElement(this);

        while(!prioList.isEmpty()) {
            // console.log(prioList.elements);
            let element = prioList.pop();
            if (element === t) return;
            // console.log('Pos: ' + JSON.stringify(element.pos) + ' Distance: ' + JSON.stringify(element.distance));
            

            let vecinos = element.getVecinos();
            for (let v of vecinos) {
                let toolstomovewith = element.getToolToMove(v);
                let newDistance = { [Using.climbinggear]: undefined, [Using.nothing]: undefined, [Using.tourch]: undefined};
                for (let ttmw of toolstomovewith) {
                    newDistance[ttmw] = element.distance[ttmw]+1;
                }
                if (v.setDistance(newDistance))
                    prioList.addElement(v);
            }
        }

        // if (this.type == '=') {
        //     console.log(d);
        //     console.log(this.pos);
        //     console.log(this.distance);
        // }
        

        // if (minimal > MaxDinstance) cont = false;
        // if (cont == false) return;

        // let vecinos = this.getVecinos();

        // for (let v of vecinos) {
        //     let toolstomovewith = this.getToolToMove(v);
        //     let newDistance = { [Using.climbinggear]: undefined, [Using.nothing]: undefined, [Using.tourch]: undefined};
        //     for (let ttmw of toolstomovewith) {
        //         newDistance[ttmw] = this.distance[ttmw]+1;
        //     }
        //     v.calculateDistance(newDistance);
        // }
    }
}

class Cave {
    depth: number;
    target: Pos;
    size: Pos;
    storage: CaveElement[][];

    constructor(d: number, t: Pos) {
        this.depth = d;
        this.size = {x: t.x+25, y: t.y+25};
        this.target = {x: t.x, y: t.y};

        this.storage = new Array<CaveElement[]>();
        for(let y = 0; y < this.size.y; y++) {
            let tmp = new Array<CaveElement>();
            for(let x = 0; x < this.size.x; x++) {
                tmp.push(new CaveElement({x: x, y:y}, this));
            }
            this.storage.push(tmp);
        }
    }

    display() {
        for(let y = 0; y < this.size.y; y++) {
            let str = '';
            let dist = '';
            for(let x = 0; x < this.size.x; x++) {
                str += this.storage[y][x].type;
                if (x < 17) {
                    dist += (this.storage[y][x].distance[Using.tourch] == undefined) ? './' : this.storage[y][x].distance[Using.tourch] + '/';
                    dist += (this.storage[y][x].distance[Using.climbinggear] == undefined) ? './' : this.storage[y][x].distance[Using.climbinggear] + '/';
                    dist += (this.storage[y][x].distance[Using.nothing] == undefined) ? '.-' : this.storage[y][x].distance[Using.nothing] + '-';
                }
            }
            console.log(str + '     ' + dist);
        }
    }



    build() {
        this.storage[0][0].gi = 0;
        this.storage[0][0].el = ( this.storage[0][0].gi + this.depth ) % 20183;
        for (let y = 1; y < this.size.y; y++) {
            this.storage[y][0].gi = y * 48271;
            this.storage[y][0].el = ( this.storage[y][0].gi + this.depth ) % 20183;
        }
        for (let x = 1; x < this.size.x; x++) {
            this.storage[0][x].gi = x * 16807;
            this.storage[0][x].el = ( this.storage[0][x].gi + this.depth ) % 20183;
        }
        for (let y = 1; y < this.size.y; y++) {
            for (let x = 1; x < this.size.x; x++) {
                if ( (x == this.target.y) && (y == this.target.y) ) {
                    this.storage[y][x].gi = 0;
                    this.storage[y][x].el = ( this.storage[y][x].gi + this.depth ) % 20183;
                } else {
                    if ((this.storage[y][x-1].el == undefined) || (this.storage[y-1][x].el == undefined)) {
                        throw('Undefined el if parent');
                    }
                    this.storage[y][x].gi = this.storage[y][x-1].el * this.storage[y-1][x].el;
                    this.storage[y][x].el = ( this.storage[y][x].gi + this.depth ) % 20183;
                }
            }
        }
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                if (this.storage[y][x].el == undefined)
                    throw('el not defined');
                if (this.storage[y][x].gi == undefined)
                    throw('gi not defined');

                switch (this.storage[y][x].el % 3) {
                    case 0: this.storage[y][x].type = '.';
                        break;
                    case 1: this.storage[y][x].type = '=';
                        break;
                    case 2: this.storage[y][x].type = '|';
                        break;
                }
            }
        }

        this.storage[0][0].type = 'M';
        this.storage[this.target.y][this.target.x].type = 'T';
    }

    risk() {
        let risk = 0;
        for (let y = 0; y <= this.target.y; y++) {
            for (let x = 0; x <= this.target.x; x++) {
                switch (this.storage[y][x].type) {
                    case '.':
                        break;
                    case '=':
                        risk += 1;
                        break;
                    case '|':
                        risk += 2;
                        break;
                    case 'M':
                        break;
                    case 'T':
                        break;
                    default:
                        throw ('unkown type');

                }
            }
        }
        console.log('Risk: ' + risk);
    }
}

function execute(d: number, t: Pos) {
    let cave = new Cave(d, t);
    cave.build();
    cave.display();
    cave.risk();

    cave.storage[0][0].calculateDistance({[Using.tourch]: 0, [Using.climbinggear]: ChangeTime, [Using.nothing]: undefined}, cave.storage[cave.target.y][cave.target.x]);
    console.log('Distance: ');
    cave.display();
    console.log(JSON.stringify(cave.storage[cave.target.y][cave.target.x].distance));
}

//execute(510, {x: 10, y: 10});
execute(6084, {x: 14, y: 709});
//run();