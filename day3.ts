import { data } from "./data";
import { dataTest } from "./data";
import { dataTest2 } from "./data";

//const boost = 22351; //22350 > 22352
const boost = 0;
const boostattackdamage = 84; // 75 a 87

enum ArmyType {
    ImmuneSystem,
    Infection,
}

enum AttackType {
    bludgeoning,
    slashing,
    fire,
    radiation,
    cold,
}

export class Group {
    static static_id = 1;
    id: number;
    units: number;
    hitpointsplus: number;              // amount of damage a unit can take before it is destroyed
    attackdamageplus: number;           // the amount of damage each unit deals
    attacktype: AttackType;
    initiative: number;             // higher initiative units attack first and win ties
    weaknesses: AttackType[];
    immunities: AttackType[];
    armee: Army;

    toBeAttackedBy: Group;
    target: Group;

    static getId_length = 0;

    getAttackDamage(): number {
        if (this.armee == undefined)
            throw('error');
        if (this.armee.type == undefined)
            throw('error');

        if (this.armee.type == ArmyType.ImmuneSystem)
            return this.attackdamageplus + boostattackdamage;
        else
            return this.attackdamageplus;
    }

    getHitpoints(): number {
        if (this.armee.type == ArmyType.ImmuneSystem)
            return this.hitpointsplus + boost;
        else
            return this.hitpointsplus;
    }

    getPossibleTargets(): Group[] {
        let tmp = new Array<Group>();
        if (this.armee.type == ArmyType.ImmuneSystem) {
            this.armee.war.infection.groups.map(a => {
                if ((a.toBeAttackedBy == undefined) && (a.units > 0))
                    tmp.push(a);
            });
        } else {
            this.armee.war.immuneSystem.groups.map(a => {
                if ((a.toBeAttackedBy == undefined) && (a.units > 0))
                    tmp.push(a);
            });
        }

        return tmp;
    }

    printDetails() {
        let weak = '';
        if (this.weaknesses.length > 0) {
            weak += 'weak to ';
            let tmp = new Array<string>();
            this.weaknesses.map(a => tmp.push(this._mapType2String(a)));
            weak += tmp.join(', ');
            weak += ')';
        }
        let immunities = '';
        if (this.immunities.length > 0) {
            immunities += '(immune to ';
            let tmp = new Array<string>();
            this.immunities.map(a => tmp.push(this._mapType2String(a)));
            immunities += tmp.join(', ');
            
        }
        let weak_imm = '';
        if ((weak.length > 0) && (immunities.length > 0))
        {
            weak_imm += ' ' + immunities +'; ' + weak;
        } else if ((weak.length > 0)) {
            weak_imm += ' (' + weak
        } else if (immunities.length > 0) {
            weak_imm += ' ' + immunities + ')';
        }
        console.log(this.units + ' units each with ' + this.getHitpoints() + ' hit points' + weak_imm + ' with an attack that does ' + this.getAttackDamage() +
            ' ' + this._mapType2String(this.attacktype) + ' damage at initiative ' + this.initiative);
    }

    getId(): number {
        if (Group.getId_length == 0) Group.getId_length = this.armee.war.immuneSystem.groups.length;
        if (this.armee.type == ArmyType.Infection) 
            return this.id - Group.getId_length;

        return this.id
    }

    returnMoreDamage(target1: Group, target2: Group): Group {
        if ((target1 == undefined) && (target2 == undefined)) return undefined;
        if (target1 == undefined) {
            if (target2.toBeAttackedBy == undefined) {
                return target2;
            } else {
                return undefined;
            }
        }
        if (target2 == undefined) {
            if (target1.toBeAttackedBy == undefined) {
                return target1;
            } else {
                return undefined;
            }
        }

        if (this.calculateMaxPossibleDamage(target1) > this.calculateMaxPossibleDamage(target2)) {
            return target1;
        }

        if (this.calculateMaxPossibleDamage(target2) > this.calculateMaxPossibleDamage(target1)) {
            return target2;
        }

        if (this.calculateMaxPossibleDamage(target1) == this.calculateMaxPossibleDamage(target2)) {
            if (target1.getEffectivePower() > target2.getEffectivePower()) {
                return target1;
            }
            if (target1.getEffectivePower() < target2.getEffectivePower()) {
                return target2;
            }
            
            if (target1.getEffectivePower() == target2.getEffectivePower()) {
                if (target1.initiative > target2.initiative) {
                    return target1;
                }
                if (target1.initiative < target2.initiative) {
                    return target2;
                }
                if (target1.initiative == target2.initiative) {
                    throw('TODO not sure what to do here');
                } else
                    throw('ASSERT this shall never been reached');
            } else
                throw('ASSERT this shall never been reached');
        } else {
            throw('ASSERT this shall never been reached');
        }
        

    }

