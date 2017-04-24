'use strict';

angular.module('partie').factory('Partie', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the cartes:
			getPartie: function(){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/partie/json/partie.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/partie/php/partie.php',
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			},
			changeTour: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/partie/php/partie-tour-change.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			}
		}
	}
]);
