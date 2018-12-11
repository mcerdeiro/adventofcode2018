import { dataTest } from "./data";
import { data } from "./data";

interface cord {
    x: number;
    y: number;
}

class Point {
    pos: cord;
    vel: cord;

    constructor(p: cord, v: cord) {
        this.pos = p;
        this.vel = v;
    }
}

let storage: Point[];

function GetInfo(line: string): {p: cord, v:cord} {
    // position=< 9,  1> velocity=< 0,  2>
    let pos = line.split('> velocity=')[0].split('osition=<')[1].split(',');
    let vel = line.split('> velocity=<')[1].split('>')[0].split(',');
    //console.log('Line: ' + line);

    let po: cord = { x: Number(pos[0]), y: Number(pos[1]) };
    let ve: cord = { x: Number(vel[0]), y: Number(vel[1]) };

    //console.log(po)
    //console.log(ve)

    return {p: po, v: ve};
}

function display(c: cord, storage: Point[]) {

    for(let y = c.y; y < c.y+30; y++) {
        let str = '';
        let points = storage.filter(a => a.pos.y == y);
        for(let x= c.x; x < c.x+120; x++) {
            let found = points.find(a => a.pos.x == x);
            if (found != undefined) {
                // console.log('X: ' + x + ' Y: ' + y);
                // console.log(found);
                str += '#';
            } else {
                str += '.';
            }
        }
        console.log(str);
    }
}

function run(d: string[]) {
    storage = new Array<Point>(d.length);
    for (let i = 0; i < d.length; i++) {
        let data = GetInfo(d[i]);
        storage[i] = new Point(data.p, data.v);
    }

    let time = 0;
    while(1) {
        let minX = storage.reduce((a,b) => (a.pos.x > b.pos.x) ? b : a );
        let minY = storage.reduce((a,b) => (a.pos.y > b.pos.y) ? b : a );
        console.log('Time: ' + time);
        display({x: minX.pos.x, y: minY.pos.y}, storage);

        storage.map(a => {
            a.pos.x = a.pos.x + a.vel.x;
            a.pos.y = a.pos.y + a.vel.y;
        });
        time ++;

    }

}

run(data);