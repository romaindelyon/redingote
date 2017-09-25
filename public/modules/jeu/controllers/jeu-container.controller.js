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

	// function findObjet(code){
	// 	console.log(code);
	// 	console.log($scope.objets);
	// 	var objetIndex = -1;
	// 	for (var i = 0;i < $scope.objets.length;i ++){
	// 		if ($scope.objets[i].code === code){
	// 			objetIndex = i;
	// 		}
	// 	}
	// 	return ($scope.objets[objetIndex]);
	// }

	function circonstanceMatch(circonstanceCarte,circonstance){
		console.log(circonstanceCarte);
		console.log(circonstance);
		var resultat = circonstanceCarte.categorie === circonstance.categorie &&
			(circonstanceCarte.type === circonstance.type || circonstanceCarte.type == undefined) &&
			(circonstanceCarte.valeur === circonstance.valeur || circonstanceCarte.valeur == undefined);
		console.log(resultat)
		return(resultat);
	}

	function contrainteMatch(contrainte){
		if (contrainte != undefined){
			var contrainteMet = false;
			// Contraintes de position :
			if (contrainte.categorie === 'position'){
				if (contrainte.type === 'zone'){
					console.log($scope.joueurs[$scope.joueurId].pions[0].zone);
					if (contrainte.valeur === $scope.joueurs[$scope.joueurId].pions[0].zone){
						contrainteMet = true;
					}
				}
			}			
		}
		else {
			var contrainteMet = true;
		}
		return(contrainteMet);
	}

	var cartesUtilisationPossibleCirconstance = $rootScope.$on('cartes-utilisation-possible-circonstance',function(event,args){
		console.log('utilisation possible');
		for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
			console.log($scope.jeu.horsPioche[i]);
			if ($scope.jeu.horsPioche[i].utilisation.indexOf('reaction') >= 0 && $scope.jeu.horsPioche[i].info.circonstances.length > 0){
				for (var j = 0;j < $scope.jeu.horsPioche[i].info.circonstances.length;j ++){
					// if ($scope.jeu.horsPioche[i].info.circonstances[j].categorie === args.categorie &&
					// 	($scope.jeu.horsPioche[i].info.circonstances[j].type === args.type || $scope.jeu.horsPioche[i].info.circonstances[j].type == undefined) &&
					// 	($scope.jeu.horsPioche[i].info.circonstances[j].valeur === args.valeur || $scope.jeu.horsPioche[i].info.circonstances[j].valeur == undefined)){
					if (circonstanceMatch($scope.jeu.horsPioche[i].info.circonstances[j],args)){
						console.log('code trouvé');
						$scope.jeu.horsPioche[i].statut.utilisable = args.categorie;
					}
				}			
			}
		}
		for (var i = 0;i < $scope.jeu.ouvertes.length;i ++){
			console.log($scope.jeu.ouvertes[i]);
			if ($scope.jeu.ouvertes[i].categorie === 'objet'){
				if ($scope.jeu.ouvertes[i].pile === 'hors_pioche'){
					var objet = $scope.jeu.ouvertes[i];
				}
				else {
					var objet = $scope.objets[$scope.jeu.ouvertes[i].info[$scope.jeu.ouvertes[i].statut.ouverteIndex]];
				} 
				console.log(objet);
				if (objet != undefined && objet.info.circonstances.length > 0){
					for (var j = 0;j < objet.info.circonstances.length;j ++){
						if (circonstanceMatch(objet.info.circonstances[j],args)){
							console.log('code trouvé');
							var contraintesMet = true;
							for (var k = 0;k < objet.info.contraintes.length;k ++){
								console.log(objet.info.contraintes[k]);
								contraintesMet = contraintesMet && contrainteMatch(objet.info.contraintes[k]);
							}
							if (contraintesMet){
								$scope.jeu.ouvertes[i].statut.utilisable = args.categorie;
							}
						}
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
	$scope.$on("$destroy", cartesUtilisationReset);

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