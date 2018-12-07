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

    display() {
        for (let i = 0; i < this.storage.length; i++) {
            let tmp = '';
            for (let j = 0; j < this.storage[i].length; j++) {
                tmp += this.storage[i][j];
            }
            console.log('    ' + tmp);
        }
    }
    
}

function getCoo(line: string): [number, number] {
    line.replace(' ', '');
    let res = line.split(',');

    return [Number(res[0]), Number(res[1])];

}

function getMax(data): [number, number] {
    let ret = [0, 0];
    for (let line of data) {
        let c = getCoo(line);
        if (c[0] > ret[0]) ret[0] = c[0];
        if (c[1] > ret[1]) ret[1] = c[1];
    }

    return [ret[0], ret[1]];
}

function getDistance(c1, c2): number {
    let dist1 = c1[0] - c2[0];
    let dist2 = c1[1] - c2[1];

    if (dist1 < 0) dist1 *= -1;
    if (dist2 < 0) dist2 *= -1;

    return dist1 + dist2;
}

function getIdMinimalDistance(data, c1): number {
    let id = 0;
    let minDist = 1000000000000000000000000;
    let minDistId = 0;
    for (let line of data) {
        id++;

        let c2 = getCoo(line);
        let tmpdist = getDistance(c1, c2);
        // console.log('Distance: ' + c1 + ' to ' + c2 + ' = ' + tmpdist);

        if (minDist > tmpdist) {
            minDist = tmpdist;
            minDistId = id;
        } else if (minDist == tmpdist) {
            minDistId = 0;
        }
    }

    return minDistId;
}

function getSize(st: Storage, id: number): number {
    let size = 0;
    // console.log('Size: ' + st.storage.length);
    for (let i = 0; i < st.storage.length; i++) {
        for (let j = 0; j < st.storage[i].length; j++) {
            // console.log('Checking x:' + i + ' y:' + j + ' value: ' + st.storage[i][j]);
            if (st.storage[i][j] == id) {
                if ((i == 0) || (j == 0) || (i == st.storage.length-1) || (j == st.storage[i].length-1)) return -1;
                size++;
            }
        }
    }

    return size;
}

function execute(data) {
    let maxc = getMax(data);
    console.log('Max x:' + maxc[0] + ' y:' + maxc[1]);

    // create storage
    let storage = new Storage(maxc);

    for (let i = 0; i < maxc[0]+1; i++) {
        for (let j = 0; j < maxc[1]+1; j++) {
            let id = getIdMinimalDistance(data, [i,j]);
            storage.storage[i][j] = id;
            // console.log('Point x:' + i + ' y:' + j + ' min dist to: '+ id + 'set to:'+ storage.storage[i][j]);
        }
    }

    // storage.display();

    let id = 0;
    let maxSize = 0;
    for (let line of data) {
        id++;
        let size = getSize(storage, id);
        console.log('ID: ' + id + ' ' + getCoo(line) + ' size of: ' + size);
        if (size > maxSize) maxSize = size;
    }
    console.log('Max: ' + maxSize);

    let size = 0;
    for (let i = 0; i < storage.storage.length; i++) {
        for (let j = 0; j < storage.storage.length; j++) {
            let dist = 0;
            for (let line of data) {
                dist += getDistance([i,j], getCoo(line));
            }
            if (dist < 10000) size++;
        }
    }
    console.log('Size: ' + size);
}

execute(data);

