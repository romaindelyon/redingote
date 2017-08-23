'use strict';

angular.module('plateaux').controller('PlateauxActionCaseController', ['$scope','$rootScope','$http','$timeout','Partie','Cartes','Objets','Confrontations',
	function($scope,$rootScope,$http,$timeout,Partie,Cartes,Objets,Confrontations) {

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
						Confrontations.add({
			        		categorie: "news",
			        		type: "valiseNonMaterialiseeSuccess",
			        		info: $scope.partie.valiseNonMaterialisee.length - 1,
			        		cible: $scope.autresJoueurs[i],
			        		source: $scope.joueurId
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
					Confrontations.add({
		        		categorie: "news",
		        		type: "valiseNonMaterialiseeFailure",
		        		info: $scope.actionCase.valiseNonMaterialisee.length - 1,
		        		cible: $scope.autresJoueurs[i],
		        		source: $scope.joueurId
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
						$scope.tourDeJeu.actionEnCours = false;
						$scope.tourDeJeu.action[0] --;
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
    		$scope.tourDeJeu.achat[0] ++;
    	}
       	if ($scope.actionsCase.question){
    		$scope.tourDeJeu.question[0] ++;
    	}
       	if ($scope.actionsCase.action){
    		$scope.tourDeJeu.action[0] ++;
    	}

    });

    $scope.cancelActionCase = function(){
    	$scope.tourDeJeu.actionEnCours = false;
    	$scope.actionCase.phase = 0;
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

	$rootScope.$on('plateaux-action-case-start', function(event, args) {
		$scope.startActionCase(args.action,$scope.joueurs[$scope.joueurId].pions[0].case);
	});

}]);