'use strict';

angular.module('jeu').controller('JeuHorsPiocheController', ['$scope','$rootScope','Cartes',
	function($scope,$rootScope,Cartes) {

	$scope.focusIndex = -2;

	$scope.focusCarte = function(index){
		if (index == $scope.focusIndex){
			$scope.focusIndex = -2;
		}
		else {
			$scope.focusIndex = index;
		}	
	}

	$scope.jeterCarte = function(index){
		Cartes.moveCartes({
    		carteIds: [$scope.jeu.horsPioche[index].id],
    		position: -1
    	}).success(function(){
    		var carte = $scope.jeu.horsPioche[index];
    		carte.statut = {};
			$scope.jeu.horsPioche.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	});
	}

	$rootScope.$on('cartes-utilisation-possible',function(event,args){
		console.log('utilisation possible');
		for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
			if ($scope.jeu.horsPioche[i].code === args.code){
				console.log('code trouvé');
				$scope.jeu.horsPioche[i].statut.utilisable = true;
			}
		}
	});

	$scope.utiliserCarteHorsPioche = function(index){
		console.log($scope.jeu.horsPioche[index]);
		if ($scope.jeu.horsPioche[index].utilisation.indexOf('reaction') >= 0){
			$scope.$emit('cartes-utilisation',{carte: $scope.jeu.horsPioche[index]});
		}
		$scope.focusIndex = -2;
	}

}]);