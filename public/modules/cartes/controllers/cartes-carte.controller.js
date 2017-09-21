'use strict';

angular.module('cartes').controller('CartesCarteController', ['$scope',
	function($scope) {

	$scope.dossierPileTransformation = {
		'pioche': 'pioche',
		'hors_pioche': 'hors-pioche'
	};

}]);