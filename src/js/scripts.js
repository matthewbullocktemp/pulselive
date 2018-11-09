'use strict';

const PlayerWidget = {
  init: () => {
    PlayerWidget.getPlayers()
  },

	getPlayers: () => {
		const url='https://api.myjson.com/bins/1g8wau'
		fetch(url) // Call the fetch function passing the url of the API as a parameter
		.then((res) => res.json()) // Transform the data into json
		.then((data) => {
			const { players } = data
			PlayerWidget.createSelectOption()
			//for every player in res, create an option element
			players.map(player => {
				PlayerWidget.createOptionList(player)
			})
			//attaches handler to each option
			PlayerWidget.addEventHandler(players)
		})
		.catch((error) => {
		  console.log(error)
		});
  },

	addEventHandler: (players) => {
		document.getElementById('player-select').addEventListener("change", e => {
			const val = e.target.value
			const activePlayer = players.filter(({player} , i) => {
				return player.id == val
			})

      const card = document.getElementById('card-container')
      if(card){
				PlayerWidget.deleteCard(card)
			}

      PlayerWidget.createStatsCard(activePlayer)
		});
	},

	createSelectOption: () => {
		const markup = `
			<div class="card__header card__header--padded">
				<select id="player-select" class="card-select">
						<option disabled selected>Please select a player...</option>
				</select>
			</div>
		`
		document.getElementById('player-widget').insertAdjacentHTML('beforeend' , markup)
	},

	createOptionList: ({player}) => {
		const selectList = document.getElementById('player-select')
		const playerOption = `<option value="${player.id}">${player.name.first} ${player.name.last}</option>`
		document.getElementById('player-select').innerHTML += playerOption
	},

	createStatsCard: (playerData) => {
		const { player , stats } = playerData[0]

    //convert stats arr to obj for easier use in template
    const statsObj = {};
    stats.forEach((item) => {statsObj[item.name] = item; });

    //round both to 2 decimal place
		const goalsPerMatch =  (statsObj.goals.value / statsObj.appearances.value).toFixed(2)
		const passesPerMinute = ((statsObj.fwd_pass.value + statsObj.backward_pass.value) / statsObj.mins_played.value).toFixed(2)

		const statsCard = `
				<div id="card-container" class="card__content">
					<div class="card__image">
							<img src="/img/${player.id}.png" alt="${player.name.first} ${player.name.last} Profile Image">
					</div>
					<div class="card__meta">
						<div class="card__header">
								<div class="card__meta__header__title">
									<h2>${player.name.first} ${player.name.last}</h2>
									${player.info.positionInfo ? '<h4>' + player.info.positionInfo + '</h4>' : ''}
								</div>
								<div class="card__meta__header__icon">
											<img id="${player.currentTeam.shortName.replace(/\s/g,'-').toLowerCase()}" src="img/trans.png" alt="${player.currentTeam.name} Shield Image">
								</div>
						</div>
						<div class="card__meta__content">
							<ul class="card__list">
                ${statsObj.appearances ? '<li class="card__list__item"><span class="card__list__item--left">Appearances</span><span class="card__list__item--right">' + statsObj.appearances.value + "</span></li>" : ''}
              	${statsObj.goals ? '<li class="card__list__item"><span class="card__list__item--left">Goals</span><span class="card__list__item--right">' + statsObj.goals.value + "</span></li>" : ''}
                ${statsObj.goal_assist ? '<li class="card__list__item"><span class="card__list__item--left">Assists</span><span class="card__list__item--right">' + statsObj.goal_assist.value + "</span></li>" : ''}
                ${goalsPerMatch ? '<li class="card__list__item"><span class="card__list__item--left">Goals per match</span><span class="card__list__item--right">' + goalsPerMatch + "</span></li>" : ''}
              	${passesPerMinute ? '<li class="card__list__item"><span class="card__list__item--left">Passes per minute</span><span class="card__list__item--right">' + passesPerMinute + "</span></li>" : ''}
							</ul>
						</div>
					</div>
				</div>
		`;
		document.getElementById('player-widget').insertAdjacentHTML('beforeend' , statsCard)
	},
	deleteCard: (card) => {
		card.remove()
	}
};

PlayerWidget.init()
