import { data } from "./data";
import { dataTest } from "./data";
import { dataTest1 } from "./data";
import { dataTest2 } from "./data";
import { dataTest3 } from "./data";
import { dataTest4 } from "./data";
import { dataTest5 } from "./data";
import { dataCheck } from "./data";
import { dataCheck2 } from "./data";
import { example1 } from "./data";
import { example2 } from "./data";
import { example3 } from "./data";


enum ObjectTypeType {
    'elf',
    'goblin',
    'wall',
}

interface Coor {
    x: number;
    y: number;
}

class DistanceTree{
    element: TableElement;
    distance: number;
    childs: DistanceTree[];
    all: DistanceTree[];
    search: TableElement;
    root: DistanceTree;

    isPresent(e: TableElement): boolean {
        return true; 
    }

    addChild(el: DistanceTree) {
        this.childs.push(el);
        this.root.all.push(el);
    }

    constructor(e: TableElement, search: TableElement, root: DistanceTree = undefined) {
        if (root == undefined) {
            this.root = this;
            this.root.all = new Array<DistanceTree>();
            this.root.all.push(this);
        }
        this.element = e;
        this.search = search;
        this.distance = 0;
        this.childs = new Array<DistanceTree>();

        if (search == e) return;
        this.distance = 1;

        let nes = this.element.getEmptyNeighbors();
        if (nes.length == 0) {
            this.distance = 1000000000;
            return;
        }

        let min = 100000000;
        let minchild: DistanceTree;
        let count = 0;
        for (let ne of nes) {
            let tmp = new DistanceTree(ne, search, this.root);
            if (this.root.all.indexOf(tmp) < 0) {
                if (tmp.distance < min) {
                    let min = minchild.distance;
                    minchild = tmp;
                }
                count ++;
                this.addChild(tmp);
            }
        }

        if (count == 0)
            this.distance = 10000000;
        else
            this.distance = min;
    }
}

class DistanceElement {
    data: number[][];

    constructor(t: Table) {
        this.data = new Array<number[]>();
        for (let y = 0; y < t.table.length; y++) {
            let tmp = new Array<number>();
            for (let x = 0; x < t.table[y].length; x++) {
                if (t.table[y][x].isEmpty()) {
                    tmp.push(0);
                } else {
                    tmp.push(1000000);
                }
            }
            this.data.push(tmp);
        }
    }

    public fromto(t1: TableElement, t2: TableElement) {
        t2.getEmptyNeighbors();

        throw('final');
    }

    public display() {
        for(let y = 0; y < this.data.length; y++) {
            let str = '';
            for (let x = 0; x < this.data[y].length; x++) {
                if (this.data[y][x] > 9)
                    str += '#';
                else
                    str += this.data[y][x];
            }
            console.log(str);
        }
    }
}

class TableElement {
    // type: ObjectTypeType;
    table: Table;
    coor: Coor;
    cont: ObjectType;
    dist: { distance: number, isMinimum: boolean };

    resetDist() {
        this.dist.distance = undefined;
        this.dist.isMinimum = false;
    }

    getReadingOrder(): number {
        return this.coor.x + this.coor.y * this.table.table[0].length;
    }

    getEmptyNeighborsWithDistanceBigger(d: number) {
        return this.getEmptyNeighbors().filter(a => ((a.dist.distance == undefined) || (a.dist.distance > d)));
    }

    getEmptyNeighbors(): Array<TableElement> {
        return this.getNeighbors().filter(a => a.isEmpty());
    }

    getNeighbors(): Array<TableElement> {
        let tmp = new Array<TableElement>();

        if (this.coor.y>0)
            tmp.push(this.table.table[this.coor.y-1][this.coor.x]);
        if (this.coor.x>0)
            tmp.push(this.table.table[this.coor.y][this.coor.x-1]);
        if (this.coor.x<this.table.table[this.coor.y].length-1)
            tmp.push(this.table.table[this.coor.y][this.coor.x+1]);
        if (this.coor.y<this.table.table.length-1)
            tmp.push(this.table.table[this.coor.y+1][this.coor.x]);

        return tmp;
    }

    isEmpty(): boolean {
        return this.cont == undefined;
    }

    /**
     * mannhatanDistance
     * 
     * this will always return the minimal possible theorical distance from two points.
     * 
     * @param te table element to measure the distance to
     */
    manhattanDistance(te: TableElement): number {
        return Math.abs(this.coor.x - te.coor.x) + Math.abs(this.coor.y - te.coor.y);
    }

