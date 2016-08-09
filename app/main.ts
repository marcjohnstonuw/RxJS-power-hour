import {Observable} from 'rxjs/Rx'

const dragonAttack = Observable.interval(3000);

const barbarianAttackButton = document.querySelector('.player-list .player:first-child .move.attack');

dragonAttack.subscribe((x) => {
	console.log('Dragon attacks for : 10 damage');
	var el = document.querySelector('.player-list .player:first-child .current-hit-points');
	var currentHP = parseInt(el.innerHTML);
	el.innerHTML = currentHP - 10;
});

const barbarianAttack = Observable.fromEvent(barbarianAttackButton, 'click');

barbarianAttack.subscribe((x) => {
	console.log('got click, here is the event :' + x);
})