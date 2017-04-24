'use strict';

angular.module('jeu').directive('redJeuContainer', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-container.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuMain', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-main.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuOuvertes', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-ouvertes.view.html',
			restrict: 'E'
		};
	}
]);