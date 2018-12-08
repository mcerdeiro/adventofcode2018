import { dataTest } from "./data";
import { data } from "./data";


class Storage {
    storage: number[][];

    constructor([x, y], init = 0) {
        x++;y++;
        console.log('new storage for x: ' + x + ' y:' + y);
        this.storage = new Array(x);
        for (let i = 0; i < x; i++) {
            this.storage[i] = new Array(y);
            for ( let j = 0; j < y; j++) {
                this.storage[i][j] = init;
            }
        }
    }
}

interface dependency {
    step: string;
    dependsFromStep: string[];
}

interface worker {
    working: string;
    time: number;
}

function getDependency(line: string): dependency {
    let tmp = line.split(' ');
    return { step: tmp[7], dependsFromStep: [tmp[1]] };
}

function getNeededTime(letter: string): number {
    return letter.charCodeAt(0)-'A'.charCodeAt(0) + 61;
    // return letter.charCodeAt(0)-'A'.charCodeAt(0) +1;
}

function getStepWithoutDep(storage: dependency[]): dependency[] {
    let stepsWithoutDep: dependency[];
    stepsWithoutDep = new Array();

    // search
    for (let element of storage) {
        if (element.dependsFromStep.length == 0) stepsWithoutDep.push(element);
    }

    return stepsWithoutDep;
}

function getStep(storage: dependency[]): {l: string, s: dependency[]} {
    let stepsWithoutDep: dependency[];
    stepsWithoutDep = new Array();

    // search
    for (let element of storage) {
        if (element.dependsFromStep.length == 0) stepsWithoutDep.push(element);
    }

    if (stepsWithoutDep.length == 0) return { l: '', s: storage };

    stepsWithoutDep.sort((a,b) => (a.step > b.step) ? 1 : 0);
    console.log(stepsWithoutDep[0].step);

    // remove
    storage = storage.filter((a) => a.step != stepsWithoutDep[0].step);

    return { l: stepsWithoutDep[0].step, s: storage };
}


function done(storage: dependency[], done: string): dependency[] {
       // remove
       storage = storage.filter((a) => a.step != done);
       for (let element of storage) {
           element.dependsFromStep = element.dependsFromStep.filter(a => a != done);
       }
   
       // display
       /*for (let element of storage) {
           console.log(element);
       }*/
   
       return storage;
}

function getNextStep(storage: dependency[]): {l: string, s: dependency[]} {
    let stepsWithoutDep: dependency[];
    stepsWithoutDep = new Array();

    // search
    for (let element of storage) {
        if (element.dependsFromStep.length == 0) stepsWithoutDep.push(element);
    }

    if (stepsWithoutDep.length == 0) return { l: '', s: storage };

    stepsWithoutDep.sort((a,b) => (a.step > b.step) ? 1 : 0);
    console.log(stepsWithoutDep[0].step);

    // remove
    storage = storage.filter((a) => a.step != stepsWithoutDep[0].step);
    for (let element of storage) {
        element.dependsFromStep = element.dependsFromStep.filter(a => a != stepsWithoutDep[0].step);
    }

    // display
    /*console.log('exit:');
    for (let element of storage) {
        console.log(element);
    }*/

    return { l: stepsWithoutDep[0].step, s: storage };
}

function execute(data) {
    let storage: dependency[];
    storage = new Array();

    for (let line of data) {
        let dep = getDependency(line);
        let found = storage.find(val => val.step == dep.step);
        if (found) {
            if (found.dependsFromStep.find(step => step == dep.step[0])) {

            } else {
                found.dependsFromStep.push(dep.dependsFromStep[0]);
            }
        } else {
            storage.push(dep);
        }

        found = storage.find(val => val.step == dep.dependsFromStep[0]);
        if (!found) storage.push({ step: dep.dependsFromStep[0], dependsFromStep: new Array() });
    }

    let time = 0;
    
    let workers: worker[] = [ { working: '', time: 0 }, { working: '', time: 0 }, { working: '', time: 0 }, { working: '', time: 0 }, { working: '', time: 0 } ];
    while(1) {

        {
            let todos = getStepWithoutDep(storage);
            let notWorking = workers.filter(a => a.working == '');
            do {
                console.log('check if we can improve');
                console.log(workers);
                console.log(todos);
                console.log(notWorking);
                /* check if we can improve */
                if ( (notWorking.length > 0) || ( todos.length > 0)) {
                    console.log('improvving');
                    let ns = getStep(storage);
                    storage = ns.s;
                    workers[workers.findIndex(a => (a.working == ''))].time = getNeededTime(ns.l);
                    workers[workers.findIndex(a => (a.working == ''))].working = ns.l;
                }

                todos = getStepWithoutDep(storage);
                notWorking = workers.filter(a => a.working == '');
            }
            while ( (todos.length != 0) && (notWorking.length != 0) );
        }

        {
            let todos = getStepWithoutDep(storage);
            let notWorking = workers.filter(a => a.working == '');
            do {
                console.log('Time: ' + time);
                console.log('Workers');
                console.log(workers);
                console.log('TODOS');
                console.log(todos);
                /* move time */
                time++;
                for (let i = 0; i < workers.length; i++) {
                    if (workers[i].working != '') {
                        workers[i].time--;
                        if (workers[i].time == 0) {
                            storage = done(storage, workers[i].working);
                            workers[i].time = -1;
                            workers[i].working = '';
                        }
                    }
                }

                todos = getStepWithoutDep(storage);
                notWorking = workers.filter(a => a.working == '');

                if ((todos.length == 0) && (notWorking.length == workers.length)) return time;
            }
            while ( (todos.length == 0) || (notWorking.length == 0) );
        }

    }
}

let str = execute(data);
console.log(str);

