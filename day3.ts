import { data } from "./data";
import { dataTest } from "./data";

enum CarMoves {
    left, straigt, right
}

class Car {
    x: number;
    y: number;
    private old:string;
    CarMoves: CarMoves;

    getOld(): string {
        return this.old;
    }
    setOld(o: string) {
        if (isCar(o)) {
            console.log('Setting old to car');
            console.log(this);
        }
        this.old = o;
    }
    
    constructor(x: number, y: number, dir: string) {
        this.x = x;
        this.y = y;
        this.CarMoves = CarMoves.left;
        if ((dir == '<') ||
            (dir == '>') )
            this.setOld('-');

        if ((dir == 'v') ||
            (dir == '^') )
            this.setOld('|');
    }
}

function isCar(s: string): boolean {
    if ( (s == '<') ||
         (s == '>') ||
         (s == 'v') ||
         (s == '^'))
         return true;

    return false;
}

function turn(data: string[][], ret: string[][], car: Car) {
    let y = car.y;
    let x = car.x;
    if (isCar(car.getOld())) {
        console.log('Crash how???');
        // ret[y][x] = 'X';
    } else
    switch(car.getOld()) {
        case '/':
            console.log('Case x:' + x + 'y' + y + ' ' + ret[y][x]);

            if (ret[y][x] == '>') ret[y][x] = '^';
            else if (ret[y][x] == '<') ret[y][x] = 'v';
            else if (ret[y][x] == 'v') ret[y][x] = '<';
            else if (ret[y][x] == '^') ret[y][x] = '>';
            // console.log('Case x:' + x + 'y' + y + ' ' + ret[y][x]);
            break;
        case '\\':
            // console.log('turn');
            // console.log(ret[y][x]);
            if (ret[y][x] == '>') ret[y][x] = 'v';
            else if (ret[y][x] == '<') ret[y][x] = '^';
            else if (ret[y][x] == '^') ret[y][x] = '<';
            else if (ret[y][x] == 'v') ret[y][x] = '>';
            // console.log(ret[y][x]);
            break;
        case '+':
            if (car.CarMoves == CarMoves.left) {
                // console.log(car);
                // console.log(ret[y][x]);
                // console.log('x' + x + 'y' + y);
                if (ret[y][x] == '>') ret[y][x] = '^';
                else if (ret[y][x] == '<') ret[y][x] = 'v';
                else if (ret[y][x] == '^') ret[y][x] = '<';
                else if (ret[y][x] == 'v') ret[y][x] = '>';
                car.CarMoves = CarMoves.straigt;
            } else if (car.CarMoves == CarMoves.straigt) {
                car.CarMoves = CarMoves.right;
            } else if (car.CarMoves == CarMoves.right) {
                if (ret[y][x] == '>') ret[y][x] = 'v';
                else if (ret[y][x] == '<') ret[y][x] = '^';
                else if (ret[y][x] == '^') ret[y][x] = '>';
                else if (ret[y][x] == 'v') ret[y][x] = '<';
                car.CarMoves = CarMoves.left;
            }
            break;
    }
}

