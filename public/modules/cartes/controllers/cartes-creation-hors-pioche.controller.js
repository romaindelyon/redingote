'use strict';

angular.module('cartes').controller('CartesCreationHorsPiocheController', ['$scope',
	function($scope) {
	
	$scope.reductions = ['Aucune','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

	$scope.createArrayFromNumber = function(num) {
		if (num != undefined){
			return new Array(num); 
		}
    	else {
    		return([]);
    	}
	}

	$scope.ajouterObjet = function(carte){
		console.log(carte);
		carte.info.echangeQuantite ++;
	}

	$scope.retirerObjet = function(carte){
		console.log(carte);
		carte.info.echangeQuantite --;
	}

}]);