    calculateMaxPossibleDamage(target: Group): number {
        let tmp = this.getEffectivePower();

        if (target.isImmune(this))
            tmp *= 0;

        if (target.isWeak(this))
            tmp *= 2;

        return tmp;
    }

    isWeak(attacker: Group): boolean {
        let index = this.weaknesses.findIndex((a,i,self) => a == attacker.attacktype);

        return (index >= 0);
    }

    isImmune(attacker: Group): boolean {
        let index = this.immunities.findIndex((a,i,self) => a == attacker.attacktype);

        return (index >= 0);
    }

    attack() {
        if (this.units <= 0) return;
        if (this.target == undefined) {
            // console.log('ID: ' + this.getId() + ' has no target');
            return;
        } if (this.target.units <= 0) return;

        let maxdamage = this.calculateMaxPossibleDamage(this.target);
        let loses = Math.floor(maxdamage / this.target.getHitpoints());
        if (loses > this.target.units)
            loses = this.target.units;

        this.target.units -= loses;
        
        if (this.target.units <= 0)
            this.target.die();

            //print 'Team ' + str(1-team_i) + ' HP ' + str(teams[team_i][index][HP]) + ' attacks HP: ' + str(teams[1-team_i][to_attack][HP]) + ' damage ' + str(d)
        console.log('HP ' + this.getHitpoints() + ' attacks HP: ' + this.target.getHitpoints() + ' damage ' + loses);
        //console.log('ID: ' + this.id + ' attacks ' + this.target.id + ' with a maxdamage of ' + maxdamage + ' causes the loss of ' + loses + ' units');
        // console.log(this.armee.getType() + ' group ' + this.getId() + ' attacks group ' + this.target.getId() + ', killing ' + loses + ' units');
    }

    die() {
        this.units = 0;
        this.target = undefined;
        // this.armee.remove(this)
        // throw('Check what to do here');
    }

    setAttacker(g: Group) {
        if (this.toBeAttackedBy == undefined) 
            this.toBeAttackedBy = g;
        else
            throw('Can not attack an already under attack');
    }

    setTarget(g: Group) {
        if (this.target == undefined)
            this.target = g;
        else 
            throw('Already a target');

        //console.log('ID: ' + this.id + ' has selected as target ID: ' + this.target.id);
    }

    resetAttack() {
        this.toBeAttackedBy = undefined;
        this.target = undefined;
    }

    private _createAttackType(line: string): AttackType {
        let tmp = line.split('with an attack that does ')[1].split(' ')[1]
        return this._mapString2Type(tmp);
    }

    private _mapString2Type(word: string): AttackType {
        switch (word) {
            case 'bludgeoning': return AttackType.bludgeoning;
            case 'slashing': return AttackType.slashing;
            case 'fire': return AttackType.fire;
            case 'radiation': return AttackType.radiation;
            case 'cold': return AttackType.cold;
            default: 
                throw('Unknown attacktype "' + word + '"');
        }
    }

    private _mapType2String(type: AttackType): string {
        switch (type) {
            case AttackType.bludgeoning: return 'bludgeoning';
            case AttackType.slashing: return 'slashing';
            case AttackType.fire: return 'fire';
            case AttackType.radiation: return 'radiation';
            case AttackType.cold: return 'cold';
            default: 
                throw('Unknown attacktype "' + type + '"');
        }
    }

    private _createWeakImmunity(line: string) {
        this.weaknesses = new Array<AttackType>();
        this.immunities = new Array<AttackType>();

        if (!line.includes('(')) return
        
        let tmp = line.split('(')[1].split(')')[0];
        
        if (tmp.includes('weak to ')) {
            let weak = tmp.split('weak to ')[1].split(';')[0].split(', ');
            for (let w of weak) {
                this.weaknesses.push(this._mapString2Type(w));
            }
        }
        
        if (tmp.includes('immune to ')) {
            let weak = tmp.split('immune to ')[1].split(';')[0].split(', ');
            for (let w of weak) {
                this.immunities.push(this._mapString2Type(w));
            }
        }

    }

