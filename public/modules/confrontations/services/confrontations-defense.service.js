angular.module('confrontations').service('ConfrontationsDefenseService',
	['Cartes',
	function(Cartes) {

	// var confrontationsDefenseFunctions = {};

	// confrontationsDefenseFunctions.startDefense = function($scope){
	// 	if($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
	// 		$scope.defense.id = $scope.attaques.defenses[0].id;
	// 		$scope.defense.type = $scope.attaques.defenses[0].type;
	// 		$scope.defense.categorie = $scope.attaques.defenses[0].categorie;
	// 		$scope.defense.carte = $scope.attaques.defenses[0].carte;
	// 		$scope.defense.source = $scope.attaques.defenses[0].source;
	// 		$scope.defense.canProceed = false;
	// 		$scope.defense.active = true;
	// 		$scope.attaques.defenses.splice(0,1);
	// 		implementDefense($scope);
	// 	}
	// }

	// confrontationsDefenseFunctions.jeterCarte = function($scope,id){
	// 	var carteJetee = false;
	// 	for (var i in $scope.defense.cartes_jeter){
	// 		if ($scope.defense.cartes_jeter[i].id == id){
	// 			carteJetee = true;
	// 		}
	// 	}
	// 	if (!carteJetee){
	// 		var foundSpot = false;
	// 		var i = 0;
	// 		var cartesAJeter = $scope.defense.cartes_jeter.length;
	// 		while (i < cartesAJeter && !foundSpot){
	// 			if (!$scope.defense.cartes_jeter[i].filled){
	// 				console.log($scope.defense.cartes_jeter);
	// 				$scope.defense.cartes_jeter[i] = $scope.cartes[id];
	// 				$scope.defense.cartes_jeter[i].filled = true;
	// 				foundSpot = true;
	// 				$scope.defense.cartes_jeter_filled ++;
	// 			}
	// 			// On a tout rempli:
	// 			if ($scope.defense.cartes_jeter_total == $scope.defense.cartes_jeter_filled){
	// 				$scope.defense.canProceed = true;
	// 			}
	// 			i ++;
	// 		}
	// 	}
	// }

	// return(confrontationsDefenseFunctions);
}]);