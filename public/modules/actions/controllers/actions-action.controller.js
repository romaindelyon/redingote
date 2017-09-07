'use strict';

angular.module('actions').controller('ActionsActionController', ['$scope','$rootScope','$http','$timeout','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,Partie,Joueurs,Cartes,Objets,Actions,Questions) {

    $scope.selectionGrandesCartes = function(index){
    	if ($scope.actionCase.grandesCartesChoisies.length < $scope.actionCase.grandesCartesAChoisir){
	    	$scope.actionCase.grandesCartesChoisies.push($scope.actionCase.grandesCartes[index].code);
	    	$scope.actionCase.grandesCartes[index].selected = $scope.actionCase.grandesCartesChoisies.length;
	    	if ($scope.actionCase.grandesCartesChoisies.length === $scope.actionCase.grandesCartesAChoisir){
	    		$scope.okButtonDisabled = false;
	    	}
	    }
    }


    $scope.startActionCase = function(categorie,numero){
		$scope.actionCase.categorie = categorie;
		$scope.actionCase.numero = $scope.joueurs[$scope.joueurId].pions[0].case;
		$scope.actionCaseDisplay = {description: true,image: false, perteCartes: false,selectionGrandesCartes: false,utiliserCarte: false};
		$scope.actionCase.phase ++;
		$scope.okButtonDisabled = false;
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
			else if (numero === 'Hub interplanétaire'){
				console.log('oiciic');
				$scope.actionCase.description = "Veux-tu prendre tenter une montée de marche ?"
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
			else if (numero === 'Hub interplanétaire'){
				$scope.actionCaseDisplay.description = false;
				$scope.okButtonDisabled = true;
				$scope.actionCase.grandesCartes = [
					{code: 'grande_carte_marion_souris',piocheCode: 'grande_carte_pioche_marion_souris'},
					{code: 'grande_carte_piano',piocheCode: 'grande_carte_pioche_piano'},
					{code: 'grande_carte_gateaux',piocheCode: 'grande_carte_pioche_gateaux'},
					{code: 'grande_carte_freres',piocheCode: 'grande_carte_pioche_freres'},
					{code: 'grande_carte_patinage',piocheCode: 'grande_carte_pioche_patinage'},
					{code: 'grande_carte_katie',piocheCode: 'grande_carte_pioche_katie'}
				];
				$scope.actionCase.grandesCartesNeeded = 6;
				for (var i = 0;i < $scope.actionCase.grandesCartes.length;i ++){
					$scope.actionCase.grandesCartes[i].quantity = 0;
					for (var j = 0;j < $scope.jeu.grandesCartes.length;j ++){
						if ($scope.jeu.grandesCartes[j].code === $scope.actionCase.grandesCartes[i].code || $scope.jeu.grandesCartes[j].code === $scope.actionCase.grandesCartes[i].piocheCode){
							$scope.actionCase.grandesCartes[i].completed = true;
							$scope.actionCase.grandesCartesNeeded --;
						}
					}
				}
				if ($scope.actionCase.grandesCartesNeeded === 0){
					var pionEscalier = $scope.joueurs[$scope.joueurId].escalier;
					var grandesCartesNecessaires = [0,1,2,2,3,3];
					if (pionEscalier === 1){
						$scope.actionCase.description = "Choisis 1 grande carte à mettre en jeu :";
					}
					else {
						$scope.actionCase.description = "Choisis "+grandesCartesNecessaires[pionEscalier]+" grandes cartes à mettre en jeu dans l'ordre :";
					}
					$scope.actionCase.grandesCartesAChoisir = grandesCartesNecessaires[pionEscalier];
					$scope.actionCase.grandesCartesChoisies = [];
					$scope.bouton1 = "OK";
				}
				else {
					if ($scope.actionCase.grandesCartesNeeded === 1){
						$scope.actionCase.description = "Il te manque 1 grande carte";
					}
					else {
						$scope.actionCase.description = "Il te manque "+$scope.actionCase.grandesCartesNeeded+" grandes cartes";
					}
				}
				$scope.actionCaseDisplay.selectionGrandesCartes = true;
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
			else if (numero === 'Hub interplanétaire'){
				$scope.actionCaseDisplay.description = false;
				$scope.actionCaseDisplay.carte = true;
				$scope.actionCaseDisplay.utiliserCarte = true;
				$scope.actionCase.carte = 'visa';
				$scope.actionCase.description = "Il te faut un visa";
				$scope.$emit('cartes-utilisation-possible',{code: $scope.actionCase.carte});
				$scope.buttonsHidden = true;
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
			else if (numero === 'Hub'){
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
				var cartesJeterFullEventListener = $rootScope.$on('cartes-jeter-full', function(event, args) {
					$scope.okButtonDisabled = false;
					$scope.actionCase.cartesDefausse = args.cartes;
				});
				$scope.$on("$destroy", cartesJeterFullEventListener);
				$scope.actionCaseDisplay.description = false;
				$scope.actionCaseDisplay.perteCartes = true;
				$scope.actionCase.valiseNonMaterialisee = undefined;
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
				var cartesJeterNotFullEventListener = $rootScope.$on('cartes-jeter-notfull', function(event, args) {
					$scope.okButtonDisabled = true;
				});
				$scope.$on("$destroy", cartesJeterNotFullEventListener);
			}
			else if ('Hub interplanétaire'){
				Cartes.moveCartes({
					carteIds: [$scope.actionCase.carteUtilisee.id],
					position: -1
				}).success(function(){
					var carte = $scope.actionCase.carteUtilisee;
					carte.statut = {};
					for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
						if ($scope.jeu.horsPioche[i].id === carte.id){
							$scope.jeu.horsPioche.splice(i,1);
						}
					}
					var action = {
						categorie: 'action',
						type: 'montee_de_marche',			
						info: {grandesCartes : $scope.actionCase.grandesCartes},
						source: $scope.joueurId,
						cible: $scope.joueurId,
						partie: $scope.partieId
					}
					Actions.add(action).success(function(response){
						action.id = response; 
						$scope.actions.action.push(action);
						$scope.partie.dispo.tourDeJeu.action[1] ++;
					}).error(function(){
						console.log('échec de lancement de montée');
					});
					$scope.buttonsHidden = true;
					$scope.actionCaseDisplay.description = false;
					$scope.actionCaseDisplay.image = true;
					$scope.actionCase.description = "Bon vol vers le plateau-escalier !";
					$scope.actionCase.image = "modules/plateaux/img/avion.png";
					$scope.okButtonDisabled = false;
					$scope.bouton2 = "";
					$timeout(function(){
						$scope.actionCase.phase = 0;
						$scope.partie.dispo.tourDeJeu.actionEnCours = false;
						$scope.partie.dispo.tourDeJeu.action[0] --;
						$scope.actionsCase.action = false;
						$scope.$emit('plateaux-move-pion',{plateau: 'escalier'});
						$scope.goToPlateau(2);
						$scope.cancelAction();
						$scope.actions.action.splice(0,1);
					},1500);
				}).error(function(){
					console.log("bug lors de l'utilsiation du visa");
					$scope.cancelAction();
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
						$scope.cancelAction();
						$scope.actions.action.splice(0,1);
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
					},1500);
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


    // Montée de marche :

    function startMonteeDeMarche(){
    	$scope.action.jeuxDisponibles = [
    		"Crânium",
    		"Elixir",
    		"Jungle Speed",
    		"Orcs et Trolls",
    		"Tarot",
    		"Trivial Pursuit"
    	];
    }

    $scope.finirMonteeDeMarche= function(){
    	console.log('on finit');
    	// Le joueur se défausse d'au moins une carte :
    	var grandesCartesParNiveau = [1,1,2,2,3];
    	if ($scope.action.info.jeux[0].vainqueur === nom){
    		grandesCartesParNiveau = [1,2,2,3,3];
    	}
    	var grandesCartesADefausser = grandesCartesParNiveau[$scope.joueurs[$scope.joueurId].escalier];
    	var grandesCartesIds = [];
    	var grandesCartesIndices = [];
    	for (var i = 0;i < $scope.action.action.info.grandesCartes.length;i ++){
    		if ($scope.action.action.info.grandesCartes[i].selected <= grandesCartesADefausser){
    			for (var j = 0;j < $scope.jeu.grandesCartes.length;j ++){
					if ($scope.jeu.grandesCartes[j].code === $scope.action.action.info.grandesCartes[i].code || $scope.jeu.grandesCartes[j].code === $scope.action.action.info.grandesCartes[i].piocheCode){
						// On retire cette carte :
						grandesCartesIds.push($scope.jeu.grandesCartes[j].id);
						grandesCartesIndices.push(j);
					}
				}
    		}
    	}
    	Cartes.moveCartes({
    		carteIds: grandesCartesIds,
    		position: -1
    	}).success(function(){
    		for (var i = 0;i < grandesCartesIndices.length;i ++){
    			$scope.jeu.grandesCartes.splice(grandesCartesIndices[i],1);
    		}
    	}).error(function(){
    		console.log('bug de retrait de grande carte');
    	});
    	// Le pion retourne dans sa maison d'humeur :
    	var maison = $scope.jeu.humeurs[0].info.maison;
    	$scope.$emit('plateaux-move-pion',{plateau: 'paysage',case: maison});
    	// Si le joueur a gagné, il monte d'une marche :
    	var nom = $scope.joueur.nom;
    	if ($scope.action.info.jeux[0].vainqueur === nom && $scope.action.info.jeux[1].vainqueur === nom){
    		console.log('gagné !');
    		$scope.action.info.succes = true;
    		$scope.$emit('plateaux-escalier-monter-case',{});
    	}
    	else {
    		console.log('perdu !');
    		$scope.action.info.succes = false;
    	}
    	// On élimine l'action :
    	Actions.delete({id: $scope.action.action.id}).success(function(){
			$scope.actions.action.splice(0,1);
    		$scope.partie.dispo.tourDeJeu.action[1] --;
    		$scope.cancelAction();
    	}).error(function(){
    		console.log("error de deletion d'action");
    	});
    }

    $scope.selectJeu = function(jeu){
    	$scope.action.info.jeux[jeu].selected = true;
    	console.log('ca marche');
    }

    $scope.action.phase = 1;
	$scope.action.action = $scope.actions.action[0]; 
	console.log($scope.action);
	if ($scope.action.action.type === 'action_case'){
		$scope.startActionCase('action',$scope.joueurs[$scope.joueurId].pions[0].case);
	}
	else if ($scope.action.action.type === 'montee_de_marche'){
		startMonteeDeMarche();
	}

}]);