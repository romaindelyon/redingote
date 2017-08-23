'use strict';

angular.module('partie').controller('PartieTourDeJeuController', ['$scope','$rootScope','Partie',
	function($scope,$rootScope,Partie) {

	$scope.actions = [''];
	$scope.actions_1 = ['notification','recompense','action','pouvoir'];
	$scope.actions_2 = ['question','achat','duel','trois-familles'];

	$scope.startAction = function(action){
		$scope.tourDeJeu.actionEnCours = true;
		if (action === 'achat' || action === 'action' || action === 'question'){
			$scope.$emit('plateaux-action-case-start',{action: action});
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
				$scope.partie.dispo.action_de_case = true;
    			$scope.$emit('jeu-missions-case-start',{});
			}
			else if (tourAction == 5){
				$scope.partie.dispo.duel = true;
				$scope.tourDeJeu.actionEnCours = true;
				$scope.partie.dispo.des.duel = 3;
				$scope.$emit('jeu-missions-case-end',{});
			}
			else if (tourAction == 6){
				$scope.partie.dispo.cartes.utiliser = true;
				$scope.$emit('confrontations-attaque-duel-cancel', {});
				// Possibilité de piocher des missions si aucune mission au statut open ou ready
				var newMissionPossible = true;
				for (var i = 0;i < $scope.jeu.missions.length;i ++){
					console.log($scope.jeu.missions[i]);
					if ($scope.jeu.missions[i].statut.statut === 'open' || $scope.jeu.missions.statut.statut === 'ready'){
						newMissionPossible = false;
					}
				}
				if (newMissionPossible){
					$scope.partie.dispo.pioches.missions = 1;
				}
			}
		}
	}

	function moveTour(numberTours,skipTours){
		$scope.actionsDisponibles.nextAction = false;
		// Verify if data is consistent
		Partie.getPartie().success(function(response){
			// Data is consistent;
			if ($scope.partie.tour_joueur == response[0].tour_joueur && $scope.partie.tour_action == response[0].tour_action){
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