    setDistance(distance: number) {
        this.dist.distance = distance;

        let vecinos = this.getEmptyNeighborsWithDistanceBigger(this.dist.distance+1);

        vecinos.map(a => a.setDistance(this.dist.distance+1));
    }

    distance() {
        this.table.resetDist();

        this.dist.distance = 0;

        let vecinos = this.getEmptyNeighborsWithDistanceBigger(this.dist.distance+1);

        vecinos.map(a => a.setDistance(this.dist.distance+1));

        // console.log('Distance Result:');
        // this.table.display();
        // throw('distance');
        // let de = new DistanceTree(this, te);
        // throw('Final');
        // let dx = Math.abs(this.coor.x - te.coor.x);
        // let dy = Math.abs(this.coor.y - te.coor.y);

        // console.log('Disntace from x:' + this.coor.x + ' y:' + this.coor.y + ' to x:' + te.coor.x + ' y:' + te.coor.y + ' :' + (dx+dy));
        // return dx + dy;
        // return 0;
    }

    resetMoveCounter() {
        if (this.cont != undefined)
            this.cont.resetMoveCounter();
    }

    move() {
        if (this.cont != undefined)
        this.cont.move(); 
    }
    
    constructor(c: Coor, t: Table, e: string) {
        this.dist = { distance: 10000000000, isMinimum: false};
        this.coor = c;
        this.table = t;

        switch(e) {
            case '#':
                this.cont = new Wall(this);
                break;
            case 'E':
                this.cont = new Elf(this);
                break;
            case 'G':
                this.cont = new Gobling(this);
                break;
            default:
                this.cont = undefined;
                break;
        }
    }


    public print() {
        if (this.cont == undefined)
            console.log('Type: . X:' + this.coor.x + ' Y: ' + this.coor.y);
        else
            this.cont.print();
    }

    /**
     * display
     */
    public display(): string {
        if (this.cont == undefined) return '.';
        return this.cont.display();
    }
}

class Table {
    table: TableElement[][];
    elfs: ObjectType[];
    goblins: ObjectType[];
    
    distanceChanged: boolean;

    resetDist() {
        this.distanceChanged = false;
        for (let y = 0; y < this.table.length; y++) {
            for (let x = 0; x < this.table[y].length; x++) {
                this.table[y][x].resetDist();
            }
        }
    }

    getAllElfs(): ObjectType[] {
        if (this.elfs == undefined) {
            this.elfs = new Array<ObjectType>();
            for (let y = 0; y < this.table.length; y++) {
                for (let x = 0; x < this.table[y].length; x++) {
                    if (this.table[y][x].cont != undefined) {
                        if (this.table[y][x].cont.type == ObjectTypeType.elf)
                            this.elfs.push(this.table[y][x].cont);
                    }
                }
            }
        }

        return this.elfs;
    }

    getAllGoblins(): ObjectType[] {
        if (this.goblins == undefined) {
            this.goblins = new Array<ObjectType>();
            for (let y = 0; y < this.table.length; y++) {
                for (let x = 0; x < this.table[y].length; x++) {
                    if (this.table[y][x].cont != undefined) {
                        if (this.table[y][x].cont.type == ObjectTypeType.goblin)
                            this.goblins.push(this.table[y][x].cont);
                    }
                }
            }
        }

        return this.goblins;
    }

    move(): void {
        for(let y = 0; y < this.table.length; y++) {
            for (let x = 0; x < this.table[y].length; x++) {
                this.table[y][x].resetMoveCounter();
            }
        }

        for(let y = 0; y < this.table.length; y++) {
            for (let x = 0; x < this.table[y].length; x++) {
                this.table[y][x].move();
            }
        }
    }

    constructor(data: string[]) {
        this.table = new Array<TableElement[]>();
        let y = 0;
        for (let d of data) {
            let tmp = new Array<TableElement>();
            let x = 0;
            for (let e of d.split('')) {
                let tmpte = new TableElement({x: x, y:y}, this, e);
                tmp.push(tmpte);
                x++;
            }
            y++;
            this.table.push(tmp);
        }
    }

    /**
     * display
     */
    public display() {
        for(let y = 0; y < this.table.length; y++) {
            let pt = '';
            let str = '';
            let dist = '';
            for (let x = 0; x < this.table[y].length; x++) {
                str += this.table[y][x].display();
                if (this.table[y][x].isEmpty())
                    if (this.table[y][x].dist.distance == undefined)
                        dist += '-'
                    else
                        dist += (this.table[y][x].dist.distance > 9) ? 9 : this.table[y][x].dist.distance;
                else
                    dist += '#';

                if (this.table[y][x].cont != undefined && this.table[y][x].cont.isPlayer()) {
                    pt += this.table[y][x].cont.hitpoints + ' - ';
                }
            }
            console.log(str + '     ' + dist + '     ' + pt);
        }
    }
}



