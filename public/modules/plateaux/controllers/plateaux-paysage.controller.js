'use strict';

angular.module('plateaux').controller('PlateauxPaysageController', ['$scope','$rootScope','$http','$interval','Joueurs',
	function($scope,$rootScope,$http,$interval,Joueurs) {

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

		// Horloge :

		$scope.roseDesVents = function(){
			var position = Math.floor(Math.random()*360);
		}
		
		var roseAiguilleValues = [
			// 0
			{x: -127,y: 2},
			{x: -124,y: 13},
			{x: -126,y: 22},
			{x: -127,y: 34},
			{x: -129,y: 42},
			// 30
			{x: -131,y: 51},
			{x: -134,y: 59},
			{x: -137,y: 67},
			{x: -141,y: 73},
			{x: -145,y: 79},
			// 60
			{x: -149,y: 85},
			{x: -153,y: 89},
			{x: -158,y: 92},
			{x: -163,y: 95},
			{x: -168,y: 96},
			// 90
			{x: -173,y: 98},
			{x: -178,y: 97},
			{x: -183,y: 95},
			{x: -187,y: 92},
			{x: -192,y: 88},
			// 120
			{x: -197,y: 84},
			{x: -201,y: 78},
			{x: -205,y: 72},
			{x: -208,y: 64},
			{x: -211,y: 57},
			// 150
			{x: -214,y: 49},
			{x: -216,y: 40},
			{x: -218,y: 30},
			{x: -219,y: 21},
			{x: -219,y: 10},
			// 180
			{x: -220,y: -1},
			{x: -219,y: -11},
			{x: -218,y: -20},
			{x: -217,y: -29},
			{x: -215,y: -38},
			// 210
			{x: -213,y: -48},
			{x: -210,y: -55},
			{x: -207,y: -63},
			{x: -203,y: -70},
			{x: -199,y: -76},
			// 240
			{x: -196,y: -81},
			{x: -191,y: -86},
			{x: -186,y: -89},
			{x: -181,y: -92},
			{x: -175,y: -92},
			// 270
			{x: -172,y: -93},
			{x: -166,y: -92},
			{x: -161,y: -91},
			{x: -157,y: -88},
			{x: -152,y: -85},
			// 300
			{x: -148,y: -80},
			{x: -144,y: -74},
			{x: -140,y: -67},
			{x: -138,y: -61},
			{x: -134,y: -53},
			// 330
			{x: -131,y: -45},
			{x: -129,y: -35},
			{x: -127,y: -27},
			{x: -125,y: -17},
			{x: -125,y: -7}
		];

		$scope.roseAiguille = {
			angle: 6,
			x: -127,
			y: 2
		};
		$interval(function(){
			$scope.roseAiguille.angle = ($scope.roseAiguille.angle + 6)%360;
			$scope.roseAiguille.x = roseAiguilleValues[$scope.roseAiguille.angle/6].x;
			$scope.roseAiguille.y = roseAiguilleValues[$scope.roseAiguille.angle/6].y;
		},1000);


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
			var index = $scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.indexOf(joueurId.toString());
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
		    		if ($scope.joueurs[i].pions[0].plateau === 'paysage'){
		    			var coordinates = getCoordinates($scope.joueurs[i].pions[0].case);
		    			addPionToCase(coordinates,i);
		    		}
		    	}
		    });
		});

	    $scope.movePion = function(numero){
	    	$scope.partie.dispo.plateaux.paysage --;
			var newPions = [];
			$.each($scope.joueurs[$scope.joueurId].pions,function(i,obj) {
			    newPions.push($.extend(true,{},obj)); 
			});
			newPions[0].case = numero;
			Joueurs.movePion({
				pions: JSON.stringify(newPions),
				joueurId: $scope.joueurId,
				partieId: $scope.partieId
			}).success(function(){
	    		var previousCoordinates = getCoordinates($scope.joueurs[$scope.joueurId].pions[0].case);
	    		var coordinates = getCoordinates(numero);
				removePionFromCase(previousCoordinates,$scope.joueurId);
				addPionToCase(coordinates,$scope.joueurId);
				$scope.joueurs[$scope.joueurId].pions[0].case = numero;
				$scope.$emit('plateaux-pion-move',{});
			}).error(function(error){
				console.log("napapu sauver pion");
				console.log(error);
			});
	    }

		$rootScope.$on('plateaux-move-pion-callback', function(event, args) {
			if (args.plateau === 'paysage'){
				addPionToCase(getCoordinates(args.case),$scope.joueurId);
			}
			if (args.previousPlateau === 'paysage'){
				removePionFromCase(getCoordinates(args.previousCase),$scope.joueurId);
			}		
		});

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