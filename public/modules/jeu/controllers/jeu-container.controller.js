'use strict';

angular.module('jeu').controller('JeuContainerController', ['$scope','$rootScope','Joueurs',
	function($scope,$rootScope,Joueurs) {

	$scope.actionsDisponibles = {
		action: true,
		nextAction: true
	}

	$scope.focusedTab = 0;

	$scope.tabs = [
		{id: 'cartes_ouvertes',nom: 'Cartes ouvertes',style:'#fff8e8'},
		{id: 'objets_hors_pioche',nom: 'Objets hors pioche',style: '#fff5f5'},
		{id: 'pouvoirs',nom: 'Pouvoirs',style: '#fff0ff'},
		{id: 'missions',nom: 'Missions',style: '#e8fbff'},
		{id: 'grandes_cartes',nom: 'Grandes cartes',style: '#efe8ff'}
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

	var cartesUtilisationPossibleCirconstance = $rootScope.$on('cartes-utilisation-possible-circonstance',function(event,args){
		console.log('utilisation possible');

		for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
			console.log($scope.jeu.horsPioche[i]);
			if ($scope.jeu.horsPioche[i].utilisation.indexOf('reaction') >= 0 && $scope.jeu.horsPioche[i].info.circonstances.length > 0){
				for (var j = 0;j < $scope.jeu.horsPioche[i].info.circonstances.length;j ++){
					if ($scope.jeu.horsPioche[i].info.circonstances[j].categorie === args.categorie &&
						($scope.jeu.horsPioche[i].info.circonstances[j].type === args.type || $scope.jeu.horsPioche[i].info.circonstances[j].type == undefined) &&
						($scope.jeu.horsPioche[i].info.circonstances[j].valeur === args.valeur || $scope.jeu.horsPioche[i].info.circonstances[j].valeur == undefined)){
						console.log('code trouvé');
						$scope.jeu.horsPioche[i].statut.utilisable = true;
					}
				}			
			}

		}
	});
	$scope.$on("$destroy", cartesUtilisationPossibleCirconstance);

	var cartesUtilisationReset = $rootScope.$on('cartes-utilisation-reset',function(event,args){
		console.log('utilisation reset');
		for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
			$scope.jeu.horsPioche[i].statut.utilisable = false;
		}
	});
	$scope.$

	// Humeurs :

	$scope.createArrayFromNumber = function(num) {
		if (num != undefined){
			return new Array(num); 
		}
    	else {
    		return([]);
    	}
	}

	$scope.humeurMontree = false;
	$scope.humeurIndex = 0;

	$scope.montrerHumeur = function(){
		$scope.humeurMontree = true;
	}
	$scope.cacherHumeur = function(){
		$scope.humeurMontree = false;
	}
	$scope.updateHumeurIndex = function(){
		$scope.humeurIndex = ($scope.humeurIndex + 1)%$scope.joueurs[$scope.joueurId].humeurs.length;
	}

}]);