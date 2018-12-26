import { example1 } from "./data2";
import { example2 } from "./data2";
import { example4 } from "./data2";
import { data } from "./data2";

interface Pos {
    x: number;
    y: number;
    z: number;
    w: number;
}

class Star {
    pos: Pos;

    constructor(d: string) {
        let tmp = d.split(',');
        this.pos = {x: Number(tmp[0]), y: Number(tmp[1]), z: Number(tmp[2]), w: Number(tmp[3])}
        console.log('New star at: ' + JSON.stringify(this.pos) + ' ' + d);
    }

    distance(s: Star) {
        return Math.abs(this.pos.x - s.pos.x) + Math.abs(this.pos.y - s.pos.y) + Math.abs(this.pos.z - s.pos.z) + Math.abs(this.pos.w - s.pos.w);
    }
}

class Constelation {
    stars: Star[] = [];

    checkStars(stars: Star[]): Star[] {
        let changed = true;

        while(changed) {
            changed = false;
            for(let star of stars) {
                if (this.inContelation(star)) {
                    changed = true;
                    this.addStar(star);
                    stars = stars.filter(a => a !== star);
                }
            }
        }

        return stars;
    }

    distance(star: Star): number {
        let ret = Infinity;
        for(let s of this.stars) {
            if (s.distance(star) < ret)
                ret = s.distance(star)
        }

        return ret;
    }

    addStar(s: Star) {
        this.stars.push(s);
    }

    inContelation(star: Star): boolean {
        if (this.distance(star) <= 3) return true;
        return false;
    }

    constructor(star: Star) {
        this.addStar(star);
    }
}

class Space {
    stars: Star[] = [];
    constelations: Constelation[] = [];

    constructor(data: string[]) {
        for (let line of data) {
            this.stars.push(new Star(line));
        }
    }

    process() {
        let remaining = this.stars;

        while(remaining.length > 0) {
            console.log('Remaining stars: ' + remaining.length);
            this.constelations.push(new Constelation(remaining.pop()));

            for (let constelation of this.constelations) {
                remaining = constelation.checkStars(remaining);
            }
        }


    }
}

function execute(data: string[]) {
    let space = new Space(data);

    space.process();

    console.log('Constelations: ' + space.constelations.length);

}

execute(data);