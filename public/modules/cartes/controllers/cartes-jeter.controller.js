'use strict';

angular.module('cartes').controller('CartesJeterController', ['$scope','$rootScope',
	function($scope,$rootScope) {

	function jeterCarte(carte){
		var carteJetee = false;
		for (var i in $scope.cartes.liste){
			if ($scope.cartes.liste[i].id == carte.id){
				carteJetee = true;
			}
		}
		if (!carteJetee){
			var foundSpot = false;
			var i = 0;
			while (i < $scope.quantite && !foundSpot){
				if (!$scope.cartes.liste[i].filled){
					$scope.cartes.liste[i] = carte;
					$scope.cartes.liste[i].filled = true;
					foundSpot = true;
					$scope.cartes.filled ++;
				}
				// On a tout rempli:
				if ($scope.cartes.filled == $scope.quantite){
					console.log('full cartes');
					$scope.$emit('cartes-jeter-full',{cartes: $scope.cartes.liste});
				}
				i ++;
			}
		}
	}

	$scope.removeCarte = function(index){
		$scope.cartes.liste[index] = {};
		$scope.cartes.filled --;
		$scope.$emit('cartes-jeter-notfull', {});
	}

	$rootScope.$on('cartes-jeter-id', function(event, args) {
		jeterCarte(args.carte);
	});

	var initializeCartesObject = function(){
		$scope.cartes = {
			liste: [],
			filled: 0
		};
		for (var i = 0; i < $scope.quantite; i ++){
			$scope.cartes.liste.push({});
		}
		if ($scope.quantite === 0){
			$scope.description = "Tu n'as plus de cartes de toute façon";
			$scope.$emit('cartes-jeter-full',{cartes: []});
		}
	}
	initializeCartesObject();
	$rootScope.$on('cartes-jeter-start-callback', function(event, args) {
		if (args.nombreDeCartes < $scope.quantite){
			$scope.quantite = args.nombreDeCartes;
		}
		initializeCartesObject();
	});

	$scope.$emit('cartes-jeter-start', {boutonName: $scope.boutonName});

}]);