import { dataTest } from "./data";
import { data } from "./data";

class TreeElement {
    countChilds: number;
    dataLength: number;
    childs: TreeElement[];
    parent: TreeElement;
    data: number[];
    
    length: number;
    sum: number;
    sumChilds: number;

    pro2: number;

    constructor(code: number[]) {
        this.countChilds = code[0];
        this.dataLength = code[1];

        this.data = new Array<number>();
        this.childs = new Array<TreeElement>();

        this.length = 2;
        this.sum = 0;
        this.sumChilds = 0;
        this.pro2 = 0;

        console.log(code);
        console.log('Constructor TotalChilds:' + this.countChilds + ' current childs count: ' + this.childs.length);
        while (this.countChilds != this.childs.length) {
            let subArray = code.slice(this.length, code.length);
            let child = new TreeElement(subArray);
            this.childs.push(child);

            this.length += child.length;
            this.sumChilds += child.sum + child.sumChilds;
        }

        while (this.dataLength != this.data.length) {
            this.sum += code[this.length]
            this.data.push(code[this.length]);
            this.length++;
        }
        //console.log('Data: ');
        //console.log(this.data);

        if (this.childs.length == 0) {
            this.pro2 = this.data.reduce((a,b) => a+b);
        } else {
            for (let d of this.data) {
                if (this.childs[d-1] != undefined) {
                    this.pro2 += this.childs[d-1].pro2;
                }
            }
        }

    }
}

function convert(data: string): number[] {
    let ret: number[];
    ret = new Array<number>();
    for (let code of data.split(' ')) {
        ret.push(Number(code));
    }
    
    return ret;
}

function execute(data: string): number {
    let code = convert(data);
    let root = new TreeElement(code);

    console.log('Summ: ' + (root.sum + root.sumChilds));
    console.log('Pr2: ' + (root.pro2));

    return 0;
}

let str = execute(data);
console.log(str);

