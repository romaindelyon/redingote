'use strict';

angular.module('jeu').controller('JeuContainerController', ['$scope',
	function($scope) {

	$scope.actionsDisponibles = {
		action: true,
		nextAction: true
	}

	$scope.focusedTab = 0;

	$scope.tabs = [
		{id: 'cartes_ouvertes',nom: 'Cartes ouvertes',style: "{'background-color':'#fff8e8'}"},
		{id: 'objets_hors_pioche',nom: 'Objets hors pioche',style: "{'background-color':'#fff5f5'}"},
		{id: 'humeurs',nom: 'Humeurs',style: "{'background-color':'#fff0ff'}"},
		{id: 'missions',nom: 'Missions',style: "{'background-color':'#e8fbff'}"},
		{id: 'grande_cartes',nom: 'Grandes cartes',style: "{'background-color':'#efe8ff'}"}
	];
	
	$scope.changeTab = function(index){
		$scope.focusedTab = index;
		console.log($scope.tabStyles);
	}

	$scope.view = 'cartes';

	$scope.changeView = function(index){
		$scope.view = index;
	}

	$scope.ecrireNotes = function(){
		if ($scope.view !== 'notes'){
			$scope.view = 'notes';
		}
		else {
			// ajouter truc pour sauver les notes
			$scope.view = 'cartes';
		}
	}

}]);