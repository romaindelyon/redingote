'use strict';

angular.module('jeu').controller('JeuMainController', ['$scope','$rootScope','$timeout','Cartes',
	function($scope,$rootScope,$timeout,Cartes) {

	// Mains:

	$scope.focusIndex = -2;
	$scope.focusId = -1;

	$scope.focusCarte = function(code){
		console.log(code);
		var index = -1;
		for (var i = 0;i < $scope.jeu.main.length;i ++){
			if ($scope.jeu.main[i].code === code){
				index = i;
			}
		}
		if (index == $scope.focusIndex){
			$scope.focusIndex = -2;
			$scope.focusId = -1;
		}
		else {
			$scope.focusIndex = index;
			$scope.focusId = $scope.jeu.main[index].id;
		}	
	}

	$scope.utiliserCarte = function(index){
		var carte = $scope.jeu.main[index];
		if (carte.categorie == 'action'){
			$scope.$emit('confrontations-attaque-action-start', {carte: carte,carteIndex: index});
		}
	}

	$scope.ouvrirCarte = function(index){
		var carte = $scope.jeu.main[index];
		carte.statut.ouverte = true;
		Cartes.changementStatut({
    		carteId: $scope.jeu.main[index].id,
    		statut: carte.statut
    	}).success(function(){
			$timeout(function(){
				if (carte.categorie !== "grande_carte"){
					$scope.jeu.ouvertes.push(carte);
				}
				else {
					$scope.jeu.grandesCartes.push(carte);
					$scope.$emit('grandes-cartes-initialize',{});
				}
			},250);
			$scope.jeu.main.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
	}

	$scope.jeterCarte = function(index){
		Cartes.moveCartes({
    		carteIds: [$scope.jeu.main[index].id],
    		position: -2
    	}).success(function(){
    		var carte = $scope.jeu.main[index];
    		carte.statut = {};
			$scope.defausses.pioche.push(carte);
			$scope.jeu.main.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
	}

	$scope.jeterAttaqueCarte = function(index){
		$scope.$emit('confrontations-defense-jeter-carte', {index: index});
	}

	$scope.jeterCarteInterface = function(index){
		$scope.$emit('cartes-jeter-id', {carte: $scope.jeu.main[index]});
	}

	// Défausse de multiples cartes
	$rootScope.$on('jeu-main-jeter', function(event, args) {
		console.log(args.cartes);
		var carteIds = [];
		for (var i in args.cartes){
			carteIds.push(args.cartes[i].id);
		}
		console.log(carteIds);
		Cartes.moveCartes({
    		carteIds: carteIds,
    		position: -2
        }).success(function(){
        	$scope.$emit('jeu-main-jeter-callback', {success: true});
        	for (var i in args.cartes){
        		var id = args.cartes[i].id;
				var index = -1;
				var j = 0;
				while (index < 0 && j < $scope.jeu.main.length){
					if ($scope.jeu.main[j].id == id){
						index = j;
					}
					j ++;
				}
	    		var carte = $scope.jeu.main[index];
	    		carte.statut = {};
				$scope.defausses.pioche.push(carte);
				$scope.jeu.main.splice(index,1);
        	}
        	$scope.focusIndex = -2;
    	}).error(function(){
    		$scope.$emit('jeu-main-jeter-callback', {success: false});
    	});
	});


	// Interface de défausse de cartes:
	$rootScope.$on('cartes-jeter-start', function(event, args) {
		$scope.jeterDispo = true;
		$scope.jeterBoutonTitre = args.boutonName;
		var nombreDeCartes = $scope.jeu.main.length;
		$scope.$emit('cartes-jeter-start-callback', {nombreDeCartes: nombreDeCartes});
	});
	$rootScope.$on('cartes-jeter-notfull', function(event, args) {
		$scope.jeterDispo = true;
	});
	$rootScope.$on('cartes-jeter-full', function(event, args) {
		$scope.jeterDispo = false;
	});

}]);