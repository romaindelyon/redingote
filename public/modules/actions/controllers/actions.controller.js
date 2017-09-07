'use strict';

angular.module('actions').controller('ActionsController', ['$scope','$rootScope','$http','$timeout','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,Partie,Joueurs,Cartes,Objets,Actions,Questions) {

	console.log('initializing actionscontroller');

	$scope.action = {};

	$scope.actionSwitchTab = function(increment){
		$scope.action.tab += increment;
	}

    $scope.cancelAction = function(){
    	$scope.$emit('cartes-utilisation-reset',{});
    	$scope.partie.dispo.tourDeJeu.actionEnCours = false;
    	if ($scope.actionCase !== undefined){
    		$scope.actionCase.phase = 0;
    	}
    	if ($scope.action.categorie === 'notification' || $scope.action.categorie === 'deplacement'){
    		Actions.delete({id: $scope.action[$scope.action.categorie].id}).success(function(){
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

	var actionsLancerEventListener = $rootScope.$on('actions-lancer', function(event, args) {
		console.log("starting this");
		if (args.action === 'question'){
			$scope.startQuestion();
		}
		else if (args.action === 'recompense' || args.action === 'notification' || args.action === 'achat' || args.action === 'action'  || args.action === 'deplacement'){
			$scope.action.categorie = args.action;
		}
	});

	$scope.$on("$destroy", actionsLancerEventListener);

	var actionsAddEventListener = $rootScope.$on('actions-add', function(event, args) {
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
			$scope.partie.dispo.tourDeJeu[action.categorie][args.priority] ++;
		}).error(function(){
			console.log("Erreur d'ajout d'action");
		});
	});

	$scope.$on("$destroy", actionsAddEventListener);

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

	    	// Only case where something happens on labyrinthe:
	    	if ($scope.joueurs[$scope.joueurId].pions[0].case === 'Hub' || $scope.joueurs[$scope.joueurId].pions[0].case === 'Hub interplanétaire'){
	    		$scope.actionsCase = {action: true};
	    	}
	    	else {
		    	// Potentielles actions de case
		    	console.log(cases[$scope.joueurs[$scope.joueurId].pions[0].case]);
		    	$scope.actionsCase = {
		    		achat: cases[$scope.joueurs[$scope.joueurId].pions[0].case].achat,
		    		action: cases[$scope.joueurs[$scope.joueurId].pions[0].case].action,
		    		question: cases[$scope.joueurs[$scope.joueurId].pions[0].case].question
		    	};	    		
	    	}
	    	if ($scope.actionsCase.achat){
	    		var achatsDisponibles = [];
	    		var achatsTrouves = [];
	    		for (var i = 0;i < $scope.pioches.horsPioche.length;i ++){
	    			if ($scope.pioches.horsPioche[i].categorie === 'objet' &&
	    				($scope.pioches.horsPioche[i].info.case.toString() === $scope.joueurs[$scope.joueurId].pions[0].case.toString() || $scope.joueurs[$scope.joueurId].pions[1] !== undefined && $scope.pioches.horsPioche[i].case.toString() === $scope.joueurs[$scope.joueurId].pions[1].case.toString())){
	    				// Vérifier qu'on n'a pas déjà l'objet :
	    				console.log($scope.pioches.horsPioche[i]);
	    				var objetDejaObtenu = false;
	    				for (var j = 0;j < $scope.jeu.horsPioche.length;j ++){
	    					if ($scope.jeu.horsPioche[j].code === $scope.pioches.horsPioche[i].code){
	    						objetDejaObtenu = true;
	    					}
	    				}
	    				if (!objetDejaObtenu){
		    				// Proposer de préférence un objet qui n'appartient à personne :
		    				var previousIndex = achatsTrouves.indexOf($scope.pioches.horsPioche[i].code);
		    				if (previousIndex >= 0){
		    					if (achatsDisponibles[previousIndex].position >= 0 && $scope.pioches.horsPioche[i].position < 0){
			    					console.log("on swappe !");
			    					achatsDisponibles.splice(previousIndex,1);
			    					achatsTrouves.splice(previousIndex,1);
				    				achatsDisponibles.push($scope.pioches.horsPioche[i]);
				    				achatsTrouves.push($scope.pioches.horsPioche[i].code);		  
				    			}  					
		    				}
		    				else {
			    				achatsDisponibles.push($scope.pioches.horsPioche[i]);
			    				achatsTrouves.push($scope.pioches.horsPioche[i].code);
			    				$scope.partie.dispo.tourDeJeu.achat[0] ++;
		    				}
	    				}
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
	    		$scope.actions.action.push({type: 'action_case'});
	    	}

	    });		
	}

	var plateauxActionCaseStartEventListener = $rootScope.$on('plateaux-action-case-start', function(event, args) {
		initializeActionCase();
	});
	$scope.$on("$destroy", plateauxActionCaseStartEventListener)

	// Une carte de type REACTION vient d'être utilisée
	var cartesUtilisationEventListener = $rootScope.$on('cartes-utilisation',function(event, args){
		$scope.actionCase.carteUtilisee = args.carte;
	});
	$scope.$on("$destroy", cartesUtilisationEventListener)

}]);