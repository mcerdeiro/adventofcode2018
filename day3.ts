import { data } from "./data";
import { dataTest } from "./data";

class Recipie {
    value: number;

    constructor(v: number) {
        this.value = v;
    }
}

function newRecipies(r1: Recipie, r2: Recipie): Recipie[] {
    let tmp = new Array<Recipie>();

    let sum = (r1.value+r2.value).toString();
    if (sum.length == 1) {
        tmp.push(new Recipie(Number(sum)));
    } else {
        tmp.push(new Recipie(Number(sum.split('')[0])));
        tmp.push(new Recipie(Number(sum.split('')[1])));
    }

    return tmp;
}

function myCompare(recipies: Recipie[], input: number[]): number {
    // console.log(recipies);
    let ret = -1;
    let i = 0;
    for (i = recipies.length-20; i < recipies.length; i++) {
        // console.log('Si1;' + i + ' ' + recipies[i].value +' '+ input[0]);
        if (recipies[i].value == input[0])
            break;
    }
    if (i == recipies.length)
        return ret;

    if (i+input.length-1>=recipies.length)
        return ret;

    for (let j = i+1; j < i+input.length; j++) {
        // console.log('Si2:' + j + ' ' + (j-i) + ' ' + recipies[j].value + ' '  + input[j-i]);
        
        if (recipies[j].value != input[j-i]) {
            // while(1);
            return ret;
        }
    }

    console.log('Result: ' + (i));
    return i-input.length;
}

function execute(data: number) {
    let recipies: Recipie[];

    recipies = new Array<Recipie>();

    recipies.push(new Recipie(3));
    recipies.push(new Recipie(7));

    let r1index = 0;
    let r2index = 1;
    let nr = newRecipies(recipies[r1index], recipies[r2index]);
    for (let r of nr) {
        recipies.push(r);
    }

    let input = new Array<number>();
    
    for(let c of data.toString().split('')) {
        input.push(Number(c));
    }
    console.log(input);

    //while(recipies.length < data + 10) {
    let compare = 0;
    while(1) {
        r1index = (1 + recipies[r1index].value + r1index) % recipies.length;
        r2index = (1 + recipies[r2index].value + r2index) % recipies.length;
        let nr = newRecipies(recipies[r1index], recipies[r2index]);
        for (let r of nr) {
            recipies.push(r);
        }

        if (recipies.length>20) {
            if (myCompare(recipies, input)>0)
                return;
        }
        // let str = recipies.map(a => a.value).join();
        // console.log('Here: ' + str);
        //console.log('Data: ' + data.toString().split('').join(','));
        // if (str.indexOf(data.toString().split('').join(',')) > 0) {
        //     console.log('Found: ' + (str.indexOf(data.toString().split('').join(','))/2));
        //     return;
        // }
    }
    let str = '';
    for (let i = data; i < data+10; i++) {
        str += recipies[i].value;
    }
    console.log(str);

}

execute(864801);
