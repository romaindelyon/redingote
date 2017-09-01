'use strict';

angular.module('partie').controller('PartieGeneralController', ['$scope','$state','$stateParams','Cartes','Objets','Partie','Joueurs','Actions',
	function($scope,$state,$stateParams,Cartes,Objets,Partie,Joueurs,Actions) {

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

	// Actions : tout devra être unifié sous cette bannière

	$scope.actions = {
		action: [],
		achat: [],
		duel: [],
		notification: [],
		deplacement: [],
		question: [],
		recompense: [],
		troisFamilles: []
	};

	// Attaques:

	$scope.attaques = {
		defenses: []
	};

	$scope.defense = {};

	$scope.duel = {};

	$scope.initiateConfrontations = function(){
		if ($scope.loaded.partie && $scope.loaded.cartes && $scope.loaded.confrontationsController){
			console.log('inside');
			if ($scope.partie.tour_joueur == $scope.joueurId){
				Actions.get({joueurId: $scope.joueurId,partie: $scope.partieId}).success(function(response){
					for (var i in response){
						if (response[i].categorie == 'attaque'){
							$scope.attaques.defenses.push(response[i]);
						}
						else {
							console.log(response[i].categorie);
							$scope.actions[response[i].categorie].push(response[i]);
						}
						
					}
					$scope.loaded.defenses = true;
					$scope.$emit('confrontations-defense-start', {});
					$scope.partie.dispo.tourDeJeu.notification[1] = $scope.actions.notification.length;
				});
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
			action_de_case: false,
			tourDeJeu: {
				actionEnCours: false,
				notification: [0,$scope.actions.notification.length],
				recompense: [0,0],
				action: [0,0],
				deplacement: [0,0],
				question: [0,0],
				achat: [0,0],
				'trois-familles': [0,0],
				duel: [0,0]
			}
		}
		console.log('resetting this too');
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
			valiseNonMaterialisee: response[0].valiseNonMaterialisee,
			tourDeJeu: response[0].tourDeJeu
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
	$scope.jeu.horsPioche = [];
	$scope.jeu.grandesCartes = [];
	$scope.jeu.humeurs = [];

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
	    				if (carte.statut.ouverte && carte.categorie === 'grande_carte'){
	    					$scope.jeu.grandesCartes.push(carte);
	    				}
	    				else if (carte.statut.ouverte && carte.categorie !== 'grande_carte'){
	    					$scope.jeu.ouvertes.push(carte);
	    				}
	    				else {
	    					$scope.jeu.main.push(carte);
	    				}
	    			}
	    			else if (carte.statut.ouverte){
	    				if (carte.categorie === 'grande_carte'){
	    					for (var j = 0;j < $scope.joueurs[carte.position].grandesCartes.length;j ++){
	    						if (carte.code === $scope.joueurs[carte.position].grandesCartes[j].code || carte.code === $scope.joueurs[carte.position].grandesCartes[j].piocheCode){
	    							$scope.joueurs[carte.position].grandesCartes[j].completed = true;
	    						}
	    					}
	    				}
	    				else {
	    					$scope.joueurs[carte.position].ouvertes.push(carte);
	    				}
	    			}
	    		}
	    		// Cartes mission:
	    		else if (carte.pile == 'missions'){
	    			if (carte.position == -1) {
	    				$scope.pioches.missions.push(carte);
	    			}
	    			if (carte.position == $scope.joueurId){
	    				$scope.jeu.missions.push(carte);
	    			}
	    		}
	    		// Humeurs
	    		else if (carte.pile == 'humeurs'){
	    			if (carte.position == -1) {
	    				$scope.pioches.humeurs.push(carte);
	    			}
	    			else if (carte.position == -2) {
	    				$scope.defausses.humeurs.push(carte);
	    			}
	    			else if (carte.position == $scope.joueurId){
	    				$scope.jeu.humeurs.push(carte);
	    			}
	    			else {
	    				$scope.joueurs[carte.position].humeurs.push(carte);
	    			}
	    		}
	    		// Objets hors pioche:
	    		else if (carte.pile == 'hors_pioche'){
	    			if (carte.position == $scope.joueurId){
	    				if (carte.categorie === 'grande_carte'){
	    					console.log(carte.code);
	    					$scope.jeu.grandesCartes.push(carte);
	    				}
	    				else {
	    					$scope.jeu.horsPioche.push(carte);
	    				}
	    			}
	    			else {
	    				$scope.pioches.horsPioche.push(carte);	    
	    				if (carte.position !== -1 && carte.categorie === 'grande_carte'){
	    					for (var j = 0;j < $scope.joueurs[carte.position].grandesCartes.length;j ++){
	    						if (carte.code === $scope.joueurs[carte.position].grandesCartes[j].code || carte.code === $scope.joueurs[carte.position].grandesCartes[j].piocheCode){
	    							$scope.joueurs[carte.position].grandesCartes[j].completed = true;
	    						}
	    					}
	    				}
	    			}
	    		}
	    	}
			$scope.loaded.cartes = true;
			$scope.initiateConfrontations();
			$scope.$emit('missions-initialize',{});
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

	Joueurs.getJoueurs({partieId: $scope.partieId}).success(function(response){
		console.log(response);
		var joueur = response[$scope.joueurId]
		$scope.joueur = {
			id: joueur.id,
			nom: joueur.nom,
			diable: joueur.diable,
			belette: joueur.belette,
			notes_titre: joueur.notes_titre,
			notes: joueur.notes,
			backgroundColor: joueur.backgroundColor,
			humeurs: joueur.humeurs
		}
		$scope.joueurs[0] = response[0];
		$scope.joueurs[1] = response[1];
		$scope.joueurs[2] = response[2];
		console.log($scope.joueurs);
		for (var i in $scope.joueurs){
			$scope.joueurs[i].ouvertes = [];
			$scope.joueurs[i].humeurs = [];
			$scope.joueurs[i].grandesCartes = [
				{code: 'grande_carte_marion_souris',piocheCode: 'grande_carte_pioche_marion_souris'},
				{code: 'grande_carte_piano',piocheCode: 'grande_carte_pioche_piano'},
				{code: 'grande_carte_gateaux',piocheCode: 'grande_carte_pioche_gateaux'},
				{code: 'grande_carte_freres',piocheCode: 'grande_carte_pioche_freres'},
				{code: 'grande_carte_patinage',piocheCode: 'grande_carte_pioche_patinage'},
				{code: 'grande_carte_katie',piocheCode: 'grande_carte_pioche_katie'}
			];
		}
		getCartes();
		$scope.$emit('partie-general-joueurs-loaded');
	})


	$scope.autresJoueurs = [($scope.joueurId + 2)%3,($scope.joueurId + 1)%3];
	$scope.joueurLeft = ($scope.joueurId + 2)%3;
	$scope.joueurRight = ($scope.joueurId + 1)%3;

	// Pioches et defausses :

	$scope.pioches = {
		pioche: [],
		missions: [],
		horsPioche: [],
		humeurs: []
	};
	
	$scope.defausses = {
		pioche: [],
		humeurs: []
	};

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