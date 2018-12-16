import { data } from "./data";
import { dataTest } from "./data";

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
        this.dist.distance = 100000000000;
        this.dist.isMinimum = false;
    }

    getReadingOrder(): number {
        return this.coor.x + this.coor.y * this.table.table[0].length;
    }

    getEmptyNeighborsWithoutMinDist(): Array<TableElement> {
        return this.getEmptyNeighbors().filter(a => a.dist.isMinimum == false);
    }

    getEmptyNeighbors(): Array<TableElement> {
        return this.getNeighbors().filter(a => a.isEmpty());
    }

    getNeighbors(): Array<TableElement> {
        let tmp = new Array<TableElement>();

        if (this.coor.y>0)
            tmp.push(this.table.table[this.coor.y-1][this.coor.x]);
        if (this.coor.x>0)
            tmp.push(this.table.table[this.coor.y][this.coor.x+1]);
        if (this.coor.x<this.table.table[this.coor.y].length-1)
            tmp.push(this.table.table[this.coor.y][this.coor.x-1]);
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

    setDistance(distance: number, isMinimum = false, te: TableElement) {
        if (this.dist.distance > distance) {
            this.dist.distance = distance;
            this.table.distanceChanged = true;
        }
        if (isMinimum == true) {
            this.dist.isMinimum = isMinimum;
        } else {
            if (this.dist.distance == this.manhattanDistance(te)) {
                this.dist.isMinimum = true;
            }
        }

        let ne = this.getEmptyNeighborsWithoutMinDist().map(a => a.setDistance(distance+1, true, te));
        
        
    }

    distance(te: TableElement): number {
        this.table.resetDist();

        console.log('Disntace');
        this.print();
        te.print();

        te.getEmptyNeighbors().map(a => a.setDistance(1, true, te));
        this.table.display();
        throw('distance');
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
                        if (this.table[y][x].cont.type == ObjectTypeType.elf)
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
        toattack = toattack.sort((a,b) => a.cont.hitpoints - b.cont.hitpoints);
        toattack = toattack.filter(a => a.cont.hitpoints <= toattack[0].cont.hitpoints);
        toattack = toattack.sort(a => a.getReadingOrder());

        console.log('Attacker:');
        this.print();
        console.log('Attacked:');
        toattack[0].cont.print();
        toattack[0].cont.attacked();
    }

    tryToAttack(posiblemoves: TableElement[]): boolean {
        if (this.type == ObjectTypeType.goblin) {
            if ((this.te.coor.x == 4) && (this.te.coor.y == 2)) {
                // console.log('Siiii');
                // console.log(posiblemoves);
                // console.log(posiblemoves.filter(a => a.cont != undefined && a.cont.type == ObjectTypeType.elf));
            }
            // console.log(posiblemoves.filter(a => a.cont != undefined && a.cont.type == ObjectTypeType.elf));
            let toattack = posiblemoves.filter(a => a.cont != undefined && a.cont.type == ObjectTypeType.elf);
            if (toattack.length > 0) {
                console.log('No move, attack1');
                this.attack(toattack);
                return true;
            }
        }

        if (this.type == ObjectTypeType.elf) {
            let toattack = posiblemoves.filter(a => a.cont != undefined && a.cont.type == ObjectTypeType.goblin);
            if (toattack.length > 0) {
                console.log('No move, attack2');
                this.attack(toattack);
                return true;
            }
        }

        return false;
    }

    move(): void {
        if (this.type == ObjectTypeType.wall) return;
        if (this.moved == true) {
            console.log('Already moved');
            return;
        }

        // get possible moves
        let posiblemoves = this.te.getNeighbors();

        // if attack do not move
        if (this.tryToAttack(posiblemoves)) {
            console.log('Attacked so no move.');
            this.print();
            this.moved = true;
        }


        if (!this.moved) {
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

            console.log('Locations to go');
            console.log(te);

            // TODO remove duplicated
            te = te.filter(function(e, i, self) {
                return (i == self.indexOf(e));
            });

            // remove ocupied
            te = te.filter(a => a.cont == undefined)

            // filter out those which are not recable
            // TODO not rechables

            // no movements found
            if (te.length == 0) return;

            // order by distance
            te = te.sort((a,b) => a.distance(this.te) - b.distance(this.te));


            // get only those with the minimal distance
            if (te.length > 1) {
                te = te.filter(a => a.distance(this.te) <= te[0].distance(this.te));
            }

            // order by reading order
            te = te.sort((a,b) => a.getReadingOrder() - b.getReadingOrder());

            let moveto = te[0]; 

            // remove ocupied
            posiblemoves = posiblemoves.filter(a => a.isEmpty());

            // order by distance
            posiblemoves = posiblemoves.sort((a, b) => a.distance(moveto) - b.distance(moveto));
            
            // get only those with the minimal distance
            if (posiblemoves.length > 1) {
                posiblemoves = posiblemoves.filter(a => a.distance(moveto) <= posiblemoves[0].distance(moveto));
            }

            //console.log(posiblemoves);

            // order by reading order
            posiblemoves = posiblemoves.sort((a,b) => a.getReadingOrder() - b.getReadingOrder());

            let movedir = posiblemoves[0];
            //moveto.print();
            //movedir.print();

            if (movedir != undefined) {
                this.te.cont = undefined;
                this.te = movedir;
                movedir.cont = this;
            
                //this.te.table.display();
                // after move check if attack possible
                
                posiblemoves = this.te.getNeighbors();
                // if attack do not move
                this.tryToAttack(posiblemoves);
            }
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

    public attacked() {
        this.hitpoints -= 3;
        if (this.hitpoints <= 0)
            this.die();
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
        this.attackpower = 3;
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
    for (let i = 0; i < 50; i++) {
        console.log('State after ' + i + ' moves.');
        table.display();
        table.move();
    }
    
}

execute(dataTest);