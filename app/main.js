"use strict";
var Rx_1 = require('rxjs/Rx');
var dragonAttack = Rx_1.Observable.interval(3000);
dragonAttack.subscribe(function (x) {
    console.log('Dragon attacks for : 10 damage');
    var el = document.querySelector('.player-list .player:first-child .current-hit-points');
    var currentHP = parseInt(el.innerHTML);
    el.innerHTML = currentHP - 10;
});
//# sourceMappingURL=main.js.map