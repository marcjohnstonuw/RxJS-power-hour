"use strict";
var Rx_1 = require('rxjs/Rx');
var dragonAttack = Rx_1.Observable.interval(3000);
var barbarianAttackButton = document.querySelector('.player-list .player:first-child .move.attack');
dragonAttack.subscribe(function (x) {
    console.log('Dragon attacks for : 10 damage');
    var el = document.querySelector('.player-list .player:first-child .current-hit-points');
    var currentHP = parseInt(el.innerHTML);
    el.innerHTML = currentHP - 10;
});
var barbarianAttack = Rx_1.Observable.fromEvent(barbarianAttackButton, 'click')
    .throttleTime(1000)
    .mapTo({ name: 'Barbarian', damage: 10 });
barbarianAttack.subscribe(function (x) {
    console.log(x.name + ' attacks for : ' + x.damage + ' damage');
    var el = document.querySelector('.enemy-list .enemy:first-child .current-hit-points');
    var currentHP = parseInt(el.innerHTML);
    el.innerHTML = currentHP - x.damage;
});
//# sourceMappingURL=main.js.map