    getEffectivePower(): number {
        return this.units * this.getAttackDamage();
    }

    constructor(line: string, a?: Army) {
        this.id = Group.static_id++;
        this.armee = a;
        this.units = Number(line.split(' ')[0]);
        this.hitpointsplus = Number(line.split(' ')[4]);
        this.attackdamageplus = Number(line.split('with an attack that does ')[1].split(' ')[0]);
        this.initiative = Number(line.split('initiative ')[1]);
        this.attacktype = this._createAttackType(line);
        this._createWeakImmunity(line);
    
        // console.log('Group: ' + line);
        // console.log(this);
    }
}

class Army {
    type: ArmyType;
    groups: Group[];
    war: War;

    getType(): string {
        if (this.type == ArmyType.ImmuneSystem) return 'Immune System';
        if (this.type == ArmyType.Infection) return 'Infection';
    }

    remove(g: Group) {
        this.groups = this.groups.filter((a) => a !== g);

    }

    printDetails() {
        console.log(this.getType() + ':');
        this.groups.map(a => a.printDetails());
        console.log();
    }

    printGroups() {
        let count = 1;
        if (this.type == ArmyType.ImmuneSystem) console.log('Immune System');
        if (this.type == ArmyType.Infection) console.log('Infection');
        for (let g of this.groups) {
            console.log('Group ' + g.getId() + ' contains ' + g.units + ' units with hp: ' + g.getHitpoints());
            count++;
        }

    }

    getUnits(): number {
        let tmp = 0;
        for (let g of this.groups) {
            tmp += g.units;
        }

        return tmp;
    }


    constructor(data: string[], w: War) {
        this.war = w;
        this.groups = new Array<Group>();
        for (let line of data) {
            this.groups.push(new Group(line, this));
        }
    }
}

class ImmuneSystem extends Army {
    constructor(data: string[], w: War) {
        super(data, w);
        this.type = ArmyType.ImmuneSystem;
    }
}

class Infection extends Army {
    constructor(data: string[], w: War) {
        super(data, w);
        this.type = ArmyType.Infection;
    }
}

export class War {
    finish(): boolean {
        if (this.immuneSystem.getUnits() == 0) return true;
        if (this.infection.getUnits() == 0) return true;
        return false;
    }

    getWinner(): Army {
        if (this.immuneSystem.getUnits() == 0) return this.infection;
        if (this.infection.getUnits() == 0) return this.immuneSystem;
        throw('Error');
    }

    immuneSystem: ImmuneSystem;
    infection: Infection;

    getAllGroups(): Group[] {
        let tmp = new Array<Group>();
        this.immuneSystem.groups.map(a => tmp.push(a));
        this.infection.groups.map(a=> tmp.push(a));
        
        return tmp;
    }

    print() {
        this.immuneSystem.printDetails();
        this.infection.printDetails();
    }

    constructor(data: string[]) {
        let readData: string[][];
        let reading: ArmyType;

        readData = new Array<string[]>(2);
        readData[ArmyType.ImmuneSystem] = new Array<string>();
        readData[ArmyType.Infection] = new Array<string>();

        for(let line of data) {
            
            if (line.indexOf('Immune System')>= 0) {
                reading = ArmyType.ImmuneSystem;
                continue;
            }
            if (line.indexOf('Infection')>= 0) {
                reading = ArmyType.Infection;
                continue;
            }
            if (line.length == 0) continue;

            readData[reading].push(line);
        }

        this.immuneSystem = new ImmuneSystem(readData[ArmyType.ImmuneSystem], this);
        this.infection = new Infection(readData[ArmyType.Infection], this);

    }

