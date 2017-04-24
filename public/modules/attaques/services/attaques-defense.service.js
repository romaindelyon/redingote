angular.module('attaques').service('AttaquesDefenseService',
	['Cartes',
	function(Cartes) {

	var attaquesDefenseFunctions = {};

	function implementDefense($scope){
		var description = "";
		var defense = $scope.defense;
		if (defense.type == 'action'){
			var carteId = defense.carte;
			var action = $scope.cartes[carteId].action;
			$scope.defense.action = action;
			console.log($scope.cartes);
			console.log(carteId);
		console.log($scope.defense.action.types[0]);
			if (action.types[0] == 'cartes_perte'){
				console.log('1here')
				$scope.defense.remainingSteps = 0;
				$scope.defense.cartes_jeter = [
					{filled: false},
					{filled: false}
				];
				$scope.defense.cartes_jeter_filled = 0;
				$scope.defense.cartes_jeter_total = action.valeur;
				var cartesJetables = 0;
				for (var i in $scope.jeu.main){
					if (!$scope.jeu.main[i].injetable){
						cartesJetables ++;
					}
				}
				if (cartesJetables < action.valeur){
					$scope.defense.cartes_jeter_total = cartesJetables;
				}
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
		console.log('description');
		$scope.defense.description = description;
		console.log($scope.defense);
	};

	attaquesDefenseFunctions.startDefense = function($scope){
		if($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
			$scope.defense.id = $scope.attaques.defenses[0].id;
			$scope.defense.type = $scope.attaques.defenses[0].type;
			$scope.defense.categorie = $scope.attaques.defenses[0].categorie;
			$scope.defense.carte = $scope.attaques.defenses[0].carte;
			$scope.defense.source = $scope.attaques.defenses[0].source;
			$scope.defense.canProceed = false;
			$scope.defense.active = true;
			$scope.attaques.defenses.splice(0,1);
			implementDefense($scope);
		}
	}

	attaquesDefenseFunctions.jeterCarte = function($scope,id){
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
					console.log($scope.defense.cartes_jeter);
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

	return(attaquesDefenseFunctions);
}]);