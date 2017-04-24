'use strict';

angular.module('plateaux').controller('PlateauxPaysageController', ['$scope','$state','$stateParams',
	function($scope,$state,$stateParams) {

		// Initialiser plateau paysage:
		$scope.plateauPaysage = [];
		
		for (var i = 0;i < 14;i ++){
			$scope.plateauPaysage.push({
				id: i,
				colonnes: []
			});
			for (var j = 0;j < 24;j ++){
				var numero = Math.floor((Math.random() * 1000) + 1);
				var question = Math.random();
				var action = Math.random();
				var achat = Math.random();
				var paysagesNoms = ['Desert','Ville','Foret','Marecage','Mer','Royaume des tenebres','Montagne','Village','Prairie'];
				var paysageIndex = Math.floor((Math.random() * 8));
				var paysage2 = Math.random();
				if (paysage2 > 0.7){
					var paysageIndex2 = Math.floor((Math.random() * 8));
					var zones = [paysagesNoms[paysageIndex],paysagesNoms[paysageIndex2]];
				}
				else {
					var zones = [paysagesNoms[paysageIndex]];
				}
				$scope.plateauPaysage[i].colonnes.push({
					id: j,
					numero: numero,
					question: question > 0.7,
					zones: zones,
					action: action > 0.75,
					achat: achat > 0.6 
				});
			}
		}

		$scope.selectedCase = {
			clicked: false,
			ligneId: -1,
			colonneId: -1
		};

		$scope.selectCase = function(ligneId,colonneId){
			if ($scope.selectedCase.ligneId == ligneId && $scope.selectedCase.colonneId == colonneId){
				$scope.selectedCase.clicked = false;
				$scope.selectedCase.ligneId = -1;
				$scope.selectedCase.colonneId = -1;
			}
			else {
				$scope.selectedCase.clicked = true;
				$scope.selectedCase.ligneId = ligneId;
				$scope.selectedCase.colonneId = colonneId;
			}
		}

}]);