    targetSelection() {
        let tmp = this.immuneSystem.groups
        tmp.sort()

        tmp.sort((a,b) => {
            if (a.getEffectivePower() == b.getEffectivePower()) {
                return b.initiative - a.initiative;
            } else return b.getEffectivePower() - a.getEffectivePower();
            });

        for (let g of tmp) {
            g.resetAttack();
        }

        for (let attacker of tmp) {
            if (attacker.getEffectivePower() == 0) continue;
            let possibleTargets = attacker.getPossibleTargets();

            let toAttack: Group;
            for (let possibleTarget of possibleTargets) {
                if (attacker === possibleTarget)                // do not check for my self
                    continue;
                if (possibleTarget.armee === attacker.armee)    // do not check for those of my armee
                    continue;
                
                toAttack = attacker.returnMoreDamage(toAttack, possibleTarget);
            }
            if (toAttack != undefined) {
                if (attacker.calculateMaxPossibleDamage(toAttack) != 0) {
                // console.log(attacker.armee.getType() + ' group ' + attacker.getId() + ' will attack group ' + toAttack.getId() + ' ' + attacker.calculateMaxPossibleDamage(toAttack) + ' damage');
                toAttack.setAttacker(attacker);
                attacker.setTarget(toAttack);
                }
            }
        }
        tmp.map(a=> {
            if (a.target != undefined)
                console.log('HP: ' + a.getHitpoints() + ' Power: ' + a.getEffectivePower() + ' selected ' + a.target.getHitpoints());
            else   
                console.log('HP: ' + a.getHitpoints() + ' Power: ' + a.getEffectivePower() + ' selected none');
        });

        tmp = this.infection.groups
        tmp.sort()

        tmp.sort((a,b) => {
            if (a.getEffectivePower() == b.getEffectivePower()) {
                return b.initiative - a.initiative;
            } else return b.getEffectivePower() - a.getEffectivePower();
            });

        for (let g of tmp) {
            g.resetAttack();
        }

        for (let attacker of tmp) {
            if (attacker.getEffectivePower() == 0) continue;
            let possibleTargets = attacker.getPossibleTargets();

            let toAttack: Group;
            for (let possibleTarget of possibleTargets) {
                if (attacker === possibleTarget)                // do not check for my self
                    continue;
                if (possibleTarget.armee === attacker.armee)    // do not check for those of my armee
                    continue;
                
                toAttack = attacker.returnMoreDamage(toAttack, possibleTarget);
            }
            if (toAttack != undefined) {
                if (attacker.calculateMaxPossibleDamage(toAttack) != 0) {
                // console.log(attacker.armee.getType() + ' group ' + attacker.getId() + ' will attack group ' + toAttack.getId() + ' ' + attacker.calculateMaxPossibleDamage(toAttack) + ' damage');
                toAttack.setAttacker(attacker);
                attacker.setTarget(toAttack);
                }
            }
        }
        tmp.map(a=> {
            if (a.target != undefined)
                console.log('HP: ' + a.getHitpoints() + ' Power: ' + a.getEffectivePower() + ' selected ' + a.target.getHitpoints());
            else   
                console.log('HP: ' + a.getHitpoints() + ' Power: ' + a.getEffectivePower() + ' selected none');
        });
        

    }

    targetAttack() {
        let attackers = this.getAllGroups();
        attackers.sort((a,b) => b.initiative - a.initiative);

        // if (1) {
        //     console.log('Shall by order by initiative');
        //     console.log(tmp);
        //     throw('Check');
        // }
        for (let a of attackers) {
            a.attack();
        }
    }


}


function execute(data: string[]) {
    let war = new War(data);
    let i = 0;

    war.print();

    while(!war.finish()) {
        console.log('Results: ' + i++);
        // war.immuneSystem.printGroups();
        // war.infection.printGroups();
        // console.log('Total Units: ' + (war.immuneSystem.getUnits()+war.infection.getUnits()));
        // console.log();
        war.targetSelection();
        // console.log();
        war.targetAttack();

        console.log('Team: 0');
        for (let g of war.immuneSystem.groups) {
            console.log('HP: ' + g.getHitpoints() + ' Units: ' + g.units);
        }
        console.log('Team: 1');
        for (let g of war.infection.groups) {
            console.log('HP: ' + g.getHitpoints() + ' Units: ' + g.units);
        }
        console.log('Total units: ' + (war.immuneSystem.getUnits() + war.infection.getUnits()));


        // if (war.immuneSystem.getUnits() + war.infection.getUnits() <= 29013)  {
        //     war.immuneSystem.printGroups();
        //     war.infection.printGroups();
        //     break;
        // }
    }

    // console.log('*** RESULT ***');
    // war.immuneSystem.printGroups();
    // war.infection.printGroups();
    // console.log();
    
    // console.log('Units: ' + war.immuneSystem.getUnits() + ' ' + war.infection.getUnits());
    let winner = war.getWinner();
    // console.log('Winner' + winner.type);
    // console.log('Total Units: ' + winner.getUnits());
    
}

execute(data);
