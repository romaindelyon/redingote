'use strict';

angular.module('attaques').controller('AttaquesDefenseContainerController', ['$scope','Cartes','Attaques','Partie','Joueurs','AttaquesDefenseService','PartieTourService',
	function($scope,Cartes,Attaques,Partie,Joueurs,AttaquesDefenseService,PartieTourService) {

	$scope.toursToSkip = 0;

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
			else if (action.types[0] == 'cartes_perte'){
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
		}
		// Si la defense en question est bien finie:
		if ($scope.defense.remainingSteps <= 0){
			// On la vire:
			Attaques.delete({id: $scope.defense.id});
			$scope.defense.active = false;
			// On enchaine avec les eventuelles defenses suivantes:
			if ($scope.attaques.defenses.length > 0){
				AttaquesDefenseService.startDefense($scope);
			}
			// On skippe les tours eventuellement:
			else {
				if ($scope.toursToSkip > 0){
					PartieTourService.moveTour($scope,7,$scope.toursToSip - 1);
				}
			}
		}
	}
		// var carte = $scope.attaque.carte;
		// // retirer la carte de la main:
		// // Cartes.moveCartes({
  // //   		carteIds: [carte.id],
  // //   		position: -2
  // //       }).success(function(){
  //       	// send attaque !
	 //    	Attaques.remove({
	 //    		id: $scope.defense.id;
	 //    	});
   //  		$scope.defausses.pioche.push(carte);
			// $scope.jeu.main.splice($scope.attaque.carteIndex,1);
			// $scope.cancelAttaque();
    	// }).error(function(){

    	// })

}]);