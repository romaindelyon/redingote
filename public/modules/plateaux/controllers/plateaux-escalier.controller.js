'use strict';

angular.module('plateaux').controller('PlateauxEscalierController', ['$scope','$rootScope','Joueurs',
	function($scope,$rootScope,Joueurs) {

	function initalizePlateauEscalier(){
		$scope.escalier = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		$scope.escalierPions = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];

		console.log($scope.joueurs);
		for (var i in $scope.joueurs){
			$scope.escalier[$scope.joueurs[i].escalier].push(i);
			for (var j = 0;j < $scope.joueurs[i].pions.length;j ++){
				if ($scope.joueurs[i].pions[j].plateau === 'escalier'){
					$scope.escalierPions[$scope.joueurs[i].escalier].push(i);
				}
			}
 		}		
	}

	console.log("defining event listeners");

	var partieGeneralJoueursLoadedEventListener = $rootScope.$on('partie-general-joueurs-loaded',function(event,args){
		initalizePlateauEscalier();
	});
	$scope.$on("$destroy",partieGeneralJoueursLoadedEventListener);


	var plateauxEscalierMonterCaseEventListener = $rootScope.$on('plateaux-escalier-monter-case',function(event,args){
		console.log("receiving escalier");
		Joueurs.updateEscalier({escalier: $scope.joueurs[$scope.joueurId].escalier + 1}).success(function(){
			$scope.joueurs[$scope.joueurId].escalier ++;
			console.log("emitting escalier");
			initalizePlateauEscalier();
		}).error(function(){
			console.log("bug d'update escalier");
		});
	});
	$scope.$on("$destroy",plateauxEscalierMonterCaseEventListener);

	var plateauxMovePionCallback = $rootScope.$on('plateaux-move-pion-callback', function(event, args) {
		if (args.plateau === 'escalier'){
			console.log("escalier added");
			console.log($scope.escalierPions);
			console.log($scope.joueurs[$scope.joueurId].escalier);
			$scope.escalierPions[$scope.joueurs[$scope.joueurId].escalier].push($scope.joueurId.toString());
			console.log($scope.escalierPions);
		}
		if (args.previousPlateau === 'escalier'){
			console.log("escalier removed");
			$scope.escalierPions[$scope.joueurs[$scope.joueurId].escalier].splice($scope.escalierPions[$scope.joueurs[$scope.joueurId].escalier].indexOf($scope.joueurId));
		}		
	});
	$scope.$on("$destroy",plateauxMovePionCallback);

}]);