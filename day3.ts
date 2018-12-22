import { data } from "./data";
import { dataTest } from "./data";

class Cpu {
    reg: number[];
    regip: number;
    program: Program;
    count: number;
    values: number[];


    constructor(ip: number) {
        this.reg = new Array<number>(6);
        for (let i = 0; i < this.reg.length;i++) {
            this.reg[i] = 0;
        }
        this.reg[0] = 0;//15883666;
        this.regip = ip;
        this.count = 0;
        this.values = new Array<number>();
    }

    getInstr(i: number): string {
        throw('error');
    }
    
    execute_number(i: number, i1: number, i2: number, o: number) {
       this.execute(this.getInstr(i), i1, i2, o);
    }

    execute(i: string, i1: number, i2: number, o: number) {
        this.count++;
        switch (i) {
            case 'addr':    // 0
                this.reg[o] = this.reg[i1] + this.reg[i2];
                break;
            case 'addi':    // 1
                this.reg[o] = this.reg[i1] + i2;
                break;
            case  'mulr':   // 2
                this.reg[o] = this.reg[i1] * this.reg[i2];
                break;
            case 'muli':    // 3
                this.reg[o] = this.reg[i1] * i2;
                break;
            case 'banr':    // 4
                this.reg[o] = this.reg[i1] & this.reg[i2];
                break;
            case 'bani':    // 5
                this.reg[o] = this.reg[i1] & i2;
                break;
            case 'borr':    // 6
                this.reg[o] = this.reg[i1] | this.reg[i2];
                break;
            case 'bori':    // 7
                this.reg[o] = this.reg[i1] | i2;
                break;
            case 'setr':    // 8
                this.reg[o] = this.reg[i1];
                break;
            case 'seti':    // 9
                this.reg[o] = i1;
                break;
            case 'gtir':    // 10
                this.reg[o] = (i1 > this.reg[i2]) ? 1 : 0;
                break;
            case 'gtri':    // 11
                this.reg[o] = (this.reg[i1] > i2) ? 1 : 0
                break;
            case 'gtrr':    // 12
                this.reg[o] = (this.reg[i1] > this.reg[i2]) ? 1 : 0;
                break;
            case 'eqir':    // 13
                this.reg[o] = (i1 == this.reg[i2]) ? 1 : 0;
                break;
            case 'eqri':    // 14
                this.reg[o] = (this.reg[i1] == i2) ? 1 : 0;
                break;
            case 'eqrr':    // 15
                this.reg[o] = (this.reg[i1] == this.reg[i2]) ? 1 : 0;
                break;
            default:
                throw('Not know instruction');

        }
    }

    instruction(i: string) {
        let inst = i.split(' ');    
        this.execute_number(Number(inst[0]), Number(inst[1]), Number(inst[2]), Number(inst[3]));
    }

    set(reg: number[]) {
        this.reg[0] = reg[0];
        this.reg[1] = reg[1];
        this.reg[2] = reg[2];
        this.reg[3] = reg[3];
    }

    load(line: string) {
        let tmp1 = line.split('efore: [')[1];
        let tmp2 = tmp1.split(']')[0];
        let tmp3 = tmp2.split(',');
        this.reg[0] = Number(tmp3[0]);
        this.reg[1] = Number(tmp3[1]);
        this.reg[2] = Number(tmp3[2]);
        this.reg[3] = Number(tmp3[3]);
    }

    compare(line: string): boolean {
        let tmp1 = line.split('fter:  [')[1];
        let tmp2 = tmp1.split(']')[0];
        let tmp3 = tmp2.split(',');
        if (this.reg[0] != Number(tmp3[0])) return false;
        if (this.reg[1] != Number(tmp3[1])) return false;
        if (this.reg[2] != Number(tmp3[2])) return false;
        if (this.reg[3] != Number(tmp3[3])) return false;

        return true;
    }

    executeprogram(p: Program) {
        this.program = p;
        while(this.program.inRange(this.reg[this.regip])) {
            let tmp = this.program.getInstruction(this.reg[this.regip]).split(' ');
            // if (this.reg[this.regip] == 28) this.display(tmp.join(' '));
            // if (this.reg[this.regip] == 13) this.display(tmp.join(' '));
            // this.display(tmp.join(' '));
            this.execute(tmp[0], Number(tmp[1]), Number(tmp[2]), Number(tmp[3]));
            // increment ip
            this.reg[this.regip]++;
            if (this.reg[this.regip] == 29) {
                this.display(tmp.join(' ') + ' Length: ' + this.values.length);
                if (this.values.indexOf(this.reg[1]) >= 0) {
                    throw('final'); 
                }
                this.values.push(this.reg[1]);
                // throw('final');
            }
        }
    }

    display(s: string) {
        let tmp = new Array<number>();
        tmp.push(this.reg[0]);
        tmp.push(this.reg[1]);
        tmp.push(this.reg[2]);
        tmp.push(this.reg[3]);
        tmp.push(this.reg[5]);

        console.log('Count: ' + this.count + ' IP: ' + this.reg[this.regip] + ' R[' + tmp.join(',') + '] ' + s);

    }

    

}

