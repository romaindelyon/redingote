'use strict';

angular.module('actions').directive('redActions', [
	function() {
		return {
			templateUrl: 'modules/actions/views/actions.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('actions').directive('redActionsAction', [
	function() {
		return {
			templateUrl: 'modules/actions/views/actions-action.view.html',
			restrict: 'E'
		};
	}
]);
angular.module('actions').directive('redActionsAchat', [
	function() {
		return {
			templateUrl: 'modules/actions/views/actions-achat.view.html',
			restrict: 'E'
		};
	}
]);
angular.module('actions').directive('redActionsQuestion', [
	function() {
		return {
			templateUrl: 'modules/actions/views/actions-question.view.html',
			restrict: 'E'
		};
	}
]);
angular.module('actions').directive('redActionsRecompense', [
	function() {
		return {
			templateUrl: 'modules/actions/views/actions-recompense.view.html',
			restrict: 'E'
		};
	}
]);
angular.module('actions').directive('redActionsNotification', [
	function() {
		return {
			templateUrl: 'modules/actions/views/actions-notification.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('actions').directive('redActionsConfrontations', [
	function() {
		return {
			templateUrl: 'modules/actions/views/actions-confrontations.view.html',
			restrict: 'E'
		};
	}
]);