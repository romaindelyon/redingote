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

angular.module('confrontations').directive('redConfrontationsDefenseAction', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-defense-action.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('confrontations').directive('redConfrontationsDefenseDuel', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-defense-duel.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('confrontations').directive('redConfrontationsAttaqueDuel', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-attaque-duel.view.html',
			restrict: 'E'
		};
	}
]);