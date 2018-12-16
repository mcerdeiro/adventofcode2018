import { data } from "./data";
import { dataTest } from "./data";
import { prog } from "./data";

class Cpu {
    reg: number[]

    constructor() {
        this.reg = new Array<number>(4);
    }

    getInstr(i: number): string {
        return 'addr';
    }
    
    execute_number(i: number, i1: number, i2: number, o: number) {
       this.execute(this.getInstr(i), i1, i2, o);
    }

    execute(i: string, i1: number, i2: number, o: number) {
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

    

}

function execute(data: string[], prog: string[]) {
    let cpu = new Cpu();
    let pos = [ ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 0
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 1
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 2
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 3
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 4
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 5
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 6
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 7
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 8
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 9
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 10
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 11
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 12
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 13
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 14
                ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'], // 15
            ];
    pos = [ [ 'bori' ],
    [ 'borr' ],
    [ 'addi' ],
    [ 'muli' ],
    [ 'addr' ],
    [ 'bani' ],
    [ 'gtri' ],
    [ 'setr' ],
    [ 'gtrr' ],
    [ 'seti' ],
    [ 'eqir' ],
    [ 'eqrr' ],
    [ 'mulr' ],
    [ 'eqri' ],
    [ 'gtir' ],
    [ 'banr' ] ];
  
  

    let count = 0;
    for(let i = 0; i < data.length; i+=4) {
        let bef = data[i];
        let ins = data[i+1].split(' ').map(a => Number(a));
        let aft = data[i+2];

        console.log('Processing: ' + (i/4) + ' Instruction: ' + ins[0] + ' possible instr: ');
        console.log(pos[ins[0]]);
        
        let opcodecount = 0;
        for (let i = 0; i < pos[ins[0]].length; i++) {
            let e = pos[ins[0]][i];
            console.log('Try ' + e);
            cpu.load(bef);
            cpu.execute(e, ins[1], ins[2], ins[3]);
            if (cpu.compare(aft) == true) {
                console.log('Possible instruction:' + e);
                opcodecount++;
            } else {
                console.log('Instruction:' + e + ' is not possible.');
                pos[ins[0]].splice(i, 1);
                i--;
            }
        }
        // pos[ins[0]].map(function (e, i, self) {
        //     console.log('Try ' + e);
        //     cpu.load(bef);
        //     cpu.execute(e, ins[1], ins[2], ins[3]);
        //     if (cpu.compare(aft) == true) {
        //         console.log('Possible instruction:' + e);
        //         opcodecount++;
        //     } else {
        //         console.log('Instruction:' + e + ' is not possible.');
        //         pos[ins[0]].splice(i, 1);
        //     }
        // });
        if (opcodecount>=3) count++;
        if (opcodecount == 0) {
            throw ('No opcode for this instruction');
        }
        console.log(pos[ins[0]]);
    }

    console.log('Results');
    console.log(count);;

    console.log('Result2');
    console.log(pos);

    cpu.load('Before: [0, 0, 0, 0]');
    for (let p of prog) {
        console.log('Executing: ' + p);
        let inst = p.split(' ');
        cpu.execute(pos[Number(inst[0])][0], Number(inst[1]), Number(inst[2]), Number(inst[3]));
        console.log(cpu);
    }

    console.log('CPU After Run');
    console.log(cpu);
}

execute(data, prog);

