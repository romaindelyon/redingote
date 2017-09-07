'use strict';

angular.module('plateaux').controller('PlateauxGeneralController', ['$scope','$rootScope','$state','Joueurs',
	function($scope,$rootScope,$state,Joueurs) {

	function movePion(numero,plateau,row,colonne,position,zone){
		var previousCase = $scope.joueurs[$scope.joueurId].pions[0].case;
		var previousPlateau = $scope.joueurs[$scope.joueurId].pions[0].plateau;
		var newPions = [];
		$.each($scope.joueurs[$scope.joueurId].pions,function(i,obj) {
		    newPions.push($.extend(true,{},obj)); 
		});
		newPions[0].case = numero;
		newPions[0].plateau = plateau;
		newPions[0].row = row;
		newPions[0].colonne = colonne;
		newPions[0].position = position;
		newPions[0].zone = zone;
		Joueurs.movePion({
			pions: JSON.stringify(newPions),
			joueurId: $scope.joueurId,
			partieId: $scope.partieId
		}).success(function(){
			$scope.joueurs[$scope.joueurId].pions[0].case = numero;
			$scope.joueurs[$scope.joueurId].pions[0].plateau = plateau;
			$scope.$emit('plateaux-move-pion-callback',{plateau: plateau,previousPlateau: previousPlateau,case: numero,previousCase: previousCase});
			$scope.$emit('plateaux-pion-move',{});
		}).error(function(error){
			console.log("napapu sauver pion");
			console.log(error);
		});
	}

	var plateauxMovePionEventListener = $rootScope.$on('plateaux-move-pion', function(event, args) {
		console.log(args);
		movePion(args.case,args.plateau,args.row,args.colonne,args.position,args.zone);
	});
	$scope.$on("$destroy", plateauxMovePionEventListener);

}]);