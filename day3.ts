import { data } from "./data";
import { dataTest } from "./data";

const Range = 1000000;
const Step =  100000;
const RangeMid = {"x":22000000,"y":24000000,"z":39000000}

interface Pos {
    x: number,
    y: number,
    z: number
}

function distanceToOrigin(p: Pos): number {
    return Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z);
}

class PrioList<T> {
    storage: T[] = [];
    comp: (a: T, b: T ) => number;

    constructor(comp: (a: T, b: T ) => number) {
        this.comp = comp;
    }

    add(e: T) {
        this.storage.push(e);
        let index = this.storage.length-1;
        let parent = this.storage.length-2;
        while (index > 0 &&  this.comp(this.storage[index], this.storage[parent]) < 0) {
            // exchange
            let tmp = this.storage[index];
            this.storage[index] = this.storage[parent];
            this.storage[parent] = tmp;

            index = parent;
            parent = index-1;
}
    }

    pop(): T {
        return this.storage.pop();
    }

    isEmpty(): boolean {
        if (this.storage.length == 0) return true;
        return false;
    }
}

function compare(a: Robot, b: Robot): number {
    return a.getOverlapCount() - b.getOverlapCount();
}

class Robot {
    static staticcount: number = 0;
    id: Number;
    pos: Pos;
    r: number;
    overlaplist: Robot[] = [];
    overlapall: Robot[] = [];

    calculateNearOrigin() {
        let nearToOrigin: Pos[] = [];
        for (let robot of this.overlapall) {
            nearToOrigin.push(robot.getNearToOrigin());
        }
        nearToOrigin.sort((a,b) => distanceToOrigin(b) - distanceToOrigin(a));
        // console.log('List: ' + JSON.stringify(nearToOrigin));
        console.log('Point ' + JSON.stringify(nearToOrigin[0]) + ' Distance: ' + distanceToOrigin(nearToOrigin[0]));
        
        // console.log('Point ' + JSON.stringify(nearToOrigin[nearToOrigin.length-1]) + ' Distance: ' + distanceToOrigin(nearToOrigin[nearToOrigin.length-1]));
        while(nearToOrigin.length != 0) {
            let tmp = nearToOrigin.pop();
            let count = 0;
            for (let rob of this.overlapall)
            {
                if (rob.inRange(tmp)) {
                    count++;
                }
            }
            if (count == this.overlapall.length) {
                console.log('This point is in all robots: ' + JSON.stringify(tmp) + ' Dist: ' + distanceToOrigin(tmp));
            }
        }
    }



    checkOne(): boolean {
        let check = this.getOverlapCount();
        let tmp = this.overlaplist.pop();
        let count = 0;
        for (let r of this.overlaplist) {
            if (tmp.overlap(r)) count++;
        }
        if (count == this.overlaplist.length)
            this.overlapall.push(tmp);

        if (this.getOverlapCount() > check) {
            throw('This shall not happen');
        }

        if (this.overlaplist.length == 0) return false;
        return true;
    }
    
    toString(): string {
        let str = '';

        str += 'ID: ' + this.id + ' Overlapcount: ' + this.getOverlapCount() + ' (' + this.overlapall.length + '/' + this.overlaplist.length + ') R: ' + this.r + ' POS: ' + JSON.stringify(this.pos);

        return str;
    }

    getOverlapCount(): number {
        return this.overlaplist.length + this.overlapall.length;
    }

    initOverlap(robot: Robot[]) {
        for (let i = 0; i < robot.length; i++) {
            if (robot[i] !== this) {
                if (this.overlap(robot[i]))
                    this.overlaplist.push(robot[i]);
            }
        }
        this.overlapall.push(this);
    }

    toOrigin(): number {
        return Math.abs(this.pos.x) + Math.abs(this.pos.z) + Math.abs(this.pos.y);
    }