function moveCar(data: string[][], ret: string[][], x: number, y: number, car: Car, cars: Car[]) {
    switch(data[y][x]) {
        case '<':
            ret[y][x] = car.getOld();
            car.setOld(ret[y][x-1]);
            if (isCar(car.getOld())) {
                console.log('Crash x'+ x +' y' +y);
                let crashcar = cars.find(a => a.x == (x-1) && a.y == y);
                console.log(crashcar);
                ret[y][x-1] = crashcar.getOld();
                data[y][x-1] = crashcar.getOld(); 
                crashcar.x = -10;
                crashcar.y = -10;
                car.x = -10;
                car.y = -10;
            }
            else {
                ret[y][x-1] = '<';
                car.x -= 1;
                turn(data, ret, car);
            }
            break;

        case '>':
            ret[y][x] = car.getOld();
            car.setOld(ret[y][x+1]);
            if (isCar(car.getOld())) {
                console.log('Crash x'+ x +' y' +y);
                let crashcar = cars.find(a => a.x == (x+1) && a.y == y);
                console.log(crashcar);
                ret[y][x+1] = crashcar.getOld();
                data[y][x+1] = crashcar.getOld();
                crashcar.x = -10;
                crashcar.y = -10;
                car.x = -10;
                car.y = -10;
            }
            else {
                ret[y][x+1] = '>';
                car.x += 1;
                turn(data, ret, car);
            }
            break;

        case '^':
            console.log('Moving up');
            console.log(car);
            ret[y][x] = car.getOld();
            car.setOld(ret[y-1][x]);
            if (isCar(car.getOld())) {
                console.log('Crash x'+ x +' y' +y);
                let crashcar = cars.find(a => a.x == (x) && a.y == (y-1));
                console.log(crashcar);
                ret[y-1][x] = crashcar.getOld();
                data[y-1][x] = crashcar.getOld();
                crashcar.x = -10;
                crashcar.y = -10;
                car.x = -10;
                car.y = -10;
            }
            else {
                ret[y-1][x] = '^';
                car.y -= 1;
                turn(data, ret, car);
            }
            break;

        case 'v':
            ret[y][x] = car.getOld();
            car.setOld(ret[y+1][x]);
            if (isCar(car.getOld())) {
                console.log('Crash x'+ x +' y' +y);
                let crashcar = cars.find(a => a.x == (x) && a.y == (y+1));
                console.log(crashcar);
                ret[y+1][x] = crashcar.getOld();
                data[y+1][x] = crashcar.getOld();
                crashcar.x = -10;
                crashcar.y = -10;
                car.x = -10;
                car.y = -10;
            }
            else {
                ret[y+1][x] = 'v';
                car.y += 1;
                turn(data, ret, car);
            }
            break;
    }
}

function move(data: string[][], cars: Car[]): string[][] {
    let ret: string[][];
    ret = new Array<string[]>(data.length);
    for (let y = 0; y < data.length; y++) {
        let tmp = new Array<string>(data[y].length)
        for (let x = 0; x < data[y].length; x++) {
            tmp[x] = data[y][x];
        }
        ret[y] = tmp;
    }

    for (let y = 0; y < data.length; y++) {
        // console.log('Length: '+ data[y].length);
        for (let x = 0; x < data[y].length; x++) {
            // console.log(data);
            if (isCar(data[y][x])) {
                // console.log('Moving x: '+ x + ' y' + y);
                let car = cars.find(a => a.x == x && a.y == y);
                moveCar(data, ret, x, y, car, cars);
            }
        }
    }

    return ret;
}

function initCars(data: string[][]): Car[] {
    // console.log(data);
    let cars = new Array<Car>();
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            if (isCar(data[y][x])) {
                cars.push(new Car(x,y,data[y][x]));
            }
        }
    }

    return cars;
}

function display(data: string[][]) {
    for (let y = 0; y < data.length; y++) {
        console.log(data[y].reduce((a,b) => a + b));
    }
}

function onlyOneCar(data): boolean {
    let count = 0;
    let cx = 0;
    let cy = 0;
    for (let y = 0 ; y < data.length; y++) {
        for (let x = 0 ; x < data[y].length; x++) {
            if (isCar(data[y][x])) {
                cx = x;
                cy = y; 
                count++;
            }
        }
    }


    if (count == 1) {
        console.log('Only one car x: '+ cx + ' y: '+ cy);
        return true;
    }
    console.log('Current cars: ' + count);
    return false;
}

function hasCrash(data): boolean {
    for (let y = 0 ; y < data.length; y++) {
        for (let x = 0 ; x < data[y].length; x++) {
            if (data[y][x] == 'X') {
                console.log('Crash at x:' + x + ' y:' + y);
                return true;
            }
        }
    }
    return false;
}

function execute(data: string[][]) {
    let cars: Car[];

    cars = initCars(data);

    display(data);
    for (let i = 1; i < 1000000; i++) {
        console.log('Move: ' + i);
        data = move(data, cars);
        display(data);
        
        // if (hasCrash(data)) return;
        if (onlyOneCar(data)) return;
    }

}


function adapt(data: string[]) {
    let tmp: string[][];
    tmp = new Array<string[]>();
    
    for (let i = 0; i < data.length; i++) {
        tmp.push(data[i].split(''));
    }

    execute(tmp);
}

adapt(data);