class ObjectType {
    type: ObjectTypeType;
    te: TableElement;
    moved: boolean;
    hitpoints: number;
    attackpower: number;

    public isPlayer(): boolean {
        if ((this.type == ObjectTypeType.goblin) || (this.type == ObjectTypeType.elf))
            return true;

        return false;
    }
    
    constructor(te: TableElement) {
        this.te = te;
        this.type = undefined;
        this.attackpower = 0;
        this.hitpoints = 0;
    }

    resetMoveCounter(): void {
        this.moved = false;
    }

    attack(toattack: TableElement[]): void {
        toattack.sort((a,b) => a.cont.hitpoints - b.cont.hitpoints);
        toattack = toattack.filter(a => a.cont.hitpoints <= toattack[0].cont.hitpoints);
        toattack.sort((a,b) => a.getReadingOrder() - b.getReadingOrder());
        // if (toattack.length>1) {
        //     console.log(toattack);
        //     toattack.map(a => console.log(a.cont));
        //     throw('finisch')
        // }

        // console.log('Attacker:');
        //this.print();
        // console.log('Attacked:');
        // toattack[0].cont.print();
        toattack[0].cont.attacked(this);
    }

    tryToAttack(): boolean {
        let posiblemoves = this.te.getNeighbors();
        if (this.type == ObjectTypeType.goblin) {
            // if ((this.te.coor.x == 4) && (this.te.coor.y == 2)) {
                // console.log('Siiii');
                // console.log(posiblemoves);
                // console.log(posiblemoves.filter(a => a.cont != undefined && a.cont.type == ObjectTypeType.elf));
            // }
            // console.log(posiblemoves.filter(a => a.cont != undefined && a.cont.type == ObjectTypeType.elf));
            let toattack = posiblemoves.filter(a => a.cont != undefined && a.cont.type == ObjectTypeType.elf);
            if (toattack.length > 0) {
                // console.log('No move, attack1');
                this.attack(toattack);
                return true;
            }
        }

        if (this.type == ObjectTypeType.elf) {
            let toattack = posiblemoves.filter(a => a.cont != undefined && a.cont.type == ObjectTypeType.goblin);
            if (toattack.length > 0) {
                // console.log('No move, attack2');
                this.attack(toattack);
                return true;
            }
        }

        return false;
    }

