'use strict';

angular.module('cartes').factory('Objets', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the objets:
			getObjets: function(){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/php/objets.php',
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}
			},
			createObjet: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-objets-create.php',
			        	params: params,
			        	statut: {},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			}
		}
	}
]);
