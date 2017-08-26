'use strict';

angular.module('question').factory('Questions', ['$http','configService',
	function($http,configService) {
		return {
			// Obtenir les questions des autres joueurs :
			getQuestionsAutresJoueurs: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/question/json/questions.json'
				    });
				}
				else {
					return $http({
				        method: 'POST',
				        params: params,
				        url: 'modules/question/php/questions-autres-joueurs.php',
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}
			},
			// Obtenir les questions du joueur spécifié :
			getQuestionsJoueur: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/question/json/questions.json'
				    });
				}
				else {
					return $http({
				        method: 'POST',
				        params: params,
				        url: 'modules/question/php/questions-joueur.php',
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}
			},
			createQuestion: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/question/json/questions.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/question/php/questions-create.php',
			        	params: params,
			        	statut: {},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			},
			modifierQuestion: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/question/php/questions-modifier.php',
			        	params: params,
			        	statut: {},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			},
			repondreQuestion: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/question/php/questions-repondre.php',
			        	params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			},
			supprimerQuestion: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/question/php/questions-supprimer.php',
			        	params: {
		        			carteId: params.carteId,
		        			statut: params.statut
		        		},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			}
		}
	}
]);
