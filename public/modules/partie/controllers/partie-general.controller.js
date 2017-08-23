'use strict';

angular.module('partie').controller('PartieGeneralController', ['$scope','$state','$stateParams','Cartes','Objets','Partie','Joueurs','Confrontations',
	function($scope,$state,$stateParams,Cartes,Objets,Partie,Joueurs,Confrontations) {

	// Tracking if all information has been well retrieved:
	$scope.loaded = {
		partie: false,
		cartes: false,
		joueurs: false,
		defenses: false, // integrated
		confrontationsController: false
	};

	// Get param:

	$scope.joueurId = parseInt($stateParams.joueur);

	$scope.partieId = 1;//parseInt($stateParams.partie);

	// Attaques:

	$scope.attaques = {
		defenses: [],
		recompenses: []
	};

	$scope.defense = {};

	$scope.duel = {};

	$scope.news = [];

	$scope.initiateConfrontations = function(){
		if ($scope.loaded.partie && $scope.loaded.cartes && $scope.loaded.confrontationsController){
			console.log('inside');
			if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
				Confrontations.get({joueurId: $scope.joueurId}).success(function(response){
					for (var i in response){
						if (response[i].categorie == 'attaque'){
							$scope.attaques.defenses.push(response[i]);
						}
						else if (response[i].categorie == 'recompense'){
							$scope.attaques.recompenses.push(response[i]);
						}
						else if (response[i].categorie == 'news'){
							$scope.news.push(response[i]);
						}
					}
					$scope.loaded.defenses = true;
					$scope.$emit('confrontations-defense-start', {});
				});
			}
			else if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 5){
				console.log('emitting');
				$scope.$emit('confrontations-attaque-duel-start', {});
			}
			$scope.loaded.defenses = true;
		}
	}

	// Partie:

	$scope.resetDispos = function(){
		$scope.partie.dispo = {
			des: {
				rhombo: 0,
				paysage: 0,
				duel: 0,
				echecs: 0,
				labyrinthe: 0
			},
			pioches: {
				pioche: 0,
				questions: 0,
				humeurs: 0,
				missions: 0
			},
			cartes: {
				ouvertures: false,
				main_jeter: false,
				ouvertes_jeter: false,
				utiliser: false
			},
			plateaux: {
				paysage: 0,
				layrinthe: 0
			},
			duel: false,
			action_de_case: false
		}
	}

	$scope.tourDeJeu = {
		actionEnCours: false,
		notification: [0,0],
		recompense: [0,0],
		action: [0,0],
		pouvoir: [0,0],
		question: [0,0],
		achat: [0,0],
		'trois-familles': [0,0],
		duel: [0,0]
	}
	
	Partie.getPartie().success(function(response){
		$scope.partie = {
			tour_joueur: response[0].tour_joueur,
			tour_action: response[0].tour_action,
			tour_skip: response[0].tour_skip,
			tonalite: response[0].tonalite,
			temps: response[0].temps,
			dispo: response[0].dispo,
			positionCouronnes: response[0].positionCouronnes,
			valiseNonMaterialisee: response[0].valiseNonMaterialisee
		};
		if ($scope.partie.tour_joueur !== $scope.joueurId){
			$scope.resetDispos();
		}
		$scope.loaded.partie = true;
		$scope.initiateConfrontations();
		$scope.$emit('partie-general-partie-loaded', {});
	})

	// Jeu:

	$scope.jeu = {};

	$scope.jeu.de = -1;

	$scope.jeu.main = [];
	$scope.jeu.ouvertes = [];
	$scope.jeu.missions = [];

	//Cartes 

	function getCartes(){
		Cartes.getCartes({partieId: $scope.partieId}).success(function(response){
	    	$scope.cartes = {};
	    	for (var i in response){
	    		var carte = response[i];
	    		$scope.cartes[carte.id] = carte;
	    		// Cartes de la pioche:
	    		if (carte.pile == 'pioche'){
	    			if (carte.position == -2){
	    				$scope.defausses.pioche.push(carte);
	    			}
	    			else if (carte.position == -1) {
	    				$scope.pioches.pioche.push(carte);
	    			}
	    			else if (carte.position == $scope.joueurId){
	    				if (carte.statut.ouverte){
	    					$scope.jeu.ouvertes.push(carte);
	    				}
	    				else {
	    					$scope.jeu.main.push(carte);
	    				}
	    			}
	    			else if (carte.statut.ouverte){
	    				$scope.joueurs[carte.position].ouvertes.push(carte);
	    			}
	    		}
	    		else if (carte.pile == 'missions'){
	    			if (carte.position == -1) {
	    				$scope.pioches.missions.push(carte);
	    			}
	    			if (carte.position == $scope.joueurId){
	    				console.log('and joueur');
	    				$scope.jeu.missions.push(carte);
	    			}
	    		}
	    	}
			$scope.loaded.cartes = true;
			$scope.initiateConfrontations();
	    }).error(function(response){
	    	console.log("Error while trying to get cartes");
	    });
	}

	// Objets:
	$scope.objets = {};
	Objets.getObjets().success(function(responseObjets){
		for (var i in responseObjets){
			// agreger objets par code:
			if ($scope.objets[responseObjets[i].code] === undefined){
				$scope.objets[responseObjets[i].code] = responseObjets[i];
			}
		}
		console.log($scope.cartesTable);
	});

	// Joueurs:

	$scope.joueurs = {
		0 : {},
		1: {},
		2: {}
	};
	$scope.joueur = {};

	Joueurs.getJoueurs().success(function(response){
		var joueur = response[$scope.joueurId]
		$scope.joueur = {
			id: joueur.id,
			nom: joueur.nom,
			diable: joueur.diable,
			belette: joueur.belette,
			notes_titre: joueur.notes_titre,
			notes: joueur.notes
		}
		$scope.joueurs[0] = response[0];
		$scope.joueurs[1] = response[1];
		$scope.joueurs[2] = response[2];
		for (var i in $scope.joueurs){
			$scope.joueurs[i].ouvertes = [];
		}
		getCartes();
		$scope.$emit('partie-general-joueurs-loaded');
	})


	$scope.autresJoueurs = [($scope.joueurId + 2)%3,($scope.joueurId + 1)%3];
	$scope.joueurLeft = ($scope.joueurId + 2)%3;
	$scope.joueurRight = ($scope.joueurId + 1)%3;

	// Pioches et defausses :

	$scope.pioches = {};
	$scope.pioches.pioche = [];
	$scope.pioches.missions = [];
	
	$scope.defausses = {};
	$scope.defausses.pioche = [];

	// Plateaux

	$scope.plateau = -1;

	$scope.plateaux = [
		{
			id: 'paysage',
			nom: 'Plateau Paysage'
		},
		{
			id: 'labyrinthe',
			nom: 'Plateau Labyrinthe'
		},
		{
			id: 'escalier',
			nom: 'Plateau Escalier'
		}
	];

	$scope.goToPlateau = function(plateauId){
		if ($scope.plateau == plateauId){
			$scope.plateau = -1;
		}
		else {
			$scope.plateau = plateauId;
		}
	}

	// Attaques:

	$scope.attaque = {};
	$scope.confrontation = {};
	
	// Actions disponibles

	$scope.actionsDisponibles = {};

}]);