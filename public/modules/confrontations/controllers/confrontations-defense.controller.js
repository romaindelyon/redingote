'use strict';

angular.module('confrontations').controller('ConfrontationsDefenseController', ['$scope','$rootScope','Cartes','Confrontations','Partie','Joueurs','ConfrontationsDefenseService','PartieTourService',
	function($scope,$rootScope,Cartes,Confrontations,Partie,Joueurs,ConfrontationsDefenseService,PartieTourService) {

	$scope.toursToSkip = 0;


	function implementDefense(){
		var description = "";
		var defense = $scope.defense;
		if (defense.type == 'action'){
			var carteId = defense.carte;
			var action = $scope.cartes[carteId].action;
			$scope.defense.action = action;
			if (action.types[0] == 'cartes_perte'){
				$scope.defense.remainingSteps = 0;
				$scope.defense.cartes_jeter = [
					{filled: false},
					{filled: false}
				];
				$scope.defense.cartes_jeter_filled = 0;
				$scope.defense.cartes_jeter_total = action.valeur;
				var cartesJetables = 0;
				console.log(cartesJetables);
				for (var i in $scope.jeu.main){
					if (!$scope.jeu.main[i].injetable){
						cartesJetables ++;
					}
				}
				$scope.defense.cartes_jeter_total = Math.min(cartesJetables,action.valeur);
				if ($scope.defense.cartes_jeter_total == 0){
					$scope.defense.canProceed = true;
				}
				console.log(cartesJetables);
				$scope.partie.dispo.cartes.main_jeter_attaque = true;
				if (action.valeur == 1){
					description = "Choisis " + action.valeur + " carte à défausser :";
				}
				else {
					description = "Choisis " + action.valeur + " cartes à défausser :";
				}
			}
			else if (action.types[0] == 'cartes_perte_test'){
				console.log('here')
				$scope.defense.remainingSteps = 1;
				$scope.defense.test = {};
				description = "Quelle heure est-il ?";
			}
			else if (action.types[0] == 'tour_passe'){
				console.log('here too');
				$scope.defense.canProceed = true;
				$scope.defense.remainingSteps = 0;
				if (action.valeur == 1){
					description = "Tu passes " + action.valeur + " tour";
				}
				else {
					description = "Tu passes " + action.valeur + " tour";
				}
			}
		}
		$scope.defense.description = description;
	};

	function startDefense(){
		if($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
			$scope.defense.id = $scope.attaques.defenses[0].id;
			$scope.defense.type = $scope.attaques.defenses[0].type;
			$scope.defense.categorie = $scope.attaques.defenses[0].categorie;
			$scope.defense.carte = $scope.attaques.defenses[0].carte;
			$scope.defense.source = $scope.attaques.defenses[0].source;
			$scope.defense.canProceed = false;
			$scope.defense.active = true;
			$scope.attaques.defenses.splice(0,1);
			implementDefense();
		}
	}

	$scope.removeCarte = function(index){
		$scope.defense.cartes_jeter[index].filled = false;
		$scope.defense.cartes_jeter_filled --;
		$scope.defense.canProceed = false;
	}

	$scope.finishDefense = function(){
		if ($scope.defense.type == 'action'){
			var action = $scope.defense.action;
			if (action.types[0] == 'tour_passe'){
				$scope.toursToSkip ++;
			}
			else if (action.types[0] == 'cartes_perte' || action.types[0] == 'cartes_perte_test_2'){
				for (var i in $scope.defense.cartes_jeter){
					if ($scope.defense.cartes_jeter[i].filled){
						// find index:
						var index = -1;
						var j = 0;
						while (index < 0 && j < $scope.jeu.main.length){
							if ($scope.jeu.main[j].id == $scope.defense.cartes_jeter[i].id){
								index = j;
							}
							j ++;
						}
						Cartes.moveCartes({
				    		carteIds: [$scope.defense.cartes_jeter[i].id],
				    		position: -2
				    	}).success(function(){
				    		var carte = $scope.jeu.main[index];
				    		carte.main = {};
							$scope.defausses.pioche.push(carte);
							$scope.jeu.main.splice(index,1);
							$scope.focusIndex = -2;
				    	}).error(function(){

				    	})
					}
				}
			}
			else if (action.types[0] == 'cartes_perte_test'){
				if (action.question == "19h42"){
					if ($scope.defense.test.hour == "19" && $scope.defense.test.minute == "42"){
						$scope.defense.test.correct = true;
						$scope.defense.description = "Bonne réponse !";
					}
					else {
						$scope.defense.test.correct = false;
						$scope.defense.description = "Mauvaise réponse. " + $scope.joueurs[$scope.defense.source].nom + " te chipera une carte à son tour.";
					}
				}
				action.types[0] = 'cartes_perte_test_2';
			}
		}
		// Si la defense en question est bien finie:
		if ($scope.defense.remainingSteps <= 0){
			// On la vire:
			Confrontations.delete({id: $scope.defense.id});
			$scope.defense.active = false;
			// On enchaine avec les eventuelles defenses suivantes:
			if ($scope.attaques.defenses.length > 0){
				startDefense($scope);
			}
			// On skippe les tours eventuellement:
			else {
				if ($scope.toursToSkip > 0){
					PartieTourService.moveTour($scope,7,$scope.toursToSip - 1);
				}
			}
		}
		else {
			$scope.defense.remainingSteps --;
		}
	}

	function jeterCarte(id){
		var carteJetee = false;
		for (var i in $scope.defense.cartes_jeter){
			if ($scope.defense.cartes_jeter[i].id == id){
				carteJetee = true;
			}
		}
		if (!carteJetee){
			var foundSpot = false;
			var i = 0;
			var cartesAJeter = $scope.defense.cartes_jeter.length;
			while (i < cartesAJeter && !foundSpot){
				if (!$scope.defense.cartes_jeter[i].filled){
					$scope.defense.cartes_jeter[i] = $scope.cartes[id];
					$scope.defense.cartes_jeter[i].filled = true;
					foundSpot = true;
					$scope.defense.cartes_jeter_filled ++;
				}
				// On a tout rempli:
				if ($scope.defense.cartes_jeter_total == $scope.defense.cartes_jeter_filled){
					$scope.defense.canProceed = true;
				}
				i ++;
			}
		}
	}

	// Event listeners that call the defense functions:
	$rootScope.$on('confrontations-defense-start', function(event, args) {
		startDefense();
	});
	$rootScope.$on('confrontations-defense-jeter-carte', function(event, args) {
		jeterCarte(args.id);
	});

	// Controller loaded:
	$scope.loaded.defenseController = true;
	$scope.getAttaques()

}]);