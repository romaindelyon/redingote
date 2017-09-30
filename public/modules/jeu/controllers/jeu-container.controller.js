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
	
	$scope.utiliserCarte = function(index,pile){
		var carte = $scope.jeu[pile][index];
		carte.statut.utilisationIndexChoisi = 0;
		if (carte.statut.utilisation[carte.statut.utilisationIndexChoisi].action){
			$scope.$emit('confrontations-attaque-action-start', {carte: carte,carteIndex: index,utilisationIndex: carte.statut.utilisationIndexChoisi});
		}
		else {
			$scope.$emit('cartes-utilisation',{carte: carte});
		}
	}

  //   $scope.utiliserCarte = function(index){
  //   	var carte = $scope.jeu.ouvertes[index];
		// console.log(index);
		// if (carte.categorie == 'combat'){
		// 	$scope.$emit('confrontations-combat-start', {carte: carte,carteIndex: index});
		// }
		// $scope.focusIndex = -2;
  //   }
	
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

	function contrainteMatch(utilisation,contrainte){
		if (contrainte != undefined){
			var contrainteMet = false;
			// Contraintes de position :
			if (contrainte.categorie === 'position'){
				if (contrainte.joueur === 'lanceur'){
					if (contrainte.type === 'zone'){
						if (contrainte.valeur === $scope.joueurs[$scope.joueurId].pions[0].zone){
							contrainteMet = true;
						}
					}
				}
				else if (contrainte.joueur === 'adversaire'){
					for (var l in $scope.autresJoueurs){
						var joueurIndex = $scope.autresJoueurs[l];
						var joueurCiblePossible = false;
						for (var m = 0;m < $scope.joueurs[joueurIndex].pions.length;m ++){
							if (contrainte.type === 'zone' && contrainte.valeur === $scope.joueurs[joueurIndex].pions[m].zone){
								contrainteMet = true;
								joueurCiblePossible = true;
							}
						}
						// cette contrainte ne fonctionne pas pour ces adversaires :
						if (!joueurCiblePossible){
							var joueurCibleIndex = utilisation.ciblePossible.indexOf(joueurIndex);
							if (joueurCibleIndex >= 0){
								utilisation.ciblePossible.splice(joueurCibleIndex,1);
							}
						}
					}
				}
			}			
		}
		else {
			var contrainteMet = true;
		}
		return(contrainteMet);
	}
	
	function utilisationPossible(carte,args){
		// On recherche une carte spécifique
		if (args.specifique){
			if (carte.code === args.code){
				console.log('code trouvé');
				carte.statut.utilisable = true;
			}
		}
		// On recherche une action ou une circonstance :
		else {
			carte.statut.utilisationIndex = [];
			if (carte.statut.utilisation != undefined){
				for (var i = 0;i < carte.statut.utilisation.length;i ++){
					var utilisation = carte.statut.utilisation[i];
					if (utilisation.consequences != undefined){
						console.log(utilisation);
						var circonstanceMet = false;
						if (!args.action){
							if (!utilisation.action){
								for (var j = 0;j < utilisation.circonstances.length;j ++){
									if (circonstanceMatch(utilisation.circonstances[j],args)){
										circonstanceMet = true;
									}
								}
								if (utilisation.action && !args.action){
									circonstanceMet = false;
								}
							}
						}
						else {
							circonstanceMet = utilisation.action;
						}
						if (circonstanceMet){
							console.log("circonstance met");
							utilisation.ciblePossible = [];
							for (var i in $scope.autresJoueurs){
								utilisation.ciblePossible.push($scope.autresJoueurs[i]);
							}
							var contraintesMet = true;
							for (var k = 0;k < utilisation.contraintes.length;k ++){
								contraintesMet = contraintesMet && contrainteMatch(utilisation,utilisation.contraintes[k]);
							}
							if (contraintesMet && utilisation.ciblePossible.length > 0){
								console.log("contraintes met");
								if (args.action){
									carte.statut.utilisable = true;
								}
								else {
									carte.statut.utilisable = args.categorie;
								}
								carte.statut.utilisationIndex.push(i);
							}
						}
					}
				}
			}
		}
	}


	var cartesUtilisationPossible = $rootScope.$on('cartes-utilisation-possible',function(event,args){
		for (var i = 0;i < $scope.jeu.main.length;i ++){
			console.log($scope.jeu.main[i]);
			utilisationPossible($scope.jeu.main[i],args);
		}
		for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
			console.log($scope.jeu.horsPioche[i]);
			utilisationPossible($scope.jeu.horsPioche[i],args);
		}
		for (var i = 0;i < $scope.jeu.ouvertes.length;i ++){
			console.log($scope.jeu.ouvertes[i]);
			utilisationPossible($scope.jeu.ouvertes[i],args);
		}
	});
	$scope.$on("$destroy", cartesUtilisationPossible);

	var cartesUtilisationReset = $rootScope.$on('cartes-utilisation-reset',function(event,args){
		console.log('utilisation reset');
		for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
			$scope.jeu.horsPioche[i].statut.utilisable = false;
			$scope.jeu.horsPioche[i].statut.utilisationIndex = [];
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