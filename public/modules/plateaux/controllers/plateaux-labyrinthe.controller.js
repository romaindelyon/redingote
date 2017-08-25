'use strict';

angular.module('plateaux').controller('PlateauxLabyrintheController', ['$scope','$rootScope','$timeout','$http','Partie','Joueurs',
	function($scope,$rootScope,$timeout,$http,Partie,Joueurs) {

	$scope.plateauLabyrinthe = [
		// Couronne 0
		[{
			numero: 'Hub interplanetaire',
			cle: 'jaune',
			position: 0
		}],
		// Couronne 1
		[{
			numero: 56,
			cle: 'jaune',
			position: 0
		},
		{
			numero: 57,
			cle: 'rouge_fonce',
			position: 1
		},
		{
			numero: 58,
			cle: 'bleu',
			position: 2
		},
		{
			numero: 59,
			cle: 'orange',
			position: 3
		}],
		// Couronne 2
		[{
			numero: 48,
			cle: 'bleu',
			position: 0
		},
		{
			numero: 49,
			cle: 'bleu_fonce',
			position: 1
		},
		{
			numero: 50,
			cle: 'rose_pale',
			position: 2
		},
		{
			numero: 51,
			cle: 'vert',
			position: 3
		},
		{
			numero: 52,
			cle: 'orange',
			position: 4
		},
		{
			numero: 53,
			cle: 'rouge_fonce',
			position: 5
		},
		{
			numero: 54,
			cle: 'rose_fonce',
			position: 6
		},
		{
			numero: 55,
			cle: 'violet',
			position: 7
		}],
		// Couronne 3
		[{
			numero: 32,
			cle: 'rose',
			position: 0
		},
		{
			numero: 33,
			cle: 'rose_pale',
			position: 1
		},
		{
			numero: 34,
			cle: 'jaune_fonce',
			position: 2
		},
		{
			numero: 35,
			position: 3
		},
		{
			numero: 36,
			cle: 'marron',
			position: 4
		},
		{
			numero: 37,
			cle: 'vert_pale',
			position: 5
		},
		{
			numero: 38,
			cle: 'rose_fonce',
			position: 6
		},
		{
			numero: 39,
			cle: 'vert',
			position: 7
		},
		{
			numero: 40,
			position: 8
		},
		{
			numero: 41,
			cle: 'gris',
			position: 9
		},
		{
			numero: 42,
			cle: 'bleu_fonce',
			position: 10
		},
		{
			numero: 43,
			position: 11
		},
		{
			numero: 44,
			cle: 'vert_fonce',
			position: 12
		},
		{
			numero: 45,
			cle: 'rouge',
			position: 13
		},
		{
			numero: 46,
			position: 14
		},
		{
			numero: 47,
			cle: 'violet',
			position: 15
		}],
		// Couronne 4
		[{
			numero: 'Hub',
			position: 0,
			action: true
		},
		{
			numero: 1,
			position: 1
		},
		{
			numero: 2,
			position: 2
		},
		{
			numero: 3,
			position: 3
		},
		{
			numero: 4,
			position: 4
		},
		{
			numero: 5,
			position: 5
		},
		{
			numero: 6,
			position: 6
		},
		{
			numero: 7,
			cle: 'jaune_fonce',
			position: 7
		},
		{
			numero: 8,
			cle: 'vert_pale',
			position: 8
		},
		{
			numero: 9,
			position: 9
		},
		{
			numero: 10,
			position: 10
		},
		{
			numero: 11,
			position: 11
		},
		{
			numero: 12,
			position: 12
		},
		{
			numero: 13,
			position: 13
		},
		{
			numero: 14,
			position: 14
		},
		{
			numero: 15,
			cle: 'rose',
			position: 15
		},
		{
			numero: 16,
			cle: 'rouge',
			position: 16
		},
		{
			numero: 17,
			position: 17
		},
		{
			numero: 18,
			position: 18
		},
		{
			numero: 19,
			position: 19
		},
		{
			numero: 20,
			position: 20
		},
		{
			numero: 21,
			position: 21
		},
		{
			numero: 22,
			position: 22
		},
		{
			numero: 23,
			cle: 'gris',
			position: 23
		},
		{
			numero: 24,
			cle: 'marron',
			position: 24
		},
		{
			numero: 25,
			position: 25
		},
		{
			numero: 26,
			position: 26
		},
		{
			numero: 27,
			position: 27
		},
		{
			numero: 28,
			position: 28
		},
		{
			numero: 29,
			position: 29
		},
		{
			numero: 30,
			position: 30
		},
		{
			numero: 31,
			cle: 'vert_fonce',
			position: 31
		}]
	];

	for (var i in $scope.plateauLabyrinthe){
		for (var j in $scope.plateauLabyrinthe[i]){
			$scope.plateauLabyrinthe[i][j].joueurs = [];
			$scope.plateauLabyrinthe[i][j].pionsStyles = [];
			$scope.plateauLabyrinthe[i][j].joueursNumber = 0;
		}
	}

	function setStyle(angle,positionX,positionY){
		var style =	"{'transform': 'rotate(" + angle + "deg)','margin-left': '" + positionX + "px','margin-top': '" + positionY + "px'}"
		return style;
	}

	var positionsCases = [
		[],
		// Couronne 1
		[
			{x: -85,y: -85},
			{x: 0,y: -85},
			{x: 0,y: 0},
			{x: -85,y: 0}
		],
		// Couronne 2
		[
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -141},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9}
		],
		// Couronne 3
		[
			{x: -191,y: -69},
			{x: -166,y: -126},
			{x: -118,y: -171},
			{x: -60,y: -193},
			{x: 3,y: -191},
			{x: 61,y: -166},
			{x: 104,y: -118},
			{x: 126,y: -59},
			{x: 124,y: 0},
			{x: 100,y: 57},
			{x: 51,y: 103},
			{x: -7,y: 125},
			{x: -68,y: 124},
			{x: -126,y: 99},
			{x: -171,y: 49},
			{x: -193,y: -9}
		],
		// Couronne 4
		[
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -140},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9},
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -140},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9},
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -140},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9},
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -140},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9}
		]
	];

	var positionsCases2 = [
		[],
		// Couronne 1
		[
			{x: -120,y: -120},
			{x: 0,y: -120},
			{x: 0,y: 0},
			{x: -120,y: 0}
		],
		// Couronne 2
		[
			{x: -184.5,y: -130},
			{x: -100,y: -207},
			{x: 15,y: -200},
			{x: 92,y: -115},
			{x: 85,y: 0},
			{x: 0,y: 75},
			{x: -116,y: 68.5},
			{x: -191,y: -15.5}
		],
		// Couronne 3
		[
			// Premier quadrant
			{x: -249,y: -94},
			{x: -215,y: -171},
			{x: -155,y: -229.5},
			{x: -78,y: -259.5},
			// Deuxieme quadrant
			{x: 6,y: -257.5},
			{x: 84,y: -224},
			{x: 142.5,y: -163.5},
			{x: 173,y: -85},
			// Troisieme quadrant
			{x: 171,y: 0},
			{x: 137,y: 76.5},
			{x: 76,y: 134.5},
			{x: -1.5,y: 164.5	},
			// Dernier quadrant
			{x: -87,y: 162},
			{x: -164,y: 128},
			{x: -221.5,y: 67},
			{x: -251.5,y: -10}
		],
		// Couronne 4
		[
			// Premier quadrant
			{x: -316,y: -59},
			{x: -305,y: -113},
			{x: -283,y: -165},
			{x: -251.5,y: -211},
			{x: -213,y: -250},
			{x: -167,y: -280},
			{x: -117,y: -301},
			{x: -63.5,y: -311},
			// Deuxieme quadrant
			{x: -8,y: -311},
			{x: 47,y: -299.5},
			{x: 99,y: -278},
			{x: 144,y: -247},
			{x: 184,y: -208},
			{x: 214,y: -162},
			{x: 235,y: -111},
			{x: 246,y: -56},
			// Troisieme quadrant
			{x: 245,y: 0},
			{x: 234,y: 54},
			{x: 212.5,y: 104.5},
			{x: 181,y: 150.5},
			{x: 141.5,y: 189},
			{x: 96,y: 219},
			{x: 45,y: 240},
			{x: -9,y: 250.5},
			// Quatrieme quadrant
			{x: -65,y: 250},
			{x: -119,y: 238.5},
			{x: -170,y: 216.5},
			{x: -216,y: 186},
			{x: -255,y: 147},
			{x: -285,y: 101},
			{x: -306,y: 51},
			{x: -317,y: -3.5}
		]
	];

	positionsCases = positionsCases2;

	function setPositionCouronne(i){
		var sectionsCouronne = $scope.plateauLabyrinthe[i].length;
		var angleBase = 360 / sectionsCouronne;
		for (var j in $scope.plateauLabyrinthe[i]){
			var position = (($scope.plateauLabyrinthe[i][j].position + $scope.positionCouronnes[i]) % sectionsCouronne + sectionsCouronne) % sectionsCouronne;
			var angle = angleBase * position;
			$scope.plateauLabyrinthe[i][j].angle = angleBase * ($scope.plateauLabyrinthe[i][j].position + $scope.positionCouronnes[i]);
			$scope.plateauLabyrinthe[i][j].x = positionsCases[i][position].x;
			$scope.plateauLabyrinthe[i][j].y = positionsCases[i][position].y;
			$scope.plateauLabyrinthe[i][j].opacity = 1;
		}
	}

	// Initiate couronnes
	$rootScope.$on('partie-general-partie-loaded', function(event, args) {
		$scope.positionCouronnes = $scope.partie.positionCouronnes;
		for (var i in $scope.plateauLabyrinthe){
			if (i > 0){
				setPositionCouronne(i);
			}
		}
	});

	function getCoordinates(numero){
		var coordinates = {
			couronne: -1,
			position: -1
		}
		for (var i = 0;i < $scope.plateauLabyrinthe.length;i ++){
			for (var j = 0;j < $scope.plateauLabyrinthe[i].length;j ++){
				if ($scope.plateauLabyrinthe[i][j].numero == numero){
					coordinates = {
						couronne: i,
						position: j
					}
				}
			}
		}
		return coordinates;
	}

	// Tourner les couronnes :

	function highlightCase(i,j){
		$timeout(function(){
			$scope.plateauLabyrinthe[i][j].opacity = 0.3;
			$timeout(function(){
				$scope.plateauLabyrinthe[i][j].opacity = 1;
				$timeout(function(){
					$scope.plateauLabyrinthe[i][j].opacity = 0.3;
					$timeout(function(){
						$scope.plateauLabyrinthe[i][j].opacity = 1;
					},500);
				},500);
			},500);
		},500);
	}

	$scope.updatePositionCouronne = function(index,direction){
		var increment = -1;
		if (direction == 'down'){
			var increment = 1;
		}
		var newPositionCouronnes = $scope.positionCouronnes;
		newPositionCouronnes[index] += increment;
		Partie.changeCouronnes({
			positionCouronnes: JSON.stringify(newPositionCouronnes)
		}).success(function(){
			$scope.positionCouronnes = newPositionCouronnes;
			setPositionCouronne(index);
			for (var i = Math.max(2,index);i < Math.min(index + 2,4);i ++){
				var sectionsCouronne = $scope.plateauLabyrinthe[i].length;
				var sectionsCouronneSuperieure = $scope.plateauLabyrinthe[i-1].length;
				for (var j in $scope.plateauLabyrinthe[i]){
					var position = (($scope.plateauLabyrinthe[i][j].position + $scope.positionCouronnes[i]) % sectionsCouronne + sectionsCouronne) % sectionsCouronne;
					var positionSuperieure = ((Math.floor(position/2) - $scope.positionCouronnes[i-1]) % sectionsCouronneSuperieure + sectionsCouronneSuperieure) % sectionsCouronneSuperieure;
					if ($scope.plateauLabyrinthe[i][j].cle !== undefined && $scope.plateauLabyrinthe[i][j].cle === $scope.plateauLabyrinthe[i-1][positionSuperieure].cle){
						highlightCase(i,j);
						highlightCase(i-1,positionSuperieure);
					}
				}
			}

			// Update informations de tour de jeu :
			$scope.plateauLabyrintheTourDeJeu.de --;
			$scope.plateauLabyrintheTourDeJeu.type = 'couronnes';
			$scope.plateauLabyrintheTourDeJeu.couronne = index;
			$scope.plateauLabyrintheTourDeJeu.casesDisponibles = [];
		}).error(function(error){
			console.log('impossible de sauver la nouvelle position des couronnes');
			console.log(error);
		});
	}

	$scope.hoveredCouronne = 0;

	function couronneBlink(couronne){
		$scope.hoveredCouronne = couronne;
		$timeout(function(){
			if ($scope.hoveredCouronne === couronne){
				$scope.hoveredCouronne = - couronne;
				$timeout(function(){
					if (Math.abs($scope.hoveredCouronne) === couronne){
						$scope.hoveredCouronne = couronne;
					}
				},500);
			}
		},500);
	}

	$scope.hoverCouronne = function(couronne){
		if (couronne === 0){
			$scope.hoveredCouronne = 0;
		}
		else {
			$scope.hoveredCouronne = couronne;
			$timeout(function(){
				if ($scope.hoveredCouronne === couronne){
					$scope.hoveredCouronne = - couronne;
					// $timeout(function(){
					// 	if (Math.abs($scope.hoveredCouronne) === couronne){
					// 		$scope.hoverCouronne(couronne);
					// 	}
					// },800);
				}
			},800);
		}
	}

	$scope.flechesPositions = {
		down: [
			{},
			{left: -50,height: 50,top: 0},
			{left: -25,height: 80,top: 0},
			{left: 10,height: 110,top: 0},
			{left: 40,height: 150,top: 0}
		],
		up: [
			{},
			{left: -50,height: 50,top: -50},
			{left: -25,height: 80,top: -79},
			{left: 10,height: 110,top: -107},
			{left: 40,height: 150,top: -150}
		]
	}

	// Pions:

	// function to calculate position (and size?) of pions in case
	function updatePionsStyles(couronne,position){
		var positionsPions = [
			// Couronne 0
			[
				// 1 pion
				[{left: 46,top:46}],
				// 2 pions
				[{left: 22,top:45},{left: 65,top:24}],
				// 3 pions
				[{left: 22,top:45},{left: 65,top:24},{left: 57,top:69}]
			],
			// Couronne 1
			[
				// 1 pion
				[{left: 42,top:46}],
				// 2 pions
				[{left: 78,top:21},{left: 19,top:80}],
				// 3 pions
				[{left: 78,top:21},{left: 19,top:80},{left: 42,top:46}]
			],
			// Couronne 2
			[
				// 1 pion
				[{left: 32,top:57}],
				// 2 pions
				[{left: 50,top:23},{left: 19,top:80}],
				// 3 pions
				[{left: 32,top:57},{left: 50,top:23},{left: 23,top:94}]
			],	
			// Couronne 3
			[
				// 1 pion
				[{left: 24,top:38}],
				// 2 pions
				[{left: 29,top:18},{left: 19,top:56}],
				// 3 pions
				[{left: 32,top:57},{left: 42,top:19},{left: 9,top:32}]
			],
			// Couronne 4
			[
				// 1 pion
				[{left: 19,top:18}],
				// 2 pions
				[{left: 37,top:11},{left: 5,top:25}],
				// 3 pions
				[{left: 13,top:27},{left: 37,top:19},{left: 4,top:4}]
			]
		];
		var nombrePions = $scope.plateauLabyrinthe[couronne][position].joueurs.length;
		$scope.plateauLabyrinthe[couronne][position].pionsStyles = positionsPions[couronne][nombrePions - 1];
	}

	function addPionToCase(caseId,joueurId){
		for (var i = 0;i < $scope.plateauLabyrinthe.length;i ++){
			for (var j = 0;j < $scope.plateauLabyrinthe[i].length;j ++){
				if ($scope.plateauLabyrinthe[i][j].numero == caseId){
					$scope.plateauLabyrinthe[i][j].joueurs.push(joueurId);
					$scope.plateauLabyrinthe[i][j].joueursNumber ++;
					updatePionsStyles(i,j);
				}
			}
		}
	}

	function removePionFromCase(caseId,joueurId){
		console.log(caseId)
		for (var i = 0;i < $scope.plateauLabyrinthe.length;i ++){
			for (var j = 0;j < $scope.plateauLabyrinthe[i].length;j ++){
				if ($scope.plateauLabyrinthe[i][j].numero == caseId){
					var index = $scope.plateauLabyrinthe[i][j].joueurs.indexOf(joueurId);
					if (index >= 0){
						$scope.plateauLabyrinthe[i][j].joueurs.splice(index,1);
						$scope.plateauLabyrinthe[i][j].joueursNumber --;
						updatePionsStyles(i,j);
					}
				}
			}
		}
	}

	$rootScope.$on('partie-general-joueurs-loaded', function(event, args) {
		for (var i in $scope.joueurs){
			if ($scope.joueurs[i].pions[0].plateau === 'labyrinthe'){
				addPionToCase($scope.joueurs[i].pions[0].case,$scope.joueurs[i].id);
			}
		}
	});

	// $rootScope.$on('plateaux-labyrinthe-move-pion', function(event, args) {
	// 	$scope.joueurs[$scope.joueurId].pions[0].plateau = 'labyrinthe';
	// 	addPionToCase(args.case,$scope.joueurId);
	// 	$scope.goToPlateau(1);
	// });

	$rootScope.$on('plateaux-move-pion-callback', function(event, args) {
		if (args.plateau === 'labyrinthe'){
			addPionToCase(args.case,$scope.joueurId);
		}
		if (args.previousPlateau === 'labyrinthe'){
			removePionFromCase(args.previousCase,$scope.joueurId);
		}		
	});

	// Tour de Jeu:

	$scope.plateauLabyrintheTourDeJeu = {
		casesDisponibles: [],
		monteeDisponible: []
	};

	// Retrouver l'appartenance d'un pion à une zone d'une couronne
	function findSection(position,couronne){
		// La couronne 3 est la seule irrégulière
		if (couronne !== 3){
			var sectionsCouronne = [0,2,2,3,8];
			var sectionCouronne = sectionsCouronne[couronne];
			if (couronne !== 4){
				position = (position + 1) % $scope.plateauLabyrinthe[couronne].length; 
			}
			return(Math.floor(position / sectionCouronne));
		}
		else {
			if (position < 2){
				return(0);
			}
			else if (position < 5){
				return(1);
			}
			else if (position < 7){
				return(2);
			}
			else if (position < 10){
				return(3);
			}
			else if (position < 13){
				return(4);
			}
			else {
				return(5);
			}
		}
	}

	function rechercheCasesDisponibles(position,couronne){
		$scope.plateauLabyrintheTourDeJeu.casesDisponibles = [];
		if (couronne > 0){
			var currentSection = findSection(position,couronne);
			// recherche des cases disponibles:
			// sur la meme couronne:
			for (var i = position - $scope.plateauLabyrintheTourDeJeu.de;i <= position + $scope.plateauLabyrintheTourDeJeu.de;i ++){
				var i2 = (i + $scope.plateauLabyrinthe[couronne].length) % $scope.plateauLabyrinthe[couronne].length;
				if (findSection(i2,couronne) === currentSection){
					$scope.plateauLabyrintheTourDeJeu.casesDisponibles.push($scope.plateauLabyrinthe[couronne][i2].numero);
				}
			}
		}
	}

	function rechercheMonteeDisponible(position,couronne){
		$scope.plateauLabyrintheTourDeJeu.monteeDisponible = [];
		// recherche une possibilite de montee:
		var sectionsCouronne = $scope.plateauLabyrinthe[couronne].length;
		var positionReelle = ((position + $scope.positionCouronnes[couronne]) % sectionsCouronne + sectionsCouronne) % sectionsCouronne;
		var cle = $scope.plateauLabyrinthe[couronne][position].cle;
		if (cle !== undefined){
			if (couronne !== 0) {
				var sectionsCouronneSuperieure = $scope.plateauLabyrinthe[couronne-1].length;
				var positionSuperieure = ((Math.floor(positionReelle/2) - $scope.positionCouronnes[couronne-1]) % sectionsCouronneSuperieure + sectionsCouronneSuperieure) % sectionsCouronneSuperieure;
				if (cle === $scope.plateauLabyrinthe[couronne-1][positionSuperieure].cle){
					$scope.plateauLabyrintheTourDeJeu.monteeDisponible.push($scope.joueurs[$scope.joueurId].pions[0].case);
				}
			}
			// recherche une possibilite de descente:
			if (couronne !== 4){	
				var sectionsCouronneInferieure = $scope.plateauLabyrinthe[couronne+1].length; 
				var positionInferieure1 = ((positionReelle * 2 - $scope.positionCouronnes[couronne + 1]) % sectionsCouronneInferieure + sectionsCouronneInferieure) % sectionsCouronneInferieure;
				var positionInferieure2 = (positionInferieure1 + 1) % sectionsCouronneInferieure;
				if (cle === $scope.plateauLabyrinthe[couronne+1][positionInferieure1].cle){
					$scope.plateauLabyrintheTourDeJeu.monteeDisponible.push($scope.plateauLabyrinthe[couronne + 1][positionInferieure1].numero);
				}
				else if (cle === $scope.plateauLabyrinthe[couronne+1][positionInferieure2].cle){
					$scope.plateauLabyrintheTourDeJeu.monteeDisponible.push($scope.plateauLabyrinthe[couronne + 1][positionInferieure2].numero);
				}
			}
		}
	}

	$rootScope.$on('plateaux-labyrinthe-de', function(event, args) {
		$scope.plateauLabyrintheTourDeJeu = {
			casesDisponibles: [],
			monteeDisponible: []
		};
		var deResult = args.result;
		$scope.plateauLabyrintheTourDeJeu.de = deResult;
		var couronne = -1;
		var position = -1;
		for (var i = 0;i < $scope.plateauLabyrinthe.length;i ++){
			for (var j = 0;j < $scope.plateauLabyrinthe[i].length;j ++){
				if ($scope.plateauLabyrinthe[i][j].numero == $scope.joueurs[$scope.joueurId].pions[0].case){
					couronne = i;
					position = j;
				}
			}
		}
		rechercheCasesDisponibles(position,couronne);
		rechercheMonteeDisponible(position,couronne);
	});	

	$scope.movePion = function(numero){
		var previousCoordinates = getCoordinates($scope.joueurs[$scope.joueurId].pions[0].case);
		var newCoordinates = getCoordinates(numero);
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
			removePionFromCase($scope.joueurs[$scope.joueurId].pions[0].case,$scope.joueurId);
			$scope.joueurs[$scope.joueurId].pions[0].case = numero;
			$scope.$emit('plateaux-pion-move',{});
			addPionToCase(numero,$scope.joueurId);
			// Update tour de jeu :
			if (previousCoordinates.couronne === newCoordinates.couronne){
				// find shortest distance
				var sectionsCouronne = $scope.plateauLabyrinthe[previousCoordinates.couronne].length;
				var distance1 = (previousCoordinates.position - newCoordinates.position + sectionsCouronne) % sectionsCouronne;
				var distance2 = (newCoordinates.position - previousCoordinates.position + sectionsCouronne) % sectionsCouronne;
				$scope.plateauLabyrintheTourDeJeu.de -= Math.min(distance1,distance2);
			}
			$scope.plateauLabyrintheTourDeJeu.type = 'deplacement';
			if ($scope.plateauLabyrintheTourDeJeu.de === 0){
				$scope.plateauLabyrintheTourDeJeu = {
					casesDisponibles: [],
					monteeDisponible: []
				}
			}
			rechercheCasesDisponibles(newCoordinates.position,newCoordinates.couronne);
			rechercheMonteeDisponible(newCoordinates.position,newCoordinates.couronne);
		}).error(function(error){
			console.log("napapu sauver pion");
			console.log(error);
		});
	}

	$scope.monteeCouronne = function(){
		var previousCoordinates = getCoordinates($scope.joueurs[$scope.joueurId].pions[0].case);
		var position = previousCoordinates.position;
		var couronne = previousCoordinates.couronne;
		var sectionsCouronne = $scope.plateauLabyrinthe[couronne].length;
		var positionReelle = ((position + $scope.positionCouronnes[couronne]) % sectionsCouronne + sectionsCouronne) % sectionsCouronne;
		var cle = $scope.plateauLabyrinthe[couronne][position].cle;
		// Montée supérieure
		var monteeSuperieure = false;
		if (couronne !== 0){
			var sectionsCouronneSuperieure = $scope.plateauLabyrinthe[couronne-1].length;
			var positionSuperieure = ((Math.floor(positionReelle/2) - $scope.positionCouronnes[couronne-1]) % sectionsCouronneSuperieure + sectionsCouronneSuperieure) % sectionsCouronneSuperieure;
			if (couronne === 4 || cle === $scope.plateauLabyrinthe[couronne - 1][positionSuperieure].cle){
				$scope.movePion($scope.plateauLabyrinthe[couronne - 1][positionSuperieure].numero);
				rechercheCasesDisponibles(positionSuperieure,couronne - 1);
				monteeSuperieure = true;
			}
		}
		// Montée inférieure
		if (couronne !== 4 && !monteeSuperieure){
			var sectionsCouronneInferieure = $scope.plateauLabyrinthe[couronne+1].length; 
			var positionInferieure1 = ((positionReelle * 2 - $scope.positionCouronnes[couronne + 1]) % sectionsCouronneInferieure + sectionsCouronneInferieure) % sectionsCouronneInferieure;
			var positionInferieure2 = (positionInferieure1 + 1) % sectionsCouronneInferieure;
			if (cle === $scope.plateauLabyrinthe[couronne + 1][positionInferieure1].cle){
				$scope.movePion($scope.plateauLabyrinthe[couronne + 1][positionInferieure1].numero);
				rechercheCasesDisponibles(positionInferieure1,couronne + 1);
			}
			else if (cle === $scope.plateauLabyrinthe[couronne + 1][positionInferieure2].cle){
				$scope.movePion($scope.plateauLabyrinthe[couronne + 1][positionInferieure2].numero);
				rechercheCasesDisponibles(positionInferieure2,couronne + 1);
			}
		}
	}

}]);