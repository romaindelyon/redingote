'use strict';

angular.module('plateaux').controller('PlateauxGeneralController', ['$scope','$rootScope','$state','Joueurs',
	function($scope,$rootScope,$state,Joueurs) {

	function movePion(numero,plateau){
		var previousCase = $scope.joueurs[$scope.joueurId].pions[0].case;
		var previousPlateau = $scope.joueurs[$scope.joueurId].pions[0].plateau;
		var newPions = [];
		$.each($scope.joueurs[$scope.joueurId].pions,function(i,obj) {
		    newPions.push($.extend(true,{},obj)); 
		});
		newPions[0].case = numero;
		newPions[0].plateau = plateau;
		Joueurs.movePion({
			pions: JSON.stringify(newPions),
			joueurId: $scope.joueurId
		}).success(function(){
			$scope.joueurs[$scope.joueurId].pions[0].case = numero;
			$scope.joueurs[$scope.joueurId].pions[0].plateau = plateau;
			$scope.$emit('plateaux-move-pion-callback',{plateau: plateau,previousPlateau: previousPlateau,case: numero,previousCase: previousCase});
		}).error(function(error){
			console.log("napapu sauver pion");
			console.log(error);
		});
	}

	$rootScope.$on('plateaux-move-pion', function(event, args) {
		movePion(args.case,args.plateau);
	});

}]);