'use strict';

angular.module('core').directive('redCoreToolbar', [
	function() {
		return {
			templateUrl: 'modules/core/views/red-core-toolbar.view.html',
			restrict: 'E'
		};
	}
]);