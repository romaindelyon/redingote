'use strict';

angular.module('actions').controller('ActionsNotificationController', ['$scope','$rootScope','$http','$timeout','$filter','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,$filter,Partie,Joueurs,Cartes,Objets,Actions,Questions) {

	// CHANGEMENT D'HUMEUR :

	// On retourne la pioche puis on laisse piocher le joueur "joueurIndex"
	function retournementCartesHumeurs(joueurIndex){
		var ids = [];
		for (var i in $scope.defausses.humeurs){
			ids.push($scope.defausses.humeurs[i].id);
		}
		Cartes.moveCartes({
    		carteIds: ids,
    		position: -1
    	}).success(function(){
    		for (var i in $scope.defausses.humeurs){
    			$scope.pioches.humeurs.push($scope.defausses.humeurs[i]);
    		}
    		$scope.defausses.humeurs = [];
    		if (joueurIndex >= 0){
    			piocheCarteHumeur(joueurIndex);
    		}
    	});		
	}

	function piocheCarteHumeur(joueurIndex){
		var carteOrder = Math.floor(Math.random() * $scope.pioches.humeurs.length);
		Cartes.moveCartes({
    		carteIds: [$scope.pioches.humeurs[carteOrder].id],
    		position: joueurIndex
    	}).success(function(){
			var carte = $scope.pioches.humeurs[carteOrder];
			carte.statut.piocheDate = new Date();
			carte.statut.utilisation = carte.utilisation;
			Cartes.changementStatut({
				carteId: carte.id,
				statut: carte.statut
			}).success(function(){
				console.log("status changed");
			}).error(function(){
				console.log("error when trying to change status");
			});
			$scope.joueurs[joueurIndex].humeurs.push($scope.pioches.humeurs[carteOrder]);
	        if (joueurIndex == $scope.joueurId){
	        	$scope.jeu.humeurs.push($scope.pioches.humeurs[carteOrder]);
	        }
	        $scope.action.notification.info.joueurs[joueurIndex].humeurGagnee = $scope.pioches.humeurs[carteOrder];
	        // Retirer la carte de la pioche
			$scope.pioches.humeurs.splice(carteOrder,1);
			if (joueurIndex == 2){
				// On a terminé le changement d'humeur !
				$scope.action.notification.info.completed = true;
				for (var i = 0;i <= 2;i ++){
					console.log(i);
					var action = {
						id: $scope.action.notification.id,
						categorie: $scope.action.notification.categorie,
						type: $scope.action.notification.type,			
						info: $scope.action.notification.info,
						source: $scope.joueurId,
						cible: i,
						partie: $scope.partieId
					}
					if (i != $scope.joueurId){
						console.log('not the player');
						Actions.add(action).success(function(){
							console.log("successfully added");
						}).error(function(){
							console.log("Erreur d'ajout de notification d'humeur");
						});
					}
					else {
						console.log('the player');
						Actions.update(action).success(function(){
							$scope.action.phase = 2;
						}).error(function(){
							console.log("Erreur d'update de notification d'humeur");
						});
					}
				}
				if ($scope.pioches.humeurs.length <= 0 && $scope.defausses.humeurs.length > 0){
					retournementCartesHumeurs(-1);
				}
			}
			else {
				if ($scope.pioches.humeurs.length > 0){
					piocheCarteHumeur(joueurIndex + 1);
				}
				else {
					retournementCartesHumeurs(joueurIndex + 1);
				}					
			}
    	}).error(function(){
    		console.log("problème de sauvetage d'humeur");
    	});
	}

	function startChangementHumeurs(){
		// Procéder aux changements :
		if (!$scope.action.notification.info.completed){
			$scope.action.notification.info.joueurs = {};
			var humeursDefausse = [];
			for (var i in $scope.joueurs){
				var humeurs = [];
				if (i != $scope.joueurId){
					humeurs = $scope.joueurs[i].humeurs;
				}
		        else {
		        	humeurs = $scope.jeu.humeurs;
		        }
				
				console.log(humeurs);
				// On retire l'humeur la plus ancienne :
				humeurs = $filter('orderBy')(humeurs,['statut.piocheDate'],false);
				console.log(humeurs);
				$scope.action.notification.info.joueurs[i] = {
					humeursPerdues: [humeurs[0]]
				}
				humeursDefausse.push(humeurs[0].id);
				// Si plusieurs humeurs, on retire les deux plus anciennes :
				if (humeurs.length > 1){
					$scope.action.notification.info.joueurs[i].humeursPerdues.push(humeurs[1]);
					humeursDefausse.push(humeurs[1].id);
				}
			}
			console.log(humeursDefausse);
			Cartes.moveCartes({
	    		carteIds: humeursDefausse,
	    		position: -2
	    	}).success(function(){
				for (var i in $scope.joueurs){
					for (var j = $scope.joueurs[i].humeurs.length - 1;j >=0;j --){
						if (humeursDefausse.indexOf($scope.joueurs[i].humeurs[j].id) >= 0){
							$scope.joueurs[i].humeurs[j].statut = {};
							$scope.defausses.humeurs.push($scope.joueurs[i].humeurs[j]);
							$scope.joueurs[i].humeurs.splice(j,1);
						}
					}
				}
				for (var j = $scope.jeu.humeurs.length - 1;j >=0;j --){
					if (humeursDefausse.indexOf($scope.jeu.humeurs[j].id) >= 0){
						$scope.jeu.humeurs[j].statut = {};
						$scope.defausses.humeurs.push($scope.jeu.humeurs[j]);
						$scope.jeu.humeurs.splice(j,1);
					}
				}
				console.log($scope.defausses.humeurs);
				// On commence à ajouter des humeurs :
				if ($scope.pioches.humeurs.length > 0){
					piocheCarteHumeur(0);
				}
				else {
					retournementCartesHumeurs(0);
				}
	    	}).error(function(){
	    		console.log("problème de défausse d'humeur");
	    	});
	    }
	    else {
	    	$scope.action.phase = 2;
	    }
		// Display :
		$scope.action.tab = 0;
	}

	// Initialization :

	$scope.action.phase = 1;
	$scope.action.notification = $scope.actions.notification[0];  
	console.log($scope.action.notification);
	if ($scope.action.notification.type === 'effet_immediat'){
		$scope.action.titre = $scope.action.notification.info.nom;
		if ($scope.action.notification.info.code === 'interlude_musical'){
			startChangementHumeurs();
		}
	}

}]);