'use strict';

angular.module('confrontations').directive('redConfrontationsAttaque', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-attaque.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('confrontations').directive('redConfrontationsDefense', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-defense.view.html',
			restrict: 'E'
		};
	}
]);