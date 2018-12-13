import { dataTest } from "./data";
import { data } from "./data";

function display(p: boolean[]) {
    let str = '';
    for (let i = 0; i < p.length; i++) {
        str += p[i] ? '#' : '.';
    }
    console.log(str);
}

function process(pots: boolean[], lives: boolean[][], dies: boolean[][]): boolean[] {
    let ret = new Array<boolean>(pots.length)
    for (let i = 0; i < ret.length; i++) {
        ret[i] = false;
    }

    for (let i = 2; i < pots.length-2; i++) {
        let tmp =  new Array<boolean>();
        tmp.push(pots[i-2]);
        tmp.push(pots[i-1]);
        tmp.push(pots[i-0]);
        tmp.push(pots[i+1]);
        tmp.push(pots[i+2]);

        // console.log('Search for in pos:' + i);
        // console.log(tmp);
        let l = lives.filter(a => {
            for (let i = 0; i < a.length; i++) {
                if (a[i] != tmp[i])
                    return false;
            }
            // console.log('Lives: ');
            // console.log(a);
            return true;
            }).length;
        let d = dies.filter(a => {
            for (let i = 0; i < a.length; i++) {
                if (a[i] != tmp[i])
                    return false;
            }
            // console.log('Dies: ');
            // console.log(a);
            return true;
            }).length;
        if (l > 0) {
            ret[i] = true;
        }
    }

    for (let i = 0; i < ret.length; i++) {
        pots[i] = ret[i];
    }

    return ret;
}

function run(data: string[]) {
    const diff = 4000;
    let pots: boolean[];
    let lives: boolean[][];
    let dies: boolean[][];

    lives = Array<boolean[]>();
    dies = Array<boolean[]>();

    pots = new Array<boolean>();
    for (let i = 0; i < diff; i++) {
        pots.push(false);
    }

    let initStates = data[0].split('nitial state: ')[1].split('');
    for (let initState of initStates) {
        if(initState == '#') {
            pots.push(true);
        } else {
            pots.push(false);
        }
    }

    for (let i = 0; i < diff; i++) {
        pots.push(false);
    }

    display(pots);

    data.shift();

    for (let d of data) {
        let tmp = d.split(' => ');
        let lord: boolean[];
        lord = new Array<boolean>();
        for (let val of tmp[0].split('')) {
            if (val == '#')
                lord.push(true);
            else
                lord.push(false);
        }
        if (tmp[1] == '#')
            lives.push(lord);
        else
            dies.push(lord);
    }

    console.log(lives);
    console.log(dies);

    display(pots);
    let tmp_old = 0;
    for(let i = 0; i < 1500; i++) {
        process(pots, lives, dies);
        display(pots);
        let tmp = 0;
        for(let i = 0; i < pots.length; i++) {
            if (pots[i] == true) {
                tmp += i-diff;
            }
        }
        let dif = tmp-tmp_old;
//        console.log('I:' + (i+1) + ' Summ: ' + tmp + ' diff: ' + (dif));
        tmp_old = tmp;

        
    }
    display(pots);



}


run(data);
// let gen = 50000000000;
// console.log(8990+58*(gen-123));