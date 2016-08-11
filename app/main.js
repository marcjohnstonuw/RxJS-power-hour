"use strict";
var Rx_1 = require('rxjs/Rx');
var barbarianAttackButton = document.querySelector('.player-list .player:first-child .move.attack');
var rogueAttackButton = document.querySelector('.player-list .player:last-child .move.attack');
var healerShieldButton = document.querySelector('.player-list .move.shield');
var dragonAttack = Rx_1.Observable.interval(500)
    .map(function () {
    return { source: 'Dragon', target: 'Barbarian', damage: 10 };
});
var barbarianAttack = Rx_1.Observable.fromEvent(barbarianAttackButton, 'click')
    .throttleTime(1000)
    .mapTo({ source: 'Barbarian', target: 'Dragon', damage: 10 });
var poisonStrikeAttack = Rx_1.Observable.of({ source: 'Rogue', target: 'Dragon', damage: 6 }, { source: 'Rogue', target: 'Dragon', damage: 2 }, { source: 'Rogue', target: 'Dragon', damage: 2 }, { source: 'Rogue', target: 'Dragon', damage: 2 }, { source: 'Rogue', target: 'Dragon', damage: 2 })
    .zip(Rx_1.Observable.interval(500).take(5), function (left, right) { console.log('poison'); return left; });
var rogueAttack = Rx_1.Observable.fromEvent(rogueAttackButton, 'click')
    .throttleTime(1000)
    .switchMapTo(poisonStrikeAttack);
var autoAttacks = Rx_1.Observable.merge(barbarianAttack, dragonAttack, rogueAttack);
var allAttacks = new Rx_1.Subject();
var subAllAttacks = autoAttacks.subscribe(allAttacks);
var thinger = autoAttacks.do(function (x) { return console.log(x); });
var dragonDamage = allAttacks.filter(function (x) { return x.target === 'Dragon'; });
var barbarianDamage = allAttacks.filter(function (x) { return x.target === 'Barbarian'; }).share();
function getShieldDamageOutput() {
    return barbarianDamage
        .take(3)
        .map(function (attack) {
        var reduction = attack.damage * 0.3;
        attack.damage = attack.damage - reduction;
        attack.reduction = reduction;
        return attack;
    })
        .reduce(function (acc, attack) {
        acc.damage += attack.reduction;
        return acc;
    }, { source: 'Healer', target: 'Dragon', damage: 0 })
        .do(function (attack) {
        allAttacks.next(attack);
    });
}
;
var healerShieldAttack = Rx_1.Observable.fromEvent(healerShieldButton, 'click')
    .switchMap(getShieldDamageOutput);
healerShieldAttack.subscribe(console.log);
dragonDamage.subscribe(function (x) {
    var el = document.querySelector('.enemy-list .enemy:first-child .current-hit-points');
    var currentHP = parseInt(el.innerHTML);
    el.innerHTML = currentHP - x.damage + '';
});
barbarianDamage.subscribe(function (x) {
    var el = document.querySelector('.player-list .player:first-child .current-hit-points');
    var currentHP = parseInt(el.innerHTML);
    el.innerHTML = currentHP - x.damage + '';
});
var consoleLogger = allAttacks.subscribe(function (attack) {
    console.log(attack.source + ' hits ' + attack.target + ' for ' + attack.damage + '!');
});
//# sourceMappingURL=main.js.map