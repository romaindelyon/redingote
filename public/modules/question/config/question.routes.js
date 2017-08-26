'use strict';

// Setting up route
angular.module('question').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('questions', {
		url: '/questions/:joueur',
		templateUrl: 'modules/question/views/questions.view.html'
	});

}]);