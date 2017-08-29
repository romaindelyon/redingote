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

angular.module('jeu').directive('redJeuMission', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-mission.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuGrandesCartes', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-grandes-cartes.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuHorsPioche', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-hors-pioche.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuHumeurs', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-humeurs.view.html',
			restrict: 'E'
		};
	}
]);