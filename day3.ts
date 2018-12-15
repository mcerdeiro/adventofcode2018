import { data } from "./data";
import { dataTest } from "./data";

class Table {
    table: Element[][];

    constructor(data: string[]) {
        this.table = new Array<Element[]>();
        for (let d of data) {
            
        }
    }
}

enum ElementType {
    'elf',
    'goblin',
    'empty'
}

interface Element {
    type: ElementType;
    
}

class Elf extends Element {

}

function execute(data: string[]) {
    table = new Table(data);
}

execute(dataTest);

