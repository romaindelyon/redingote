'use strict';

angular.module('partie').controller('PartieGeneralController', ['$scope','$state','$stateParams','Cartes','Partie','Joueurs','Confrontations',
	function($scope,$state,$stateParams,Cartes,Partie,Joueurs,Confrontations) {

	// Tracking if all information has been well retrieved:
	$scope.loaded = {
		partie: false,
		cartes: false,
		joueurs: false,
		defenses: false, // integrated
		defenseController: false
	};

	// Get param:

	$scope.joueurId = $stateParams.joueur;

	// Attaques:

	$scope.attaques = {
		defenses: [],
		recompenses: []
	};

	$scope.defense = {};

	$scope.duel = {};

	$scope.getAttaques = function(){
		if ($scope.loaded.partie && $scope.loaded.cartes && $scope.loaded.defenseController){
			if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
				Confrontations.get({joueurId: $scope.joueurId}).success(function(response){
					for (var i in response){
						if (response[i].categorie == 'attaque'){
							$scope.attaques.defenses.push(response[i]);
						}
						else if (response[i].categorie == 'recompense'){
							$scope.attaques.recompenses.push(response[i]);
						}
					}
					$scope.loaded.defenses = true;
					$scope.$emit('confrontations-defense-start', {});
				});
			}
			else {
				$scope.loaded.defenses = true;
			}
		}
	}

	// Partie:

	Partie.getPartie().success(function(response){
		$scope.partie = {
			tour_joueur: response[0].tour_joueur,
			tour_action: response[0].tour_action,
			tour_skip: response[0].tour_skip,
			tonalite: response[0].tonalite,
			temps: response[0].temps,
			dispo: response[0].dispo
		};
		$scope.loaded.partie = true;
		$scope.getAttaques();
	})

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
			duel: false
		}
	}

	// Jeu:

	$scope.jeu = {};

	$scope.jeu.de = -1;

	$scope.jeu.main = [];
	$scope.jeu.ouvertes = [];

	//Cartes 

	function getCartes(){
		Cartes.getCartes().success(function(response){
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
	    				if (carte.main.ouverte){
	    					$scope.jeu.ouvertes.push(carte);
	    				}
	    				else {
	    					$scope.jeu.main.push(carte);
	    				}
	    			}
	    			else if (carte.main.ouverte){
	    				$scope.joueurs[carte.position].ouvertes.push(carte);
	    			}
	    		}
	    	}
			$scope.loaded.cartes = true;
			$scope.getAttaques();
	    }).error(function(response){
	    	console.log("Error while trying to get cartes");
	    });
	}

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
	})


	$scope.autresJoueurs = [($scope.joueurId + 2)%3,($scope.joueurId + 1)%3];
	$scope.joueurLeft = ($scope.joueurId + 2)%3;
	$scope.joueurRight = ($scope.joueurId + 1)%3;

	// Pioches et defausses :

	$scope.pioches = {};
	$scope.pioches.pioche = [];
	
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

	// Actions disponibles

	$scope.actionsDisponibles = {};

}]);