'use strict';

angular.module('plateaux').controller('PlateauxPaysageController', ['$scope','$rootScope','$http',
	function($scope,$rootScope,$http) {

		$scope.plateauPaysage = [];

		// Usability functions

		function getCoordinates(numero){
			var coordinates = {
				col: -1,
				row: -1
			}
			for (var i = 0;i < 14;i ++){
				for (var j = 0;j < 24;j ++){
					if ($scope.plateauPaysage[i].colonnes[j].numero == numero){
						coordinates = {
							row: i,
							col: j
						}
					}
				}
			}
			return coordinates;
		}

		// Initialiser plateau paysage:
		

		function addPionToCase(coordinates,joueurId){
			if ($scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs != undefined &&
				$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.length > 0){
    			$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.push(joueurId);
    			$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueursNumber ++;
    			
    		}
    		else {
    			$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs = [joueurId];
    			$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueursNumber = 1;
    		}
    		console.log($scope.plateauPaysage[coordinates.row].colonnes[coordinates.col]);
    	}
		
		function removePionFromCase(coordinates,joueurId){
			var index = $scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.indexOf(joueurId);
			if (index >= 0){
				$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.splice(index,1);
				$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueursNumber --;
			}
		}

		$rootScope.$on('partie-general-joueurs-loaded', function(event, args) {
			$http({
		        method: 'GET', 
		        url: 'modules/plateaux/json/plateaux-paysage.json'
		    }).success(function(response){
		    	$scope.plateauPaysage = response;
		    	for (var i in $scope.joueurs){
		    		console.log($scope.joueurs);
		    		if ($scope.joueurs[i].pions[0].plateau === 'paysage'){
		    			var coordinates = getCoordinates($scope.joueurs[i].pions[0].case);
		    			console.log(coordinates);
		    			console.log($scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs);
		    			addPionToCase(coordinates,i);
		    		}
		    	}
		    });
		});

	    $scope.movePion = function(numero){
	    	var previousCoordinates = getCoordinates($scope.joueurs[$scope.joueurId].pions[0].case);
	    	removePionFromCase(previousCoordinates,$scope.joueurId);
	    	var coordinates = getCoordinates(numero);
	    	console.log(coordinates);
	    	$scope.joueurs[$scope.joueurId].pions[0].case = numero;
	    	addPionToCase(coordinates,$scope.joueurId);
	    	$scope.partie.dispo.plateaux.paysage --;
	    	//Joueurs.movePion({numero: numero})
	    }

		$scope.selectedCase = {
			clicked: false,
			numero: -1
		};

		$scope.hoveredCase = -1;

		$scope.hoverCase = function(numero){
			$scope.hoveredCase = numero;
		}

		$scope.selectCase = function(numero){
			if ($scope.selectedCase.numero == numero){
				$scope.selectedCase.clicked = false;
				$scope.selectedCase.numero = -1;
			}
			else {
				$scope.selectedCase.clicked = true;
				$scope.selectedCase.numero = numero;
			}
		}

}]);