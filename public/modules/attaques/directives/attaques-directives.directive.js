'use strict';

angular.module('attaques').directive('redAttaquesContainer', [
	function() {
		return {
			templateUrl: 'modules/attaques/views/attaques-container.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('attaques').directive('redAttaquesDefenseContainer', [
	function() {
		return {
			templateUrl: 'modules/attaques/views/attaques-defense-container.view.html',
			restrict: 'E'
		};
	}
]);