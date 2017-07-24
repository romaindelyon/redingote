'use strict';

angular.module('historique').factory('Historique', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the joueurs:
			logEvent: function(params){
				params.stamp = new Date(); // ajouter la date
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/historique/php/historique.php',
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
