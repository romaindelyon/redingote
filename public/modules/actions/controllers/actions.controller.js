'use strict';

angular.module('actions').controller('ActionsController', ['$scope','$rootScope','$http','$timeout','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,Partie,Joueurs,Cartes,Objets,Actions,Questions) {

	$scope.action = {};

	$scope.actionSwitchTab = function(increment){
		$scope.action.tab += increment;
	}

    $scope.cancelAction = function(){
    	$scope.partie.dispo.tourDeJeu.actionEnCours = false;
    	if ($scope.actionCase !== undefined){
    		$scope.actionCase.phase = 0;
    	}
    	if ($scope.action.categorie === 'notification'){
    		Actions.delete({id: $scope.action.notification.info.id}).success(function(){
    			$scope.actions[$scope.action.categorie].splice(0,1);
    			$scope.partie.dispo.tourDeJeu[$scope.action.categorie][1] --;
    			$scope.action = {};
    		}).error(function(){
    			console.log("bug en effaçant la notif");
    		});
    	}
    	else {
    		$scope.action = {};
    	}
    	
    }

	$rootScope.$on('actions-lancer', function(event, args) {
		console.log("starting this");
		if (args.action === 'action'){
			$scope.startActionCase(args.action,$scope.joueurs[$scope.joueurId].pions[0].case);
		}
		else if (args.action === 'achat'){
			$scope.startAchats($scope.joueurs[$scope.joueurId].pions[0].case);
		}
		else if (args.action === 'question'){
			$scope.startQuestion();
		}
		else if (args.action === 'recompense' || args.action === 'notification'){
			$scope.action.categorie = args.action;
		}
	});

	$rootScope.$on('actions-add', function(event, args) {
		var action = {
			categorie: args.categorie,
			type: args.type,			
			info: args.info,
			source: $scope.joueurId,
			cible: args.cible,
			partie: $scope.partieId
		}
		console.log("starting that");
		Actions.add(action).success(function(response){
			console.log(response);
			if (response != undefined){
				action.id = response;
			}
			else {
				action.id = -1;
			}
			$scope.actions[action.categorie].push(action),
			$scope.partie.dispo.tourDeJeu[action.categorie][1] ++;
		}).error(function(){
			console.log("Erreur d'ajout d'action");
		});
	});

    // To merge to other actions cases when possible :


    $scope.startActionCase = function(categorie,numero){
		$scope.actionCase.categorie = categorie;
		$scope.actionCase.numero = $scope.joueurs[$scope.joueurId].pions[0].case;
		$scope.actionCaseDisplay = {description: true,image: false, perteCartes: false};
		$scope.actionCase.phase ++;
		console.log(numero);
		if ($scope.actionCase.phase === 1){
			if (numero === 'Hub'){
				var origine = $scope.joueurs[$scope.joueurId].pions[0].plateau;
				if (origine === 'labyrinthe'){
					$scope.actionCase.destination = 'paysage';
				}
				else if (origine === 'paysage'){
					$scope.actionCase.destination = 'labyrinthe';
				}
				$scope.actionCase.description = "Veux-tu prendre l'avion vers le plateau-" + $scope.actionCase.destination + " ?"
				$scope.bouton1 = "Oui";
				$scope.bouton2 = "Non";
			}
		}
		else if ($scope.actionCase.phase === 2){
			if (numero === 'Hub'){
				$scope.actionCase.description = "Il te faut un passeport";
				$scope.bouton1 = "OK";
				$scope.bouton2 = "Annuler";
			}
		}
		else if ($scope.actionCase.phase === 3){
			if (numero === 'Hub'){
				$scope.okButtonDisabled = true;
				$scope.valiseNonMaterialiseeIndex = 0;
				$scope.actionCaseDisplay.description = false;
				// Valise non materialisee
				$scope.valiseNonMaterialisee = $scope.partie.valiseNonMaterialisee;
				if ($scope.valiseNonMaterialisee.length === 0){
					$scope.actionCase.vnmCorrect = true;
				}
				$scope.actionCase.valiseNonMaterialisee = [];
				$scope.actionCase.description = "Bon voyage ! N'oublie pas de correctement préparer ta valise non-matérialisée."
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
			}
		}
		else if ($scope.actionCase.phase === 4){
			console.log("starting phase 4")
			if (numero === 'Hub' && $scope.actionCase.vnmCorrect){
				// Ajouter nouvel objet :
				var valiseNonMaterialisee = $scope.partie.valiseNonMaterialisee;
				valiseNonMaterialisee.push($scope.actionCase.nouvelObjet);
				Partie.ajouterObjetValise({valiseNonMaterialisee: JSON.stringify(valiseNonMaterialisee)}).success(function(){
					$scope.partie.valiseNonMaterialisee = valiseNonMaterialisee;
					// add News event for other players:
					for (var i in $scope.autresJoueurs){
						Actions.add({
			        		categorie: "notification",
			        		type: "valiseNonMaterialiseeSuccess",
			        		info: $scope.partie.valiseNonMaterialisee.length - 1,
			        		cible: $scope.autresJoueurs[i],
			        		source: $scope.joueurId,
			        		partie: $scope.partieId
		        		});
					}
				}).error(function(){
					console.log("error trying to save valise non matérialisée");
				});
				$scope.actionCase.valiseNonMaterialisee = undefined;
				$scope.actionCase.description = "Tu pioches deux cartes.";
				$scope.partie.dispo.pioches.pioche += 2;
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
			}
			else {
				// add News event for other players:
				for (var i in $scope.autresJoueurs){
					Actions.add({
		        		categorie: "notification",
		        		type: "valiseNonMaterialiseeFailure",
		        		info: $scope.actionCase.valiseNonMaterialisee.length - 1,
		        		cible: $scope.autresJoueurs[i],
		        		source: $scope.joueurId,
			        	partie: $scope.partieId
	        		});
				}
				$scope.okButtonDisabled = true;
				$rootScope.$on('cartes-jeter-full', function(event, args) {
					$scope.okButtonDisabled = false;
					$scope.actionCase.cartesDefausse = args.cartes;
				});
				$scope.actionCaseDisplay.description = false;
				$scope.actionCaseDisplay.perteCartes = true;
				$scope.actionCase.valiseNonMaterialisee = undefined;
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
				$rootScope.$on('cartes-jeter-notfull', function(event, args) {
					$scope.okButtonDisabled = true;
				});
			}
		}
		else if ($scope.actionCase.phase === 5){
			if (numero === 'Hub'){
				var startHubPhase5 = function(){
					$scope.buttonsHidden = true;
					$scope.actionCaseDisplay.description = false;
					$scope.actionCaseDisplay.image = true;
					$scope.actionCase.description = "Bon vol vers le plateau-" + $scope.actionCase.destination + " !";
					$scope.actionCase.image = "modules/plateaux/img/avion.png";
					$timeout(function(){
						$scope.actionCase.phase = 0;
						$scope.partie.dispo.tourDeJeu.actionEnCours = false;
						$scope.partie.dispo.tourDeJeu.action[0] --;
						$scope.actionsCase.action = false;
						$scope.$emit('plateaux-move-pion',{plateau: $scope.actionCase.destination,case: 'Hub'});
						if ($scope.actionCase.destination === 'labyrinthe' && $scope.plateau !== 1){
							$scope.goToPlateau(1);
						}
						else if ($scope.actionCase.destination === 'paysage' && $scope.plateau !== 0){
							$scope.goToPlateau(0);
						}
					},2000);
				}
				if ($scope.actionCase.cartesDefausse !== undefined && $scope.actionCase.cartesDefausse.length !== 0){
					$scope.$emit('jeu-main-jeter', {cartes: $scope.actionCase.cartesDefausse});
					$rootScope.$on('jeu-main-jeter-callback', function(event, args) {
						if (args.success){
							startHubPhase5();
						}
						else {
							$scope.actionCase.phase -= 2;
							$scope.startActionCase('action','Hub');
						}
					});
				}
				else {
					startHubPhase5();
				}
			}
		}
	}

	$scope.startAchats = function(numero){
		console.log('startachats');
		$scope.actionCase.categorie = 'achat';
		$scope.actionCase.numero = numero;
		$scope.actionCase.phase = 1;		
	}

	$scope.achatObjet = function(carte){
		$scope.actionCase.carte = carte;
		$scope.actionCase.phase = 2;
		if ($scope.actionCase.carte.info.paiement === 'glutis'){
			console.log($scope.joueurs[$scope.joueurId].glutis);
			if ($scope.joueurs[$scope.joueurId].glutis >= $scope.actionCase.carte.info.prix){
				$scope.actionCase.paiementPossible = true;
			}
			else {
				$scope.actionCase.paiementPossible = false;
			}
		}
		else if ($scope.actionCase.carte.info.paiement === 'echange'){
			$scope.actionCase.paiementPossible = false;
			for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
				if ($scope.jeu.horsPioche[i].code === carte.info.echange){
					$scope.actionCase.paiementPossible = true;
					$scope.actionCase.carteEchangeNom = $scope.jeu.horsPioche[i].nom
				}
			}
		}
	}

	$scope.acheterObjet = function(){
		if (!$scope.actionCase.paiementPossible){
			$scope.actionCase.phase = 1;
		}
		if ($scope.actionCase.paiementPossible){
			$scope.actionCase.phase = 3;
			Cartes.moveCartes({
	    		carteIds: [$scope.actionCase.carte.id],
	    		position: $scope.joueurId
	    	}).success(function(){
				var carte = $scope.actionCase.carte;
		        // Ajouter la carte à la main :
		        $scope.jeu.horsPioche.push(carte);
		       // Retirer la carte des achats possible :
		       console.log($scope.actionsCase.achat);
				for (var i = 0;i < $scope.actionsCase.achat.length;i ++){
					if ($scope.actionsCase.achat[i].id === carte.id){
						$scope.actionsCase.achat.splice(i,1);
					}
				}				
				$scope.partie.dispo.tourDeJeu.achat[0] --;
				console.log($scope.partie.dispo.tourDeJeu.achat);
				console.log($scope.actionsCase.achat);
				// Retirer la carte de la pioche d'objets hors pioche :
				console.log( $scope.pioches.horsPioche);
				for (var i = 0;i < $scope.pioches.horsPioche.length;i ++){
					if ($scope.pioches.horsPioche[i].id === carte.id){
						$scope.pioches.horsPioche.splice(i,1);
					}
				}
				console.log($scope.pioches.horsPioche);
				// Effectuer le paiement :
				if (carte.info.paiement === 'glutis'){
					var nouvelleFortune = $scope.joueurs[$scope.joueurId].glutis - carte.info.prix;
					Joueurs.updateGlutis({joueurId: $scope.joueurId,glutis: nouvelleFortune,partieId: $scope.partieId}).success(function(){
						$scope.joueurs[$scope.joueurId].glutis = nouvelleFortune;
					}).error(function(){
						console.log("Echec d'actualisation des glutis");
					});
					$scope.$emit('jeu-hors-pioche-change',{});
				}
				else if (carte.info.paiement === 'echange'){
					var carteId = -1;
					for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
						if ($scope.jeu.horsPioche[i].code === carte.info.echange){
							var carteEchangeIndex = i;
							Cartes.moveCartes({
					    		carteIds: [$scope.jeu.horsPioche[i].id],
					    		position: -1
					    	}).success(function(){
								var carte = $scope.jeu.horsPioche[carteEchangeIndex];
								console.log(carte);
						        // Ajouter la carte aux objets hors pioche disponible :
						        $scope.pioches.horsPioche.push(carte);
						        // Updater la liste d'achats disponibles si un pion du joueur se trouve sur une case permettant de racheter cet objet :
								for (var j = 0;j < $scope.joueurs[$scope.joueurId].pions.length;j ++){
									if (carte.info.case === $scope.joueurs[$scope.joueurId].pions[j]){
										$scope.actionsCase.achat.push(carte);
										$scope.partie.dispo.tourDeJeu.achat[0] ++;
									}
								}
								// Retirer la carte de la main :
								$scope.jeu.horsPioche.splice(carteEchangeIndex,1);
								$scope.$emit('jeu-hors-pioche-change',{});
							}).error(function(){
								console.log("L'objet d'échange n'a pas pu être transféré");
							});
					    }
					}
				}
				$timeout(function(){
					if ($scope.actionsCase.achat.length > 0){
						$scope.actionCase.phase = 1.1;
					}
					else {
						 $scope.cancelActionCase();
					}
				},2000);
	    	}).error(function(){
	    		$scope.piochesDisponibles = true;
				$timeout(function(){
					$scope.actionCase.phase = 1;
				},2000);
	    	});
		}
		// $scope.actionCase.phase = 3;
		// $scope.actionCase.resultat = 'echec';
		// if ($scope.actionCase.resultat = 'echec'){
		// 	$timeout(function(){
		// 		$scope.actionCase.phase = 1;
		// 	},2000);
		// }
	}

	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}

	$scope.startQuestion = function(){
		Questions.getQuestionsAutresJoueurs({joueurId : $scope.joueurId}).success(function (response){
			var questions = response;
			var questionIndex = Math.floor(Math.random(questions.length));
			$scope.actionCase.question = questions[questionIndex];
			console.log($scope.actionCase.question);
			$scope.actionCase.question.options.push($scope.actionCase.question.reponse);
			$scope.actionCase.question.options = shuffle($scope.actionCase.question.options);
			$scope.actionCase.phase = 1;
			$scope.actionCase.categorie = 'question';
		}).error(function(){
			console.log("Problème lors de l'obtention des questions");
		});
	}

	$scope.montrerIndice = function(){
		$scope.actionCase.indice = true;
	}

	$scope.repondreQuestion = function(){
		$scope.actionCase.phase = 2;
		$scope.partie.dispo.tourDeJeu.question[0] --;
		if ($scope.actionCase.reponse === $scope.actionCase.question.reponse){
			// Succès
			$scope.actionCase.succes = "succes";
			// Donner la récompense
			$scope.actionCase.recompenseCartes = 2;
			$scope.actionCase.recompenseGlutis = $scope.actionCase.question.options.length;
			if ($scope.actionCase.indice){
				$scope.actionCase.succes = "succes_indice";
				$scope.actionCase.recompenseCartes = 1;
				$scope.actionCase.recompenseGlutis *= 0.5;
			}
			$scope.partie.dispo.pioches.pioche += $scope.actionCase.recompenseCartes;
			var nouvelleFortune = $scope.joueurs[$scope.joueurId].glutis + $scope.actionCase.recompenseGlutis;
			Joueurs.updateGlutis({joueurId: $scope.joueurId, glutis: nouvelleFortune,partieId: $scope.partieId}).success(function(){
				$scope.joueurs[$scope.joueurId].glutis = nouvelleFortune;
			}).error(function(){
				console.log("Echec d'actualisation des glutis");
			});
		}
		else {
			$scope.actionCase.succes = "echec";
		}
		// Updater la question
		Questions.repondreQuestion({
			questionId: $scope.actionCase.question.id,
			repondant: $scope.joueurs[$scope.joueurId].nom,
			succes: $scope.actionCase.succes,
			reponseDonnee: $scope.actionCase.reponse,
			reponsePartie: $scope.partieId,
			reponseTime: new Date()
		}).success(function(){
			console.log("Réponse à la question envoyée");
		}).error(function(){
			console.log("Erreur d'envoi de réponse à la question");
		});
	}

    $scope.nouvelObjet = function(){
    	$scope.okButtonDisabled = false;
    }

    $scope.ajouteValise = function(index){
    	if ($scope.valiseNonMaterialisee.length === $scope.actionCase.valiseNonMaterialisee.length &&
    		$scope.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex] == $scope.actionCase.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex]){
    		$scope.actionCase.vnmCorrect = true;
    	}
    	else if ($scope.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex] !== $scope.actionCase.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex]) {
    		$scope.actionCase.vnmCorrect = false;
    		$scope.okButtonDisabled = false;
    	}
    	$scope.valiseNonMaterialiseeIndex ++;
    }

    $scope.startRecompense = function(){
    	console.log("starting this");
    	$scope.actionCase = {};
		$scope.actionCase.phase = 1;
		$scope.actionCase.categorie = 'recompense';
		$scope.actionCase.recompense = $scope.partie.dispo.tourDeJeu.recompenses[0];  
		console.log($scope.actionCase.recompense);
		$scope.actionCase.grandesCartes = [
			{code: 'grande_carte_marion_souris',piocheCode: 'grande_carte_pioche_marion_souris'},
			{code: 'grande_carte_piano',piocheCode: 'grande_carte_pioche_piano'},
			{code: 'grande_carte_gateaux',piocheCode: 'grande_carte_pioche_gateaux'},
			{code: 'grande_carte_freres',piocheCode: 'grande_carte_pioche_freres'},
			{code: 'grande_carte_patinage',piocheCode: 'grande_carte_pioche_patinage'},
			{code: 'grande_carte_katie',piocheCode: 'grande_carte_pioche_katie'}
		];

		for (var i = 0;i < $scope.actionCase.grandesCartes.length;i ++){
			$scope.actionCase.grandesCartes[i].quantity = 0;
			for (var j = 0;j < $scope.jeu.grandesCartes.length;j ++){
				if ($scope.jeu.grandesCartes[j].code === $scope.actionCase.grandesCartes[i].code || $scope.jeu.grandesCartes[j].code === $scope.actionCase.grandesCartes[i].piocheCode){
					$scope.actionCase.grandesCartes[i].completed = true;
				}
			}
			for (var j = 0;j < $scope.pioches.horsPioche.length;j ++){
				if ($scope.pioches.horsPioche[j].code === $scope.actionCase.grandesCartes[i].code && $scope.pioches.horsPioche[j].position == -1){
					$scope.actionCase.grandesCartes[i].quantity ++;
					$scope.actionCase.grandesCartes[i].id = $scope.pioches.horsPioche[j].id;
				}
			}
		}  	
		console.log($scope.actionCase.grandesCartes);
    }

    $scope.getGrandeCarte = function(carteId,carteIndex){
    	console.log(carteId);
    	if ($scope.actionCase.recompense.valeur > 0){
			$scope.actionCase.grandesCartes[carteIndex].completed = true;
	    	Cartes.moveCartes({
	    		carteIds: [carteId],
	    		position: -1
	    	}).success(function(){
	    		for (var j = 0;j < $scope.pioches.horsPioche.length;j ++){
	    			if ($scope.pioches.horsPioche[j].id === carteId){
	    				$scope.jeu.grandesCartes.push($scope.pioches.horsPioche[j]);
	    				$scope.pioches.horsPioche.splice(j,1);
	    			}
	    		}
	    		$scope.actionCase.recompense.valeur --;
	    		$scope.$emit('grandes-cartes-added',{});
	    		if ($scope.actionCase.recompense.valeur === 0){
	    			$timeout(function(){
	    				$scope.cancelActionCase();
	    				$scope.partie.dispo.tourDeJeu.recompense[1] --;
	    			},500);
	    		}
	    	}).error(function(){
	    		console.log("error de transfert de grande carte");
	    	});
    	}
    };

	function initializeActionCase(){
		console.log('initialization action case');
		$scope.actionCase = {
			phase: 0
		};
		var cases = {};
		$http({
	        method: 'GET', 
	        url: 'modules/plateaux/json/plateaux-paysage.json'
	    }).success(function(response){
	    	for (var i in response){
	    		for (var j in response[i].colonnes){
	    			if (cases[response[i].colonnes[j].numero] === undefined){
	    				cases[response[i].colonnes[j].numero] = response[i].colonnes[j];
	    			}
	    		}
	    	}

	    	// Potentielles actions de case
	    	console.log(cases[$scope.joueurs[$scope.joueurId].pions[0].case]);
	    	$scope.actionsCase = {
	    		achat: cases[$scope.joueurs[$scope.joueurId].pions[0].case].achat,
	    		action: cases[$scope.joueurs[$scope.joueurId].pions[0].case].action,
	    		question: cases[$scope.joueurs[$scope.joueurId].pions[0].case].question
	    	};
	    	// Only case where something happens on labyrinthe:
	    	if ($scope.joueurs[$scope.joueurId].pions[0].case === 'Hub' || $scope.joueurs[$scope.joueurId].pions[0].case === 'Hub interplanétaire'){
	    		$scope.actionsCase.action = true;
	    	}
	    	if ($scope.actionsCase.achat){
	    		var achatsDisponibles = [];
	    		for (var i = 0;i < $scope.pioches.horsPioche.length;i ++){
	    			console.log($scope.pioches.horsPioche[i]);
	    			if ($scope.pioches.horsPioche[i].categorie === 'objet' && ($scope.pioches.horsPioche[i].info.case.toString() === $scope.joueurs[$scope.joueurId].pions[0].case.toString() || $scope.joueurs[$scope.joueurId].pions[1] !== undefined && $scope.pioches.horsPioche[i].case.toString() === $scope.joueurs[$scope.joueurId].pions[1].case.toString())){
	    				achatsDisponibles.push($scope.pioches.horsPioche[i]);
	    				$scope.partie.dispo.tourDeJeu.achat[0] ++;
	    			}
	    		}
	    		$scope.actionsCase.achat = achatsDisponibles;
	    		console.log($scope.actionsCase.achat);
	    	}
	       	if ($scope.actionsCase.question){
	    		$scope.partie.dispo.tourDeJeu.question[0] ++;
	    	}
	       	if ($scope.actionsCase.action){
	    		$scope.partie.dispo.tourDeJeu.action[0] ++;
	    	}

	    });		
	}
	

	function initializeActionCase(){
		console.log('initialization action case');
		$scope.actionCase = {
			phase: 0
		};
		var cases = {};
		$http({
	        method: 'GET', 
	        url: 'modules/plateaux/json/plateaux-paysage.json'
	    }).success(function(response){
	    	for (var i in response){
	    		for (var j in response[i].colonnes){
	    			if (cases[response[i].colonnes[j].numero] === undefined){
	    				cases[response[i].colonnes[j].numero] = response[i].colonnes[j];
	    			}
	    		}
	    	}

	    	// Potentielles actions de case
	    	console.log(cases[$scope.joueurs[$scope.joueurId].pions[0].case]);
	    	$scope.actionsCase = {
	    		achat: cases[$scope.joueurs[$scope.joueurId].pions[0].case].achat,
	    		action: cases[$scope.joueurs[$scope.joueurId].pions[0].case].action,
	    		question: cases[$scope.joueurs[$scope.joueurId].pions[0].case].question
	    	};
	    	// Only case where something happens on labyrinthe:
	    	if ($scope.joueurs[$scope.joueurId].pions[0].case === 'Hub' || $scope.joueurs[$scope.joueurId].pions[0].case === 'Hub interplanétaire'){
	    		$scope.actionsCase.action = true;
	    	}
	    	if ($scope.actionsCase.achat){
	    		var achatsDisponibles = [];
	    		for (var i = 0;i < $scope.pioches.horsPioche.length;i ++){
	    			console.log($scope.pioches.horsPioche[i]);
	    			if ($scope.pioches.horsPioche[i].categorie === 'objet' && ($scope.pioches.horsPioche[i].info.case.toString() === $scope.joueurs[$scope.joueurId].pions[0].case.toString() || $scope.joueurs[$scope.joueurId].pions[1] !== undefined && $scope.pioches.horsPioche[i].case.toString() === $scope.joueurs[$scope.joueurId].pions[1].case.toString())){
	    				achatsDisponibles.push($scope.pioches.horsPioche[i]);
	    				$scope.partie.dispo.tourDeJeu.achat[0] ++;
	    			}
	    		}
	    		$scope.actionsCase.achat = achatsDisponibles;
	    		console.log($scope.actionsCase.achat);
	    	}
	       	if ($scope.actionsCase.question){
	    		$scope.partie.dispo.tourDeJeu.question[0] ++;
	    	}
	       	if ($scope.actionsCase.action){
	    		$scope.partie.dispo.tourDeJeu.action[0] ++;
	    	}

	    });		
	}

	$rootScope.$on('plateaux-action-case-start', function(event, args) {
		initializeActionCase();
	});


}]);