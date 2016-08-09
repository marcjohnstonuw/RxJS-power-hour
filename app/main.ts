import {Observable} from 'rxjs/Rx'

const barbarianAttackButton = document.querySelector('.player-list .player:first-child .move.attack');

const dragonAttack = Observable.interval(3000)
						.mapTo({source: 'Dragon', target: 'Barbarian', damage: 10});

const barbarianAttack = Observable.fromEvent(barbarianAttackButton, 'click')
							.throttleTime(1000)
							.mapTo({ source: 'Barbarian', target: 'Dragon', damage: 10 });

const allAttacks = Observable.merge(barbarianAttack, dragonAttack);							

const dragonDamage = allAttacks.filter(x => { return x.target === 'Dragon'})
const barbarianDamage = allAttacks.filter(x => { return x.target === 'Barbarian'})

dragonDamage.subscribe((x) => {
	var el = document.querySelector('.enemy-list .enemy:first-child .current-hit-points');
	var currentHP = parseInt(el.innerHTML);
	el.innerHTML = currentHP - x.damage;
});

barbarianDamage.subscribe((x) => {
	var el = document.querySelector('.player-list .player:first-child .current-hit-points');
	var currentHP = parseInt(el.innerHTML);
	el.innerHTML = currentHP - x.damage;
});

const consoleLogger = allAttacks.subscribe((attack) => {
	console.log(attack.source + ' hits ' + attack.target + ' for ' + attack.damage + '!')
});