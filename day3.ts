import { dataTest } from "./data";
import { data } from "./data";

class Marbel {
    left: Marbel;
    right: Marbel;
    value: number;

    constructor(val: number, l = undefined, r = undefined) {
        if ((l == undefined) && (r == undefined)) {
            this.left = this;
            this.right = this;
        } else {
            this.left = l;
            this.right = r;
        }

        this.value = val;
        
        // console.log('New Marbel with value: ' + this.value + ' left: ' + this.left.value + ' right:' + this.right.value);
    }

    display() {
        let strr = '' + this.value + ' ';
        let strl = '' + this.value + ' ';
        
        let nextr = this.right;
        let nextl = this.left;
        while (nextr != this) {
            strr += nextr.value + ' ';
            strl += nextl.value + ' ';
            nextr = nextr.right;
            nextl = nextl.left;
            if (strr.length > 100) break;
        }

        strr += nextr.value + ' ';
        strl += nextl.value + ' ';

        console.log('Right: ' + strr);
        console.log('Left:  ' + strl);
        
    }

    removeMarbel(): {m: Marbel, p:number} {
        // 0 16  8 17  4 18  9 19  2 20 10 21  5(22)11  1 12  6 13  3 14  7 15
        // 0 16  8 17  4 18   (19) 2 20 10 21  5 22 11  1 12  6 13  3 14  7 15
        let ret = this.left.left.left.left.left.left;

        let p = ret.left.value;
        // console.log('Removed Value: '+ p);


        // remove the one
        // console.log('Remove:');
        // console.log(ret.left);

        ret.left.left.right = ret;
        ret.left = ret.left.left;

        return {m: ret, p:p};
    }

    add(val: number): Marbel {
        // 0 -> 0 -> 0 -> 0
        let place = this.right;
        let newM: Marbel;
        // 0 -> 1 <- 0

        if ((place.left != place.right) && (place.right != place)) {
            newM = new Marbel(val, place, place.right);
            place.right.left = newM;
            place.right = newM;
        } else if ((place.left == place.right) && (place.right != place)) {
            console.log('Same2');
            // 0 1
            // 0 2 1
            newM = new Marbel(val, place, place.right);
            place.right.left = newM;
            place.right = newM;
        } else {
            console.log('Same');
            newM = new Marbel(val, place, place);
            place.right = newM;
            place.left = newM;
        }

        /* console.log('This: ' + this.value + ' left: ' + this.left.value + ' right:' + this.right.value);
        console.log('New: ' + newM.value + ' left: ' + newM.left.value + ' right:' + newM.right.value);

        console.log('Check L this: ' + this.value + ' ' + this.left.value + ' ' + this.left.left.value + ' ' + this.left.left.left.value + ' ' + this.left.left.left.left.value);
        console.log('Check R this: ' + this.value + ' ' + this.right.value + ' ' + this.right.right.value + ' ' + this.right.right.right.value + ' ' + this.right.right.right.right.value);

        console.log('Check L new: ' + newM.value + ' ' + newM.left.value + ' ' + newM.left.left.value + ' ' + newM.left.left.left.value + ' ' + newM.left.left.left.left.value);
        console.log('Check R new: ' + newM.value + ' ' + newM.right.value + ' ' + newM.right.right.value + ' ' + newM.right.right.right.value + ' ' + newM.right.right.right.right.value);

        newM.display();*/

        return newM;
    }
}


function execute(totalplayers: number, marbels: number) {
    let score: number[];
    let marbel = new Marbel(0);
    let start = marbel;
    let player = 0;

    score = new Array<number>(totalplayers);
    for (let i = 0; i < totalplayers+1; i++) {
        score[i] = 0;
    }
    // start.display();
    
    for (let i = 1; i <= marbels; i++) {
        console.log('Play: ' + i);
        player++;
        if (player > totalplayers) {
            player = 1;
        }

        if (i % 23 != 0) {
            // console.log('add marbel')
            marbel = marbel.add(i);
            // start.display();
        } else {
            console.log('update score player ' + player);
            let rem = marbel.removeMarbel();
            console.log('Player: ' + player + 'Points: ' + i + ' ' + rem.p + ' : ' + (i + rem.p));
            score[player] += i + rem.p;
            marbel = rem.m;
        }

    }

    console.log('Scores: ');
    console.log(score);

    let max = score.reduce((a, b) => (a>b) ? a : b);
    console.log('Player: ' + score.indexOf(max) + ' Score: ' + max);
}

let str = execute(410, 7205900);
console.log(str);