    getNearToOrigin(): Pos {
        let diff = {x: -this.pos.x, y: -this.pos.y, z: -this.pos.z};
        let sum = Math.abs(diff.x) + Math.abs(diff.y) + Math.abs(diff.z);
        let pos = {x: this.pos.x+Math.round(diff.x*this.r/sum), y: this.pos.y+Math.round(diff.y*this.r/sum), z: this.pos.z+Math.round(diff.z*this.r/sum)};

        if (this.distance(pos) < this.r) {
            if ((Math.abs(diff.x) > Math.abs(diff.y)) && (Math.abs(diff.x) > Math.abs(diff.z))) {
                pos.x += diff.x/Math.abs(diff.x);
            }
            if ((Math.abs(diff.y) > Math.abs(diff.x)) && (Math.abs(diff.y) > Math.abs(diff.z))) {
                pos.y += diff.y/Math.abs(diff.y);
            }
            if ((Math.abs(diff.z) > Math.abs(diff.x)) && (Math.abs(diff.z) > Math.abs(diff.y))) {
                pos.z += diff.z/Math.abs(diff.z);
            }            
        } else if (this.distance(pos) > this.r) {
            if ((Math.abs(diff.x) > Math.abs(diff.y)) && (Math.abs(diff.x) > Math.abs(diff.z))) {
                pos.x -= diff.x/Math.abs(diff.x);
            }
            if ((Math.abs(diff.y) > Math.abs(diff.x)) && (Math.abs(diff.y) > Math.abs(diff.z))) {
                pos.y -= diff.y/Math.abs(diff.y);
            }
            if ((Math.abs(diff.z) > Math.abs(diff.x)) && (Math.abs(diff.z) > Math.abs(diff.y))) {
                pos.z -= diff.z/Math.abs(diff.z);
            }
        }
        
        /// only for check
        if (this.distance(pos) != this.r) {
            console.log('*************** Problem2 ***************');
            throw('Shall be at distance ');
        }

        return pos;
    }

    overlap(rob: Robot): boolean {
        let robsmallr: Robot = rob;
        let robbigr: Robot = this;
        
        if (rob.r > this.r) {
            robsmallr = this;
            robbigr = rob;
        }

        let r = robsmallr.r;
        let diff = {x: -robsmallr.pos.x+robbigr.pos.x, y: -robsmallr.pos.y+robbigr.pos.y, z: -robsmallr.pos.z+robbigr.pos.z};
        let sum = Math.abs(diff.x) + Math.abs(diff.y) + Math.abs(diff.z);
        let p = {x: robsmallr.pos.x + Math.round(diff.x*r/sum), y: robsmallr.pos.y+Math.round(diff.y*r/sum), z: robsmallr.pos.z+Math.round(diff.z*r/sum)};
        if (robsmallr.distance(p) < robsmallr.r) {
            // console.log('Diff: ' + Math.abs(robsmallr.distance(p) - robsmallr.r));
            // console.log(p);
            if ((Math.abs(diff.x) > Math.abs(diff.y)) && (Math.abs(diff.x) > Math.abs(diff.z))) {
                p.x += diff.x/Math.abs(diff.x);
            }
            if ((Math.abs(diff.y) > Math.abs(diff.x)) && (Math.abs(diff.y) > Math.abs(diff.z))) {
                p.y += diff.y/Math.abs(diff.y);
            }
            if ((Math.abs(diff.z) > Math.abs(diff.x)) && (Math.abs(diff.z) > Math.abs(diff.y))) {
                p.z += diff.z/Math.abs(diff.z);
            }
            // console.log('Diff: ' + Math.abs(robsmallr.distance(p) - robsmallr.r));
            // console.log(p);
        } else if (robsmallr.distance(p) > robsmallr.r) {
            // console.log('Diff: ' + Math.abs(robsmallr.distance(p) - robsmallr.r));
            // console.log(p);
            if ((Math.abs(diff.x) > Math.abs(diff.y)) && (Math.abs(diff.x) > Math.abs(diff.z))) {
                p.x -= diff.x/Math.abs(diff.x);
            }
            if ((Math.abs(diff.y) > Math.abs(diff.x)) && (Math.abs(diff.y) > Math.abs(diff.z))) {
                p.y -= diff.y/Math.abs(diff.y);
            }
            if ((Math.abs(diff.z) > Math.abs(diff.x)) && (Math.abs(diff.z) > Math.abs(diff.y))) {
                p.z -= diff.z/Math.abs(diff.z);
            }
            // console.log('Diff: ' + Math.abs(robsmallr.distance(p) - robsmallr.r));
            // console.log(p);
        }
        

        
        /// only for check
        if (robsmallr.distance(p) != robsmallr.r) {
            console.log('*************** Problem ***************');
            console.log('Robot small: ' + JSON.stringify(robsmallr.pos) + ' R: ' + robsmallr.r);
            console.log('Robot big: ' + JSON.stringify(robbigr.pos) + ' R: ' + robbigr.r);
            console.log('Difs: ' + JSON.stringify(diff) + ' Sum: ' + sum);
            console.log('Prop x: ' + Math.round(diff.x/sum*100) + ' y:' + Math.round(diff.y/sum*100) + ' z: ' + Math.round(diff.z/sum*100));
            console.log('Point: ' + JSON.stringify(p) + ' Overlap: ' + robbigr.inRange(p));
            console.log('WithComa: ' + JSON.stringify({x: robsmallr.pos.x + (diff.x*r/sum), y: robsmallr.pos.y+(diff.y*r/sum), z: robsmallr.pos.z+(diff.z*r/sum)}));
            throw('Shall be at distance ' + robsmallr.r + ' but distance is ' + robsmallr.distance(p));
        }

        // console.log('Robot small: ' + JSON.stringify(robsmallr.pos) + ' ' + robsmallr.r + ' Big: ' +
        //     JSON.stringify(robbigr.pos) + ' ' + robbigr.r + ' P: ' + JSON.stringify(p) + ' Overlap: ' + robbigr.inRange(p));

        if (robbigr.inRange(p)) return true;

        return false;
    }

