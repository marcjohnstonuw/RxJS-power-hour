import {Observable} from 'rxjs/Rx'

const dragonAttack = Observable.interval(3000);

dragonAttack.subscribe((x) => {
	console.log('Dragon attacks for : 10 damage');
	var el = document.querySelector('.player-list .player:first-child .current-hit-points')
	var currentHP = parseInt(el.innerHTML)
	el.innerHTML = currentHP - 10;
});