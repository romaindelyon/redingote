'use strict';

angular.module('partie').controller('PartieTourDeJeuController', ['$scope','$rootScope','Partie',
	function($scope,$rootScope,Partie) {

	$scope.actions = [''];
	$scope.actions_1 = ['notification','recompense','action','pouvoir'];
	$scope.actions_2 = ['question','achat','duel','trois-familles'];

	$scope.actionsRows = [
		['notification','recompense','action','pouvoir'],
		['question','achat','duel','trois-familles']
	];

	$scope.startAction = function(action){
		$scope.tourDeJeu.actionEnCours = true;
		if (action === 'achat' || action === 'action' || action === 'question'){
			$scope.$emit('plateaux-action-case-lancer',{action: action});
		}
		if (action === 'duel'){
			$scope.$emit('confrontations-attaque-duel-start',{});
		}
	}

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
		console.log("starting action" + tourAction)
		// Changement de tour: reinitialiser le de et les dispos (cartes, des)
		$scope.jeu.de = -1;
		$scope.resetDispos();
		// Lancer la nouvelle action:
		if (tourJoueur == $scope.joueurId){
			if (tourAction == 1){
				$scope.partie.dispo.cartes.ouvertures = true;
				$scope.partie.dispo.cartes.ouvertes_jeter = true;
			}
			else if (tourAction == 2){
				$scope.partie.dispo.pioches.pioche ++;
				$scope.partie.dispo.des.rhombo ++;
				$scope.partie.dispo.cartes.main_jeter = true;
			}
			else if (tourAction == 3){
				if ($scope.joueurs[$scope.joueurId].pions[0].plateau === 'paysage'){
					$scope.partie.dispo.des.paysage = 1;
				}
				else if ($scope.joueurs[$scope.joueurId].pions[0].plateau === 'labyrinthe'){
					$scope.partie.dispo.des.labyrinthe = 4;
				}
				console.log($scope.joueurs)


			}
			else if (tourAction == 4){
				console.log('emitting event');
				$scope.$emit('plateaux-action-case-start',{});
    			$scope.$emit('jeu-missions-case-start',{});
			}
			else if (tourAction == 5){
				$scope.partie.dispo.duel = true;
				$scope.tourDeJeu.duel = [1,0];
				//$scope.tourDeJeu.actionEnCours = true;
				$scope.partie.dispo.des.duel = 3;
				$scope.$emit('jeu-missions-case-end',{});
			}
			else if (tourAction == 6){
				$scope.partie.dispo.cartes.utiliser = true;
				$scope.$emit('confrontations-attaque-duel-cancel', {});
				$scope.$emit('partie-tour-action-start', {});
			}
		}
	}

	// TODO
	// REMOVE, MERGE and make general
	$rootScope.$on('partie-general-partie-loaded',function(event, args) {
		console.log($scope.partie.tour_action);
		console.log($scope.partie.tour_joueur);
		if ($scope.joueurId === $scope.partie.tour_joueur && $scope.partie.tour_action === 4){
			$scope.$emit('plateaux-action-case-start',{});
			$scope.$emit('jeu-missions-case-start',{});
		}
		if ($scope.joueurId === $scope.partie.tour_joueur && $scope.partie.tour_action === 6){
			$scope.$emit('partie-tour-action-start', {});
		}
	});

	function moveTour(numberTours,skipTours){
		$scope.actionsDisponibles.nextAction = false;
		// Verify if data is consistent
		Partie.getPartie().success(function(response){
			// Data is consistent;
			if ($scope.partie.tour_joueur == response[0].tour_joueur && $scope.partie.tour_action == response[0].tour_action){
				console.log("data is consistent");
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
				startAction(tourJoueur,tourAction);
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
						$scope.$emit('action-case-start', {});
					}
				}).error(function(){
					$scope.actionsDisponibles.nextAction = true;
				});
			}
			// Data is not consistent
			else {
				console.log("data is not consistent");
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