    constructor(p: Pos, r: number) {
        this.pos = p;
        this.r = r;
        this.id = Robot.staticcount;
        Robot.staticcount++;

        // console.log('New Robot with: ' + this.r + ' ' + JSON.stringify(this.pos));
    }

    distance(r: Robot | Pos): number {
        if (r instanceof Robot)
            return Math.abs(r.pos.x - this.pos.x) + Math.abs(r.pos.z - this.pos.z) + Math.abs(r.pos.y - this.pos.y);
        else 
            return Math.abs(r.x - this.pos.x) + Math.abs(r.z - this.pos.z) + Math.abs(r.y - this.pos.y);
    }

    inRange(r: Pos | Robot): boolean {
        if (this.distance(r) <= this.r) {
            return true;
        }

        return false;
    }

}

class Robots {
    robots: Robot[] = [];

    constructor(data: string[]) {
        for(let line of data) {
            // console.log('Processing line: ' + line);
            this.robots.push(this.createRobot(line));
        }
    }

    createRobot(line: string) {
        let r = Number(line.split('>, r=')[1]);
        let x = Number(line.split('>, r=')[0].split('os=<')[1].split(',')[0]);
        let y = Number(line.split('>, r=')[0].split('os=<')[1].split(',')[1]);
        let z = Number(line.split('>, r=')[0].split('os=<')[1].split(',')[2]);
    
        return new Robot({x: x, y:y,z:z}, r);
    }

    getMaxR(): Robot {
        // console.log('Robots: ' + JSON.stringify(this.robots));
        let ret = this.robots[0];

        this.robots.map((a) => {
            if (a.r > ret.r) 
                ret = a;
         });

        return ret;
    }

    getInRange(r: Robot): Robot[] {
        let robots = Array<Robot>();
        this.robots.map(a => {
            if (r.inRange(a) == true)
                robots.push(a)
        });

        return robots;

    }

    getInTarget(p: Pos): Robot[] {
        let robots = Array<Robot>();
        this.robots.map(a => {
            if (a.inRange(p) == true)
                robots.push(a)
        });

        return robots;
    }

    calculate(): Robot {
        this.robots.sort((a,b) => b.r - a.r);
        let prioList = new PrioList<Robot>(compare);

        for (let i = 0; i < this.robots.length; i++) {
            this.robots[i].initOverlap(this.robots);
            prioList.add(this.robots[i]);
        }

        let last: Robot = undefined;
        while(!prioList.isEmpty()) {
            let tmp = prioList.pop();
            if ((last != undefined) && (last.getOverlapCount() >= tmp.getOverlapCount())) {
                // we found what we search for
                return last;
            }
            // console.log('PrioList: ' + prioList.storage.length + ' Checking: ' + tmp.toString());
            if (tmp.checkOne()) {
                prioList.add(tmp);
            } else {
                last = tmp;
            }
            // console.log('PrioList: ' + prioList.storage.length + ' Checking: ' + tmp.toString());
            
        }

        // for (let i = 0; i < this.robots.length; i++) {
        //     this.robots.sort((a,b) => - a.getOverlapCount() + b.getOverlapCount());
        //     console.log('Robot : ' + i + ' overlaps with ' + this.robots[i].getOverlapCount());
        //     this.robots = this.robots.filter(a => a)
        // }
    }

    
}

function toOrigin(pos:Pos): number {
    return Math.abs(pos.x) + Math.abs(pos.z) + Math.abs(pos.y);
}


function execute(data: string[]) {
    let robots = new Robots(data);

    console.log('Robot with more radius: ' + JSON.stringify(robots.getMaxR()));
    let inRange = robots.getInRange(robots.getMaxR());

    console.log('Count of Robots: ' + robots.robots.length);
    console.log('Robots in Range: ' +  inRange.length);

    let max = robots.calculate();

    console.log('Overlap all: \n' + max.toString());

    max.calculateNearOrigin();

}

execute(data);
