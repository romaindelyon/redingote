'use strict';

angular.module('plateaux').directive('redPlateauxPaysage', [
	function() {
		return {
			templateUrl: 'modules/plateaux/views/plateaux-paysage.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('plateaux').directive('redPlateauxLabyrinthe', [
	function() {
		return {
			templateUrl: 'modules/plateaux/views/plateaux-labyrinthe.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('plateaux').directive('redPlateauxEscalier', [
	function() {
		return {
			templateUrl: 'modules/plateaux/views/plateaux-escalier.view.html',
			restrict: 'E'
		};
	}
]);


angular.module('plateaux').directive('redPlateauxActionCase', [
	function() {
		return {
			templateUrl: 'modules/plateaux/views/plateaux-action-case.view.html',
			restrict: 'E'
		};
	}
]);