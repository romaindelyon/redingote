'use strict';

angular.module('historique').factory('Historique', ['$http','configService',
	function($http,configService) {
		return {
			// Add event:
			add: function(params){
				var date = new Date();
				console.log(date);
				params.stamp = date; // ajouter la date
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/historique/php/historique-add.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}
			},
			get: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/historique/php/historique-get.php',
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
