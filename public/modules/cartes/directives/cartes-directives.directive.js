'use strict';

angular.module('cartes').directive('redCartesCreationConsequences', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-consequences.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesCreationContraintes', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-contraintes.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesCreationCirconstances', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-circonstances.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesCreationMission', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-mission.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('cartes').directive('redCartesCreationHorsPioche', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-hors-pioche.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('cartes').directive('redCarte', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-carte.view.html',
			restrict: 'E',
		    scope: {
		      carte: "=",
		      focused: "=",
		      focusCarte: "&",
		      index: "="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesJeter', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-jeter.view.html',
			restrict: 'E',
		    scope: {
		      quantite: "=",
		      description: "=",
		      boutonName: "="
		    }
		};
	}
]);