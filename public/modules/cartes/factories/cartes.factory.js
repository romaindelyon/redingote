'use strict';

angular.module('cartes').factory('Cartes', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the cartes:
			getCartes: function(){
				// if (configService.local){
				// 	return $http({
				//         method: 'GET', 
				//         url: 'modules/cartes/json/cartes.json'
				//     });
				// }
				// else {
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/php/cartes.php',
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				//}
			},
			createCarte: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-create.php',
			        	params: params,
			        	statut: {},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			},
			modifierCarte: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-modifier.php',
			        	params: params,
			        	statut: {},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			},
			moveCartes: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					var phpParams = "";
					phpParams += "position="+params.position;
					for (var i in params.carteIds){
						phpParams += "&carteId[]=" + params.carteIds[i];
					}
					console.log(phpParams);
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/php/cartes-move.php?'+phpParams,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			},
			changementMain: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-changement-main.php',
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
