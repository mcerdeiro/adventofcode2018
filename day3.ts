import { dataTest } from "./data";
import { data } from "./data";

enum Type {guard, wake, sleep };

function getType(line: string): Type {
    if (line.indexOf('Guard #') > 0) {
        return Type.guard;
    }
    if (line.indexOf('wakes up') > 0) {
        return Type.wake;
    }
    if (line.indexOf('falls asleep') > 0) {
        return Type.sleep
    }
    console.log('this shall not happens');
    while(1);
}

function getGuard(line: string): number {
    // '[1518-02-05 00:00] Guard #3109 begins shift',
    const id = line.split('#')[1].split(' ')[0];
    return Number(id);
}

function getMinutes(line: string): number {
    // '[1518-02-05 00:50] falls asleep',
    const minutes = line.split(']')[0].split(':')[1];
    return Number(minutes);

}

function processData(data: number[][], guard: number, sleep: number, wake: number): void {
    for (let i = sleep; i < wake; i++) {
        if (data[guard] === undefined) {
            data[guard] = Array<number>();
            data[guard][i] = 1;
        } else if (data[guard][i] === undefined) {
            data[guard][i] = 1;
        } else {
            data[guard][i]++;
        }
    }

    console.log('Guard: ' + guard);
    console.log('000000000011111111112222222222333333333344444444445555555555');
    console.log('012345678901234567890123456789012345678901234567890123456789');
    let toprint = '';
    for (let i = 0; i < 61; i++) {
        if (data[guard][i] > 0) {
            toprint += '#'
        } else {
            toprint += '.'
        }
    }
    console.log(toprint);
}

function execute() {
    let storage: number[][];
    let guard: number;
    let sleep: number;
    let wake: number;
    let maxId = 0;

    storage = Array();
    for(const line of data) {
        // console.log('processing: ' + line);
        switch (getType(line)) {
            case Type.guard:
                guard = getGuard(line);
                // console.log('Guard ' + guard + ' started shift...');
                break;
            case Type.sleep:
                sleep = getMinutes(line);
                // console.log('Guard ' + guard + ' sleept on ' + sleep);
                break;
            case Type.wake:
                if (sleep < 0) {
                    console.log('error this shall not occur');
                    while(1);
                }
                wake = getMinutes(line);
                console.log('Guard ' + guard + ' sleept on ' + sleep + ' and weeks up on ' + wake);
                processData(storage, guard, sleep, wake);
                if (maxId < guard) {
                    maxId = guard;
                }
                sleep = -1;
                break;

        }

    }

    let MaxTime = 0;
    let Id: number;
    for(let i = 0; i <= maxId; i++) {
        let tmp = 0;
        for(let j = 0; j < 60; j++) {
            if ((storage[i] !== undefined) && (storage[i][j] !== undefined)) {
                tmp += storage[i][j];
            }
        }
        console.log('Guard #' + i + ' sleeped for ' + tmp + 'minutes...');
        if (tmp > MaxTime) {
            MaxTime = tmp;
            Id = i;
        }
    }
    console.log('Max Guard #' + Id + ' sleeped for ' + MaxTime + 'minutes...');

    let whoof = 0;
    let min = 0;

    for(let j = 0; j < 60; j++) {
        if ((storage[Id] !== undefined) && (storage[Id][j] !== undefined)) {
            if (whoof < storage[Id][j]) {
                whoof = storage[Id][j];
                min = j;               
            }
        }
    }
    console.log('Guard #' + Id + ' was sleeped ' + whoof + ' at minute ' + min);

    console.log('Result: ' + Id*min);


    let p2_Id = 0;
    let p2_Min = 0;
    let p2_WO = 0;
    for(let i = 0; i <= maxId; i++) {
        let tmp = 0;
        for(let j = 0; j < 60; j++) {
            if ((storage[i] !== undefined) && (storage[i][j] !== undefined)) {
                if (storage[i][j] > p2_WO) {
                    p2_WO = storage[i][j];
                    p2_Min = j;
                    p2_Id = i;
                }
            }
        }
    }
    console.log('The ID#' + p2_Id + ' sleeped ' + p2_WO + ' at minute ' + p2_Min);
    console.log('Result: ' + p2_Id* p2_Min);

}

execute();

