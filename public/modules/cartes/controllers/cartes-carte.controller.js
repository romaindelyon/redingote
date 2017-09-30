'use strict';

angular.module('cartes').controller('CartesCarteController', ['$scope',
	function($scope) {
		console.log($scope.objets);
	$scope.dossierPileTransformation = {
		'pioche': 'pioche',
		'hors_pioche': 'hors-pioche'
	};

}]);