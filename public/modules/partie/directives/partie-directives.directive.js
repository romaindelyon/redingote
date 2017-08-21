'use strict';

angular.module('partie').directive('redPartieTourDeJeu', [
	function() {
		return {
			templateUrl: 'modules/partie/views/partie-tour-de-jeu.view.html',
			restrict: 'E'
		};
	}
]);