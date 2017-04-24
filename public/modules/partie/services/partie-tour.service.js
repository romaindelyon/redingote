'use strict';

angular.module('partie').service('PartieTourService', ['Partie',
	function(Partie) {

	var PartieTourServiceFunctions = {};

	function startAction($scope,tourJoueur,tourAction){
		// Changement de tour: reinitialiser le de et les dispos (cartes, des)
		$scope.jeu.de = -1;
		$scope.resetDispos();
		console.log('starting action : tourJoueur is '+tourJoueur);
		// Lancer la nouvelle action:
		if (tourJoueur == $scope.joueurId){
			console.log(tourAction);
			if (tourAction == 1){
				$scope.partie.dispo.cartes.ouvertures = true;
				$scope.partie.dispo.cartes.ouvertes_jeter = true;
			}
			else if (tourAction == 2){
				$scope.partie.dispo.pioches.pioche ++;
				$scope.partie.dispo.des.rhombo ++;
				$scope.partie.dispo.cartes.main_jeter = true;
			}
			else if (tourAction == 6){
				$scope.partie.dispo.cartes.utiliser = true;
			}
		}
	}

	PartieTourServiceFunctions.moveTour = function($scope,numberTours,skipTours){
		$scope.actionsDisponibles.nextAction = false;
		// Verify if data is consistent
		Partie.getPartie().success(function(response){
			// Data is consistent
			if (true || ($scope.partie.tour_joueur == response[0].tour_joueur && $scope.partie.tour_action == response[0].tour_action && $scope.partie.tour_skip == response[0].tour_skip)){
				var tourJoueur, tourAction, tourSkip;
				tourSkip = $scope.partie.tour_skip;
				tourSkip[$scope.joueurId] += skipTours;
				// changement de joueur:
				if ($scope.partie.tour_action + numberTours > 6){
					var joueurFound = false;
					tourAction = 0;
					tourJoueur = ($scope.partie.tour_joueur + 1) % 3;
					while (!joueurFound){
						if (tourSkip[tourJoueur] > 0){
							tourSkip[tourJoueur] --;
							tourJoueur = (tourJoueur + 1) % 3;
						}
						else {
							joueurFound = true;
						}
					}
				}
				// pas de changement de joueur:
				else {
					tourAction = $scope.partie.tour_action + numberTours;
					tourJoueur = $scope.partie.tour_joueur;
				}
				startAction($scope,tourJoueur,tourAction);
				Partie.changeTour({
					tour_joueur: tourJoueur,
					tour_action: tourAction,
					tour_skip: JSON.stringify(tourSkip),
					dispo: $scope.partie.dispo
				}).success(function(){
					// Changement de tour: updater variables locales
					$scope.partie.tour_joueur = tourJoueur;
					$scope.partie.tour_action = tourAction;
					$scope.actionsDisponibles.nextAction = true;
				}).error(function(){
					$scope.actionsDisponibles.nextAction = true;
				});
			}
			// Data is not consistent
			else {
				$scope.partie = {
					tour_joueur: response[0].tour_joueur,
					tour_action: response[0].tour_action,
					tour_skip: response[0].tour_skip,
					tonalite: response[0].tonalite,
					temps: response[0].temps,
					dispo: response[0].dispo
				};
				$scope.jeu.de = -1;
				$scope.actionsDisponibles.nextAction = true;
			}
		}).error(function(){
			$scope.actionsDisponibles.nextAction = true;
		});
	}

	return(PartieTourServiceFunctions);

}]);