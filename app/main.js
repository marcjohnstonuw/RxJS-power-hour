"use strict";
var Rx_1 = require('rxjs/Rx');
var barbarianAttackButton = document.querySelector('.player-list .player:first-child .move.attack');
var dragonAttack = Rx_1.Observable.interval(3000)
    .mapTo({ source: 'Dragon', target: 'Barbarian', damage: 10 });
var barbarianAttack = Rx_1.Observable.fromEvent(barbarianAttackButton, 'click')
    .throttleTime(1000)
    .mapTo({ source: 'Barbarian', target: 'Dragon', damage: 10 });
var allAttacks = Rx_1.Observable.merge(barbarianAttack, dragonAttack);
var dragonDamage = allAttacks.filter(function (x) { return x.target === 'Dragon'; });
var barbarianDamage = allAttacks.filter(function (x) { return x.target === 'Barbarian'; });
dragonDamage.subscribe(function (x) {
    var el = document.querySelector('.enemy-list .enemy:first-child .current-hit-points');
    var currentHP = parseInt(el.innerHTML);
    el.innerHTML = currentHP - x.damage;
});
barbarianDamage.subscribe(function (x) {
    var el = document.querySelector('.player-list .player:first-child .current-hit-points');
    var currentHP = parseInt(el.innerHTML);
    el.innerHTML = currentHP - x.damage;
});
var consoleLogger = allAttacks.subscribe(function (attack) {
    console.log(attack.source + ' hits ' + attack.target + ' for ' + attack.damage + '!');
});
//# sourceMappingURL=main.js.map