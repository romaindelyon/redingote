'use strict';

angular.module('question').controller('QuestionsController', ['$scope','$stateParams','Questions',
	function($scope,$stateParams,Questions) {

	var joueurId = parseInt($stateParams.joueur);

	$scope.newQuestion = {
		joueur: joueurId,
		options: [""]
	};

	$scope.createQuestion = function(){
		Questions.createQuestion($scope.newQuestion).success(function(){
			$scope.questions.push($scope.newQuestion);
			$scope.NouvelleQuestion.$setUntouched();
			$scope.newQuestion = {
				joueur: joueurId,
				options: [""]
			};
		}).error(function(){
			console.log("Error when trying to create questions");
		});
	}

	$scope.ajouterOption = function(){
		$scope.newQuestion.options.push("");
		console.log($scope.newQuestion);
	}

	$scope.retirerOption = function(){
		$scope.newQuestion.options.splice($scope.newQuestion.options.length - 1,1);
	}

	$scope.expand = function(index,direction){
		$scope.questions[index].expanded = direction;
	}

	function initializeQuestions(questions){
		$scope.questions = questions;
	}

	Questions.getQuestionsJoueur({joueurId: joueurId}).success(function(response){
		initializeQuestions(response);
		console.log(response);
	}).success(function(){
		console.log("Error when trying to get questions");
	});
	

}]);