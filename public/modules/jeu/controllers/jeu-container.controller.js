'use strict';

angular.module('jeu').controller('JeuContainerController', ['$scope','Joueurs',
	function($scope,Joueurs) {

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
	}

	$scope.view = 'cartes';

	$scope.changeView = function(index){
		$scope.view = index;
	}

	function sauverNotes(){
		Joueurs.sauverNotes({
			notes: $scope.joueur.notes,
			notes_titre: $scope.joueur.notes_titre,
			joueurId: $scope.joueurId,
			partieId: $scope.partieId
		}).success(function(){
			console.log("les notes sont sauvées");
		}).error(function(){
			console.log("erreur de sauvage de notes");
		});
	}

	$scope.ecrireNotes = function(){
		if ($scope.view !== 'notes'){
			$scope.view = 'notes';
		}
		else {
			// ajouter truc pour sauver les notes
			sauverNotes();
			$scope.view = 'cartes';
		}
	}

}]);