import {Observable, Subject} from 'rxjs/Rx'

const barbarianAttackButton = document.querySelector('.player-list .player:first-child .move.attack');
const rogueAttackButton = document.querySelector('.player-list .player:last-child .move.attack');
const healerShieldButton = document.querySelector('.player-list .move.shield');

const dragonAttack = Observable.interval(500)
						.map(function () { 
							return {source: 'Dragon', target: 'Barbarian', damage: 10}
						});

const barbarianAttack = Observable.fromEvent(barbarianAttackButton, 'click')
							.throttleTime(1000)
							.mapTo({ source: 'Barbarian', target: 'Dragon', damage: 10 });

const poisonStrikeAttack = Observable.of(
		{ source: 'Rogue', target: 'Dragon', damage: 6 },
		{ source: 'Rogue', target: 'Dragon', damage: 2 },
		{ source: 'Rogue', target: 'Dragon', damage: 2 },
		{ source: 'Rogue', target: 'Dragon', damage: 2 },
		{ source: 'Rogue', target: 'Dragon', damage: 2 }
	)
	.zip(
		Observable.interval(500).take(5),
		function (left, right) { console.log('poison'); return left; }
	);

const rogueAttack = Observable.fromEvent(rogueAttackButton, 'click')
							.throttleTime(1000)
							.switchMapTo(poisonStrikeAttack);

const autoAttacks = Observable.merge(barbarianAttack, dragonAttack, rogueAttack);	
const allAttacks = new Subject();
const subAllAttacks = autoAttacks.subscribe(allAttacks);

const thinger = autoAttacks.do((x) => console.log(x));
const dragonDamage = allAttacks.filter(x => { return x.target === 'Dragon'})
const barbarianDamage = allAttacks.filter(x => { return x.target === 'Barbarian'}).share()

function getShieldDamageOutput () { return barbarianDamage
	.take(3)
	.map(attack => {
		var reduction = attack.damage * 0.3;
		attack.damage = attack.damage - reduction;
		attack.reduction = reduction;
		return attack;
	})
	.reduce((acc, attack) => {
		acc.damage += attack.reduction;
		return acc;
	}, { source: 'Healer', target: 'Dragon', damage: 0 })
	.do((attack) => {
		allAttacks.next(attack);
	});
};

const healerShieldAttack = Observable.fromEvent(healerShieldButton, 'click')
						.switchMap(getShieldDamageOutput)


healerShieldAttack.subscribe(console.log)


dragonDamage.subscribe((x) => {
	var el = document.querySelector('.enemy-list .enemy:first-child .current-hit-points');
	var currentHP = parseInt(el.innerHTML);
	el.innerHTML = currentHP - x.damage + '';
});

barbarianDamage.subscribe((x) => {
	var el = document.querySelector('.player-list .player:first-child .current-hit-points');
	var currentHP = parseInt(el.innerHTML);
	el.innerHTML = currentHP - x.damage + '';
});

const consoleLogger = allAttacks.subscribe((attack) => {
	console.log(attack.source + ' hits ' + attack.target + ' for ' + attack.damage + '!')
});