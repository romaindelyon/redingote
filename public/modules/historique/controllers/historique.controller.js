'use strict';

angular.module('historique').controller('HistoriqueController', ['$scope','Joueurs',
	function($scope,Joueurs) {

	// TODO: change this
	$scope.partieId = 1;

	$scope.joueurs = [];
	Joueurs.getJoueurs({partieId: $scope.partieId}).success(function(response){
		$scope.joueurs = response;
		grouperHistorique();
	});

	var date = new Date();

	var eventLog = [
		{
			id: 1,
			stamp: date,
			joueur: 0,
			categorie: 'deplacement',
			type: 'plateau-paysage',
			info: {
				de: 2,
				depart: '10',
				arrivee: '10B2',
				mode: 'normal'
			}
		},
		{
			id: 3,
			stamp: date,
			joueur: 0,
			categorie: 'duel',
			type: 'attaque',
			info: {
				cible: 2
			}
		},
		{
			id: 2,
			stamp: date,
			joueur: 1,
			categorie: 'carte',
			type: 'defausse',
			info: {
				cartes: ['fumee_de_cigarettes','orque_casque_anti_bruit']
			}
		},
		{
			id: 6,
			stamp: date,
			joueur: 1,
			categorie: 'carte',
			type: 'defausse',
			info: {
				cartes: ['quart_de_singe']
			}
		},
		{
			id: 4,
			stamp: date,
			joueur: 2,
			categorie: 'duel',
			type: 'defense',
			info: {
				source: 0,
				results_source: [14,4,18],
				results_cible: [1,6,19],
				result_source: 14,
				result_cible: 5,
				modulo: 18
			}
		}
	];

	$scope.historique = [];
	var lastIndex = -1;

	// Grouper par joueur:
	function grouperHistorique(){
		for (var i in eventLog){
			// Ajouter information d'expandabilite
			if (eventLog[i].categorie === 'duel' && eventLog[i].type === 'defense' ||
				eventLog[i].categorie === 'carte' && eventLog[i].type === 'defausse'){
				eventLog[i].expandable = true;
			}
			// Creer nouvel intervalle
			if ($scope.historique[lastIndex] === undefined || $scope.historique[lastIndex].joueur !== eventLog[i].joueur){
				$scope.historique.push({
					joueur: eventLog[i].joueur,
					style: "{'background-color': '" + $scope.joueurs[eventLog[i].joueur].backgroundColor + "'}",
					events: [eventLog[i]]
				});
				lastIndex ++;
			}
			// Ajouter element a intervalle existant
			else {
				var lastEvent = $scope.historique[lastIndex].events.length - 1;
				// Agreger plusieurs elements ensemble:
				if ($scope.historique[lastIndex].events[lastEvent].categorie === 'carte' && eventLog[i].categorie === 'carte' &&
					$scope.historique[lastIndex].events[lastEvent].type === eventLog[i].type){
					if ($scope.historique[lastIndex].events[lastEvent].type === 'defausse' && eventLog[i].categorie === 'defausse'){
						$scope.historique[lastIndex].events[lastEvent].info.cartes.push(eventLog[i].info.cartes);
					}
				}
				else {
					$scope.historique[lastIndex].events.push(eventLog[i]);
				}
			}
			console.log($scope.historique);
		}
	}

	$scope.expand = function(groupeIndex,eventIndex,direction){
		$scope.historique[groupeIndex].events[eventIndex].expanded = direction;
	}

}]);