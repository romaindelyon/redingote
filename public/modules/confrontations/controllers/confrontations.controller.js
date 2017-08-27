'use strict';

angular.module('confrontations').controller('ConfrontationsController', ['$scope','$rootScope','Cartes','Confrontations',
	function($scope,$rootScope,Cartes,Confrontations) {

	console.log('running confrontations controller');

	// *** STARTING FUNCTIONS ***

	function startCartePerte(valeur){
		$scope.confrontation.display.cartes_perte = true;
		var cartesJetables = 0;
		for (var i in $scope.jeu.main){
			if (!$scope.jeu.main[i].injetable){
				cartesJetables ++;
			}
		}
		$scope.confrontation.cartes.total = Math.min(cartesJetables,valeur);
		if ($scope.confrontation.cartes.total == 0){
			$scope.confrontation.ready = true;
		}
		for (var i = 0; i < $scope.confrontation.cartes.total; i ++){
			$scope.confrontation.cartes.liste.push({});
		}
		$scope.partie.dispo.cartes.main_jeter_attaque = true;
	}

	// Start function

	function startConfrontation(categorie,type,info,carteIndex,source,cible,id) {
		console.log($scope.partie);
		$scope.partie.dispo.tourDeJeu.actionEnCours = true;
		// build confrontation object:
		$scope.confrontation.active = true;
		$scope.confrontation.id = id;
		$scope.confrontation.categorie = categorie;
		$scope.confrontation.type = type;
		$scope.confrontation.info = info;
		$scope.confrontation.carteIndex = carteIndex;
		$scope.confrontation.source = source;
		$scope.confrontation.cible = cible;
		$scope.confrontation.ready = false;
		$scope.confrontation.display = {};
		$scope.confrontation.cartes = {
			liste: [],
			filled: 0,
			total: 0
		};

		// fill confrontation content:
		var description = "";
		var titre = "";
		if (type == 'action'){
			var consequence = $scope.cartes[info].info.consequences[0];
			var action = $scope.cartes[info].info.action.type;
			$scope.confrontation.code = $scope.cartes[info].code;
			console.log(action);
			console.log(consequence);
		}

		if (categorie === 'attaque' && type === 'action'){
			$scope.confrontation.ready = true;
			$scope.confrontation.display.carte_image = true;
			$scope.confrontation.display.joueur_selection = true;
			$scope.confrontation.display.description = true;
			$scope.confrontation.display.description_type = 'cible_left';
			console.log(consequence);
			// titre:
			titre = "Action : " + $scope.cartes[info].nom;
			// description:
			if (action === "immediat" && consequence.categorie === 'carte' && consequence.type === 'defausse'){
				description = " perd " + consequence.valeur + " cartes !";
			}
			else if (action === "immediat" && consequence.categorie === 'tour' && consequence.type === 'passer'){
				description = " passe " + consequence.valeur + " tour !";
			}
			else if (action === "test" && consequence.categorie === 'carte' && consequence.type === 'vol'){
				description = " risque de perdre " + consequence.valeur + " cartes !";
			}
		}

		else if (categorie == 'attaque' && type == 'duel'){
			titre = "Lancer un duel";
			$scope.confrontation.display.joueur_selection = true;
			$scope.confrontation.display.duel_results = true;
			$scope.partie.dispo.des.duel = 3;
		}

		else if (categorie === 'defense'){
			if (type === 'action'){
				titre = $scope.joueurs[source].nom + " t'attaque !";
				if (action === "immediat" && consequence.categorie === 'carte' && consequence.type === 'defausse'){
					$scope.confrontation.display.carte_image = true;
					startCartePerte(consequence.valeur);
					if (consequence.valeur == 1){
						$scope.confrontation.description = "Choisis " + consequence.valeur + " carte à défausser :";
					}
					else {
						$scope.confrontation.description = "Choisis " + consequence.valeur + " cartes à défausser :";
					}
				}
				else if (action === "test" && consequence.categorie === 'carte' && consequence.type === 'vol'){
					$scope.confrontation.display.test = true;
					$scope.confrontation.ready = true;
					$scope.confrontation.test = {
						values: {},
						correct: false
					};
					description = "Quelle heure est-il ?";
				}
				else if (action === "immediat" && consequence.categorie === 'tour' && consequence.type === 'passer'){
					$scope.confrontation.display.carte_image = true;
					$scope.confrontation.display.description = true;
					$scope.confrontation.display.description_type = 'text_only';
					$scope.confrontation.ready = true;
					if (consequence.valeur == 1){
						description = "Tu passes " + consequence.valeur + " tour";
					}
					else {
						description = "Tu passes " + consequence.valeur + " tour";
					}
				}
			}
			else if (type == 'duel'){
				titre = "Duel lancé par " + $scope.joueurs[$scope.confrontation.source].nom;
				$scope.confrontation.display.duel_results = true;
				$scope.confrontation.display.joueur_images = true;
				$scope.confrontation.info.results_cible = [];
				$scope.confrontation.info.result_cible = 0;
				$scope.partie.dispo.des.duel = 3;
			}
		}

		else if (categorie === 'combat'){
			$scope.confrontation.code = $scope.cartes[info].code;
			titre = $scope.cartes[info].nom;
			$scope.confrontation.display.carte_image = true;
			$scope.confrontation.display.joueur_selection = true;
			$scope.confrontation.display.joueur_selection_type = 'all';
		}

		$scope.confrontation.titre = titre;
		$scope.confrontation.description = description;
	}

	// Event listeners from other controllers:

	// Start attaque action
	$rootScope.$on('confrontations-attaque-action-start', function(event, args) {
		startConfrontation('attaque','action',args.carte.id,args.carteIndex,$scope.joueurId);
	});

	// Start defense
	function startDefense(){
		if($scope.attaques.defenses.length > 0 && $scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
			console.log($scope.attaques.defenses);
			$scope.attaques.defenses[0];
			startConfrontation('defense',
				$scope.attaques.defenses[0].type,
				$scope.attaques.defenses[0].info,
				-1,
				$scope.attaques.defenses[0].source,
				$scope.attaques.defenses[0].cible,
				$scope.attaques.defenses[0].id);
			$scope.attaques.defenses.splice(0,1);
		}
	}
	$rootScope.$on('confrontations-defense-start', function(event, args) {
		startDefense();
	});

	$rootScope.$on('confrontations-combat-start', function(event, args) {
		startConfrontation('combat','combat',args.carte.id,args.carteIndex,$scope.joueurId);
	});

	// Start attaque duel:
	$rootScope.$on('confrontations-attaque-duel-start', function(event, args) {
		console.log('receiving');
		if($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 5){
			var duel = {
				results_source: [],
				result_source: 0,
				bonus_source: 0,
				modulo: 18
			};
			console.log('here');
			startConfrontation('attaque','duel',duel,-1,$scope.joueurId);			
		}
	});

	// *** GENERAL USE FUNCTIONS ***

	$scope.selectCible = function(id){
		$scope.confrontation.cible = id;
		if ($scope.confrontation.categorie == 'attaque' && $scope.confrontation.type == 'duel'){
			$scope.confrontation.titre = "Lancer un duel sur " + $scope.joueurs[id].nom;
			if ($scope.confrontation.info.results_source.length == 3){
				$scope.confrontation.ready = true;
			}
		}
	}

	function jeterCarte(carte){
		var carteJetee = false;
		for (var i in $scope.confrontation.cartes.liste){
			if ($scope.confrontation.cartes.liste[i].id == carte.id){
				carteJetee = true;
			}
		}
		if (!carteJetee){
			var foundSpot = false;
			var i = 0;
			var cartesAJeter = $scope.confrontation.cartes.liste.length;
			while (i < cartesAJeter && !foundSpot){
				if (!$scope.confrontation.cartes.liste[i].filled){
					$scope.confrontation.cartes.liste[i] = carte;
					$scope.confrontation.cartes.liste[i].filled = true;
					foundSpot = true;
					$scope.confrontation.cartes.filled ++;
				}
				// On a tout rempli:
				if ($scope.confrontation.cartes.filled == $scope.confrontation.cartes.total){
					$scope.confrontation.ready = true;
				}
				i ++;
			}
		}
	}
	$scope.removeCarte = function(index){
		$scope.confrontation.cartes.liste[index] = {};
		$scope.confrontation.cartes.filled --;
		$scope.confrontation.ready = false;
	}
	$rootScope.$on('confrontations-defense-jeter-carte', function(event, args) {
		var carte = $scope.jeu.main[args.index];
		jeterCarte(carte);
	});

	function updateResult(){
		if ($scope.confrontation.categorie == 'attaque'){
			var result = 0;
			for (var i in $scope.confrontation.info.results_source){
				result += $scope.confrontation.info.results_source[i];
			}
			$scope.confrontation.info.result_source = result % $scope.confrontation.info.modulo;
			console.log($scope.confrontation.info.result_source);
		}
		else {
			var result = 0;
			for (var i in $scope.confrontation.info.results_cible){
				result += $scope.confrontation.info.results_cible[i];
			}
			$scope.confrontation.info.result_cible = result % $scope.confrontation.info.modulo;
			console.log($scope.confrontation.info.result_cible);			
		}
	}

	function lanceDeDuel(result){
		console.log($scope.confrontation.categorie);
		if ($scope.confrontation.categorie == 'attaque'){
			if ($scope.confrontation.info.results_source.length < 3){
				$scope.confrontation.info.results_source.push(result);
				updateResult();
				if ($scope.confrontation.info.results_source.length == 3 && $scope.confrontation.cible >= 0){
					$scope.confrontation.ready = true;
				}
			}
		}
		else {
			if ($scope.confrontation.info.results_cible.length < 3){
				$scope.confrontation.info.results_cible.push(result);
				updateResult();
				if ($scope.confrontation.info.results_cible.length == 3){
					$scope.confrontation.ready = true;
				}
			}
		}
	}
	$rootScope.$on('confrontations-duel-de', function(event, args) {
		lanceDeDuel(args.result);
	});


	// *** FINAL FUNCTIONS ***

	$scope.cancelConfrontation = function(){
		$scope.confrontation.active = false;
		$scope.confrontation.cible = -1;
		$scope.confrontation.info = -1;
		$scope.confrontation.display = {};
		$scope.partie.dispo.tourDeJeu.actionEnCours = false;
		$scope.partie.dispo.des.duel = 0;
	}
	$rootScope.$on('confrontations-attaque-duel-cancel', function(event, args) {
		$scope.cancelConfrontation();
	});

	$scope.toursToSkip = 0;

	function deplacerCartes(newPosition){
		for (var i in $scope.confrontation.cartes.liste){
			if ($scope.confrontation.cartes.liste[i].filled){
				var result = function(id){
					console.log(id);
					Cartes.moveCartes({
			    		carteIds: [id],
			    		position: newPosition
			    	}).success(function(){
			    		console.log(id);
						var index = -1;
						var j = 0;
						while (index < 0 && j < $scope.jeu.main.length){
							if ($scope.jeu.main[j].id == id){
								index = j;
							}
							j ++;
						}
						console.log(index);
			    		var carte = $scope.jeu.main[index];
			    		carte.statut = {};
			    		delete carte.filled;
						$scope.defausses.pioche.push(carte);
						$scope.jeu.main.splice(index,1);
						$scope.focusIndex = -2;
			    	}).error(function(){

			    	})
			    }($scope.confrontation.cartes.liste[i].id);
			}
		}
	}

	$scope.lanceConfrontation = function(){
		var confrontation = $scope.confrontation;
		if (confrontation.categorie == 'attaque' && confrontation.type == 'action'){
			// retirer la carte de la main:
			Cartes.moveCartes({
	    		carteIds: [confrontation.info],
	    		position: -2
	        }).success(function(){
	        	console.log($scope.confrontation);
	        	// send attaque !
	        	Confrontations.add({
	        		categorie: confrontation.categorie,
	        		type: confrontation.type,
	        		info: confrontation.info,
	        		cible: confrontation.cible,
	        		source: confrontation.source
	        	});
	    		$scope.defausses.pioche.push($scope.cartes[confrontation.info]);
	    		$scope.cancelConfrontation();
	    		console.log($scope.confrontation.carteIndex);
				$scope.jeu.main.splice($scope.confrontation.carteIndex,1);
	    	}).error(function(){

	    	})
		}
		else if (confrontation.categorie == 'attaque' && confrontation.type == 'duel'){
	    	Confrontations.add({
	    		categorie: 'attaque',
	    		type: 'duel',
	    		info: $scope.confrontation.info,
	    		cible: $scope.confrontation.cible,
	    		source: $scope.joueurId
	    	}).success(function(){
	    		$scope.partie.dispo.duel = false;
	    		$scope.partie.dispo.tourDeJeu.duel[0] --;
	    		$scope.cancelConfrontation();
	    	}).error(function(){
	    		console.log('Sending duel did not work');
	    	})
		}
		else if (confrontation.categorie == 'defense'){
			var defenseFinished = false; // is it the last step of this defense activity?
			if (confrontation.type == 'action'){
				var consequence = $scope.cartes[confrontation.info].info.consequences[0];
				var action = $scope.cartes[confrontation.info].info.action.type;
				if (action == 'immediat' && consequence.categorie === 'tour' && consequence.type === 'passer'){
					$scope.toursToSkip ++;
					defenseFinished = true;
				}
				else if (action == 'immediat' && consequence.categorie === 'carte' && consequence.type === 'defausse'){
					deplacerCartes(-2);
					defenseFinished = true;
				}
				else if (action === "test" && consequence.categorie === 'carte' && consequence.type === 'vol'){
					if ($scope.confrontation.test.completed){
						defenseFinished = true;
					}
					else {
						if ($scope.cartes[confrontation.info].code == "quelle_heure_est_il"){
							if ($scope.confrontation.test.values.hours == "19" && $scope.confrontation.test.values.minutes == "42"){
								$scope.confrontation.test.correct = true;
								$scope.confrontation.description = "Bonne réponse !";
							}
							else {
								$scope.confrontation.test.correct = false;
								$scope.confrontation.description = "Mauvaise réponse. " + $scope.joueurs[$scope.confrontation.source].nom + " te chipera une carte à son tour.";
							}
						}
						$scope.confrontation.display.carte_image = true;
						$scope.confrontation.display.description = true;
						$scope.confrontation.display.test = false;
						$scope.confrontation.display.description_type = 'text_only';
						$scope.confrontation.test.completed = true;
					}
				}
			}
			else if (confrontation.type == 'duel'){
				if (confrontation.info.completed){
					deplacerCartes(confrontation.source);
					defenseFinished = true;
				}
				else {
					if (confrontation.info.result_cible > confrontation.info.result_source){
						$scope.confrontation.display.description = true;
						$scope.confrontation.display.description_type = 'text_only';
						$scope.confrontation.description = "Tu as gagné ! " + $scope.joueurs[confrontation.source].nom + " te donnera 2 cartes";
					}
					else if (confrontation.info.result_cible < confrontation.info.result_source){
						$scope.confrontation.ready = false;
						startCartePerte(2);
						$scope.confrontation.description = "Tu as perdu. Choisis 2 cartes à donner à " + $scope.joueurs[$scope.confrontation.source].nom + " :";
					}
					else {
						$scope.confrontation.ready = false;
						startCartePerte(1);
						$scope.confrontation.description = "Egalité. Choisis 1 carte à donner à " + $scope.joueurs[$scope.confrontation.source].nom + " :";
					}
					$scope.confrontation.display.duel_results = false;
					$scope.confrontation.info.completed = true;
				}
			}
			// Si la defense en question est bien finie:
			if (defenseFinished){
				// On la vire:
				Confrontations.delete({id: $scope.confrontation.id});
				$scope.confrontation.active = false;
				$scope.partie.dispo.tourDeJeu.actionEnCours = false;
				console.log("on pass là");
				// On enchaine avec les eventuelles defenses suivantes:
				if ($scope.attaques.defenses.length > 0){
					startDefense();
				}
				// On skippe les tours eventuellement:
				else {
					if ($scope.toursToSkip > 0){
						console.log($scope.toursToSkip);
						$scope.$emit('partie-tours-move', {numberTours: 7,toursToSkip: $scope.toursToSkip - 1});
					}
				}
			}
		}
		var carte = $scope.confrontation.info;
	}

	// Controller loaded:
	$scope.loaded.confrontationsController = true;
	$scope.initiateConfrontations()

}]);