    move(): void {
        interface PossibleMove {move: TableElement, distance: number, goal: TableElement};
        let possibleMove = new Array<PossibleMove>();
        if (this.type == ObjectTypeType.wall) return;
        if (this.moved == true) {
            // console.log('Already moved');
            return;
        }

        // if attack do not move
        if (this.tryToAttack()) {
            // console.log('Attacked so no move.');
            // this.print();
            this.moved = true;
        }

        if (!this.moved) {
            if ((this.te.coor.x == 10) && (this.te.coor.y == 11)) {
                console.log('Moving Issue:')
                console.log(this);
            }
            
                // get possible moves
                let posiblemoves = this.te.getEmptyNeighbors();
                // posiblemoves.map(a => possibleMove.push({move: a, distance: undefined, goal: undefined}));
            
            this.moved = true;
            let others: ObjectType[];
            if (this.type == ObjectTypeType.goblin)
                others = this.te.table.getAllElfs();
            else if (this.type == ObjectTypeType.elf)
                others = this.te.table.getAllGoblins();

            let te = new Array<TableElement>();
            for (let o of others) {
                let tetmp = o.te.getEmptyNeighbors();
                te = te.concat(tetmp);
            }

            // remove duplicated
            te = te.filter(function(e, i, self) {
                return (i == self.indexOf(e));
            });

            // no movements found
            if (te.length == 0) return;

            // console.log('Moviendo');
            // console.log(this);

            // console.log('Te: Espacio Libre de contrincantes');
            // console.log(te);

            // console.log('PossibleMove: Posibles casilleros a moverme');
            // possibleMove.map(a => console.log(a.move));

            // calculate the best move of each position.
            for(let checkto of te) {
                checkto.distance();
                // if ((this.te.coor.x == 10) && (this.te.coor.y == 11)) {
                //     if ((checkto.coor.x == 10)&&(checkto.coor.y == 23)) {
                //     this.te.table.display();
                //     }
                //     if ((checkto.coor.x == 12)&&(checkto.coor.y == 23)) {
                //         this.te.table.display();
                //     }
                // }
                for(let pm of posiblemoves) {
                    if (pm.dist.distance != undefined) {
                        possibleMove.push({move: pm, distance: pm.dist.distance, goal: checkto});
                    }
                }
            }
            
            possibleMove = possibleMove.filter(a => (a.distance != undefined));
            // console.log(possibleMove);
            if (possibleMove.length == 0) return;
            possibleMove.sort((a,b) => a.distance - b.distance);
            // get all with minimal distance
            possibleMove = possibleMove.filter(a => (a.distance == possibleMove[0].distance));
            possibleMove.sort((a,b) => a.goal.getReadingOrder() - b.goal.getReadingOrder());

            if ((this.te.coor.x == 10) && (this.te.coor.y == 11)) {
                console.log('Possible moves Before Filter:')
                // console.log(possibleMove);
                possibleMove.map(a => {
                    console.log(a.distance);
                    console.log(a.move.coor);
                    console.log(a.goal.coor);
                });
            }
            
            
            possibleMove = possibleMove.filter(a => a.goal == possibleMove[0].goal);
            possibleMove.sort((a,b) => a.move.getReadingOrder() - b.move.getReadingOrder());

            if ((this.te.coor.x == 10) && (this.te.coor.y == 11)) {
                console.log('Possible moves:')
                console.log(possibleMove);
                possibleMove.map(a => {
                    console.log(a.move.coor);
                    console.log(a.goal.coor);
                });
            }
            // if (possibleMove.length > 1) {
            //     console.log(possibleMove);
            //     possibleMove.map(a=> console.log(a.move));
            //     throw('stop');
            // }
            // console.log('Objeto a mover');
            // console.log(this);
            // console.log('Possible Moves');
            // console.log(possibleMove);
            
            this.te.cont = undefined;
            possibleMove[0].move.cont = this;
            this.te = possibleMove[0].move;
            
            
            // try to attack
            this.tryToAttack();
        }
    }

    public getTypeString(): string {
        if (this.type == ObjectTypeType.elf) return 'E';
        if (this.type == ObjectTypeType.goblin) return 'G';
        if (this.type == ObjectTypeType.wall) return '#';
    }

    public print() {
        console.log('Type: ' + this.getTypeString() + ' X:' + this.te.coor.x + ' Y: ' + this.te.coor.y + ' HP:' + this.hitpoints);
    }

    public attacked(attacker: ObjectType) {
        this.hitpoints -= attacker.attackpower;
        if (this.hitpoints <= 0) {
            if (this.type == ObjectTypeType.elf) {
                throw('An Elf Died');
            }
            this.die();
        }
    }

    public die() {
        this.te.table.elfs = undefined;
        this.te.table.goblins = undefined;
        this.te.cont = undefined;
        this.te = undefined;
    }

    /**
     * display
     */
    public display(): string {
        if (this.type == undefined) return '.';
        switch(this.type) {
            case ObjectTypeType.elf:
                return 'E';
            case ObjectTypeType.wall:
                return '#';
            case ObjectTypeType.goblin:
                return 'G';
        }
    }
}

class Elf extends ObjectType {
    constructor(te: TableElement) {
        super(te);
        this.type = ObjectTypeType.elf;
        this.hitpoints = 200;
        this.attackpower = 18;
    }
}

class Gobling extends ObjectType {
    constructor(te: TableElement) {
        super(te);
        this.type = ObjectTypeType.goblin;
        this.hitpoints = 200;
        this.attackpower = 3;
    }
}

class Wall extends ObjectType {
    constructor(te: TableElement) {
        super(te);
        this.type = ObjectTypeType.wall;
    }
}

function execute(data: string[]) {
    let table = new Table(data);
    console.log('Initial State');
    table.display();

    let i = 0;
    while(1) {
        i++;
        table.move();
        console.log('State after ' + i + ' moves.');
        table.display();
        if (table.getAllElfs().length == 0) 
        {
            let hp = 0;
            let rem = table.getAllGoblins();
            rem.map(a => hp += a.hitpoints);
            console.log('HP: ' + hp + ' Rounds:' + i + ' Total: ' + (i*hp));
            return
        }
        if (table.getAllGoblins().length == 0)
        {
            let hp = 0;
            let rem = table.getAllElfs();
            rem.map(a => hp += a.hitpoints);
            console.log('HP: ' + hp + ' Rounds:' + i + ' Total: ' + (i*hp));
            return
        }
        
        
    }
    
}

execute(data);