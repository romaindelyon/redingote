'use strict';

angular.module('partie').controller('PartieTourController', ['$scope','$rootScope','Partie',
	function($scope,$rootScope,Partie) {

	$scope.actionsDisponibles.nextAction = true;

	$scope.tourActionNames = {
		0: 'Defense',
		1: 'Ouverture',
		2: 'Piochement',
		3: 'Déplacement',
		4: 'Action de case',
		5: 'Duel',
		6: 'Actions'
	};

	function startAction(tourJoueur,tourAction){
		// Changement de tour: reinitialiser le de et les dispos (cartes, des)
		$scope.jeu.de = -1;
		$scope.resetDispos();
		console.log('starting action : tourJoueur is '+tourJoueur);
		console.log(tourAction);
		console.log($scope.joueurId);
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
			else if (tourAction == 5){
				$scope.partie.dispo.duel = true;
				$scope.partie.dispo.des.duel = 3;
			}
			else if (tourAction == 6){
				$scope.partie.dispo.cartes.utiliser = true;
				$scope.$emit('confrontations-attaque-duel-cancel', {});
			}
		}
	}

	function moveTour(numberTours,skipTours){
		$scope.actionsDisponibles.nextAction = false;
		// Verify if data is consistent
		Partie.getPartie().success(function(response){
			// Data is consistent;
			if ($scope.partie.tour_joueur == response[0].tour_joueur && $scope.partie.tour_action == response[0].tour_action){
				console.log('donc on y va');
				var tourJoueur, tourAction, tourSkip;
				tourSkip = $scope.partie.tour_skip;
				console.log(tourSkip);
				console.log($scope.joueurId);
				tourSkip[$scope.joueurId] += skipTours;
				console.log(tourSkip);
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
				startAction(tourJoueur,tourAction);
				console.log(tourSkip);
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
					if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 5){
						$scope.$emit('confrontations-attaque-duel-start', {});
					}
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

	$scope.nextAction = function(){
		moveTour(1,0);
	}

	$rootScope.$on('partie-tours-move', function(event, args) {
		moveTour(args.numberTours,args.toursToSkip);
	});

}]);