class Program {
    program: string[]
    cpu: Cpu;

    getInstruction(n: number) {
        return this.program[n+1];
    }

    inRange(n: number): boolean {
        if (n+1 < this.program.length) return true;
        //console.log('Trying to reach: ' + n);
        return false;
    }

    constructor(data: string[]) {
        this.program = data;
        this.cpu = new Cpu(Number(data[0].split('ip ')[1]));
    }

    run() {
        this.cpu.executeprogram(this);
    }

}

function execute(data: string[]) {
    let program = new Program(data);
    program.run();
}



function run() {
    let r0 = 1;
    let r1 = 0;
    let r2 = 0;
    let r3 = 0;
    let r5 = 0;
    let r6 = 0;

    //console.log('IP: 17 [' + r0 +','+r1+','+r2+','+r3+',17,'+r5+']');
    r5 = r5 + 2;
    //console.log('IP: 18 R[' + r0 +','+r1+','+r2+','+r3+',18,'+r5+']');
    r5 = r5 * r5;
    //console.log('IP: 19 R[' + r0 +','+r1+','+r2+','+r3+',19,'+r5+']');
    r5 = 19 * r5;
    //console.log('IP: 20 R[' + r0 +','+r1+','+r2+','+r3+',20,'+r5+']');
    r5 = r5 * 11;
    //console.log('IP: 21 R[' + r0 +','+r1+','+r2+','+r3+',21,'+r5+']');
    r1 = r1 + 4;
    //console.log('IP: 22 R[' + r0 +','+r1+','+r2+','+r3+',22,'+r5+']');
    r1 = r1 * 22;
    //console.log('IP: 23 R[' + r0 +','+r1+','+r2+','+r3+',23,'+r5+']');
    r1 = r1 + 15;               // addi 1 15 1
    //console.log('IP: 24 R[' + r0 +','+r1+','+r2+','+r3+',24,'+r5+']');
    r5 = r5 + r1                //  addr 5 1 5
    
    if (r0 == 1) {
        r1 = 27;            // setr 4 2 1
        r1 = r1 * 28;       // mulr 1 4 1
        r1 = r1 + 29;       // addr 4 1 1
        r1 = 30 * r1;       // mulr 4 1 1
        r1 = r1 * 14;       // muli 1 14 1
        r1 = r1 * 32;       // mulr 1 4 1
        r5 = r5 + r1;       // addr 5 1 5
        r0 = 0;
    }

    //console.log('IP: 1 R[' + r0 +','+r1+','+r2+','+r3+',1,'+r5+']');
    r3 = 1;
    //console.log('IP: 2 R[' + r0 +','+r1+','+r2+','+r3+',2,'+r5+']');
    r2 = 1;

    do {
        //console.log('IP: 3 R[' + r0 +','+r1+','+r2+','+r3+',3,'+r5+']');
        r1 = r2 * r3;               // mulr 3 2 1
        //console.log('IP: 4 R[' + r0 +','+r1+','+r2+','+r3+',4,'+r5+']');
        let tmp = 'IP: 4 R[' + r0 +','+r1+','+r2+','+r3+',4,'+r5+']';
        r1 = (r1 == r5) ? 1 : 0;    // eqrr 1 5 1
        //console.log('IP: 5 R[' + r0 +','+r1+','+r2+','+r3+',5,'+r5+']');
        if (r1 == 1) {              // addr 1 4 4 addi 4 1 4
            console.log('TMP: ' + tmp);
            console.log('IP: 7 R[' + r0 +','+r1+','+r2+','+r3+',7,'+r5+']');
            r0 = r0 + r3;           // addr 3 0 0
        }
        //console.log('IP: 8 R[' + r0 +','+r1+','+r2+','+r3+',8,'+r5+']');
        r2 = r2 + 1;                // addi 2 1 2

        //console.log('IP: 9 R[' + r0 +','+r1+','+r2+','+r3+',9,'+r5+']');
        r1 = (r2 > r5) ? 1 : 0;     // gtrr 2 5 1
        if (r1 == 1) {              // addr 4 1 4
            console.log('IP: 12 R[' + r0 +','+r1+','+r2+','+r3+',12,'+r5+']');
            r3 = r3 + 1;            // addi 3 1 3
            console.log('IP: 13 R[' + r0 +','+r1+','+r2+','+r3+',13,'+r5+']');
            r1 = (r3 > r5) ? 1 : 0; // gtrr 3 5 1
            //console.log('IP: 14 R[' + r0 +','+r1+','+r2+','+r3+',14,'+r5+']');
            if (r1 == 1) {
                console.log('IP: 16 R[' + r0 +','+r1+','+r2+','+r3+',16,'+r5+']');
                throw('final');
            } else {
                ////console.log('IP: 2 R[' + r0 +','+r1+','+r2+','+r3+',2,'+r5+']');
                r2 = 1;
            }
        }
    }  while(1);
}

execute(data);
//run();