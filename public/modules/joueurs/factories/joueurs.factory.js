'use strict';

angular.module('joueurs').factory('Joueurs', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the joueurs:
			getJoueurs: function(){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/php/joueurs.php',
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}
			},
			// Update pion
			movePion: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/joueurs/php/joueurs-pion-move.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}				
			}
		}
	}
]);
