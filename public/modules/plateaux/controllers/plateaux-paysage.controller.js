'use strict';

angular.module('plateaux').controller('PlateauxPaysageController', ['$scope','$rootScope','$http','$timeout','$interval','Joueurs',
	function($scope,$rootScope,$http,$timeout,$interval,Joueurs) {

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

		// Zones :

		 function findZoneKey(zone){
			console.log(zone);
			var zoneKey = zone;
			zoneKey = zoneKey.replace("é","e");
			zoneKey = zoneKey.replace("è","e");
			zoneKey = zoneKey.replace("ê","e");
			zoneKey = zoneKey.replace(" ","_");
			zoneKey = zoneKey.replace(" ","_");
			console.log(zoneKey);
			return(zoneKey);
		}

		// Horloge :

		$scope.roseDesVents = {
			status: "neutral"
		}

		var quadrantPositions = {
			'bas': {marginLeft: -135,marginTop: 109,height: 88},
			'droite': {marginLeft: -114,marginTop: 83,height: 48},//done
			'haut': {marginLeft: -138,marginTop: 20,height: 88},//done
			'gauche': {marginLeft: -200,marginTop: 87,height: 48},// done
			'bas_droite': {marginLeft: -114,marginTop: 109,height: 88},// done
			'bas_gauche': {marginLeft: -197,marginTop: 108,height: 88},// done
			'haut_droite': {marginLeft: -114,marginTop: 22,height: 88},//done
			'haut_gauche': {marginLeft: -198,marginTop: 23,height: 88}//done
		}

		function updateRoseDesVents(index,position,statut){
			if (index < position + 60){
				$timeout(function(){
					$scope.roseAiguille.angle = ($scope.roseAiguille.angle + 6)%360;
					$scope.roseAiguille.x = roseAiguilleValues[$scope.roseAiguille.angle/6].x;
					$scope.roseAiguille.y = roseAiguilleValues[$scope.roseAiguille.angle/6].y;
					updateRoseDesVents(index + 1,position,statut);
				},10);
			}
			else {
				if (statut === "neutral"){
					console.log("STARTING INTERVAL");
					roseDesVentsInterval = $interval(function(){
						$scope.roseAiguille.angle = ($scope.roseAiguille.angle + 6)%360;
						$scope.roseAiguille.x = roseAiguilleValues[$scope.roseAiguille.angle/6].x;
						$scope.roseAiguille.y = roseAiguilleValues[$scope.roseAiguille.angle/6].y;
					},1000);
					$scope.roseDesVents.status = "neutral";
				}
				else if (statut === 'ready'){
					console.log($scope.roseDesVents.initialPosition);
					console.log(position);
					var position = (position + $scope.roseDesVents.initialPosition)%60;
					console.log(position);
					// Here show position :
					if (position >= 3 && position <= 12){
						$scope.roseDesVents.position = "bas_droite";
					}
					else if (position >= 13 && position <= 17){
						$scope.roseDesVents.position = "bas";
					}	
					else if (position >= 18 && position <= 27){
						$scope.roseDesVents.position = "bas_gauche";
					}
					else if (position >= 28 && position <= 32){
						$scope.roseDesVents.position = "gauche";
					}
					else if (position >= 33 && position <= 42){
						$scope.roseDesVents.position = "haut_gauche";
					}
					else if (position >= 43 && position <= 47){
						$scope.roseDesVents.position = "haut";
					}	
					else if (position >= 48 && position <= 57){
						$scope.roseDesVents.position = "haut_droite";
					}
					else if (position >= 58 || position <= 2){
						$scope.roseDesVents.position = "droite";
					}		
					console.log($scope.roseDesVents.position);
					$scope.roseDesVents.height = quadrantPositions[$scope.roseDesVents.position].height;
					$scope.roseDesVents.marginLeft = quadrantPositions[$scope.roseDesVents.position].marginLeft;
					$scope.roseDesVents.marginTop = quadrantPositions[$scope.roseDesVents.position].marginTop;
					$scope.$emit('plateaux-paysage-direction',{direction: $scope.roseDesVents.position});
				}
			}
		}

		$scope.startRoseDesVents = function(){
			console.log($scope.roseDesVents.status);
			if ($scope.roseDesVents.status !== "blocked"){
				console.log("STOPPING INTERVAL");
				$interval.cancel(roseDesVentsInterval);
				var position = Math.floor(Math.random()*60);
				$scope.roseDesVents.initialPosition = $scope.roseAiguille.angle / 6;
				console.log($scope.roseDesVents.initialPosition);
				console.log(position);
				updateRoseDesVents(1,position,$scope.roseDesVents.status);
				$scope.roseDesVents.status = "blocked";
			}
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
		console.log("STARTING INTERVAL");
		var roseDesVentsInterval = $interval(function(){
			$scope.roseAiguille.angle = ($scope.roseAiguille.angle + 6)%360;
			$scope.roseAiguille.x = roseAiguilleValues[$scope.roseAiguille.angle/6].x;
			$scope.roseAiguille.y = roseAiguilleValues[$scope.roseAiguille.angle/6].y;
		},1000);

		$rootScope.$on('plateaux-paysage-rose-ready',function(event,args){
			console.log("rose ready");
			$scope.roseDesVents.status = "ready";
		});

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
		    	for (var i = 0;i < $scope.plateauPaysage.length;i ++){
		    		for (var j = 0;j < $scope.plateauPaysage[i].colonnes.length;j ++){
		    			$scope.plateauPaysage[i].colonnes[j].zoneKey = [];
		    			for (var k = 0;k < $scope.plateauPaysage[i].colonnes[j].zones.length;k ++){
		    				$scope.plateauPaysage[i].colonnes[j].zoneKey.push(findZoneKey($scope.plateauPaysage[i].colonnes[j].zones[k]));
		    			}
		    		}
		    	}
		    });
		});

	    // Déplacement :

	    $scope.deplacementPossible = -1;

	    $scope.pionDeplacementImage = [
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0},
	    	{marginLeft: 0,marginTop: 0}
	    ];

	    $rootScope.$on('plateaux-paysage-deplacement-ready',function(event,args){
	    	$scope.deplacementPossible = args.deResult;
	    	$scope.deplacement = [];
	    });

	    $scope.deplacementPion = function(numero,position){
	    	$scope.deplacement.push({numero: numero,position: position});
	    }

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