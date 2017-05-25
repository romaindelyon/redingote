'use strict';

angular.module('des').controller('DesContainerController', ['$scope',
	function($scope) {

		var des_size = {
			rhombo: 6,
			paysage: 12,
			echecs: 6,
			duel: 20,
			labyrinthe: 4
		};

		var des_options = {
			rhombo: [0,0,0,1,1,2],
			paysage: [2,3,4,5,5,7,7,12,16,73],
			echecs: ['Tour','Dame','Dada','Fou','Roi','Stop'],
			duel: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
			labyrinthe: [1,2,3,4]
		};

		function translateResult(de,result){
			if (de == 'rhombo'){
				$scope.partie.dispo.pioches.pioche += result;
			}
			else if (de == 'paysage'){
				$scope.partie.dispo.plateaux.paysage = 1;
			}
			else if (de == 'duel'){
				$scope.$emit('confrontations-duel-de', {result: result});
			}
		}

		$scope.lanceDe = function(de){
			var rand = Math.floor((Math.random() * des_size[de]));
			$scope.jeu.de = des_options[de][rand];
			$scope.partie.dispo.des[de] --;
			translateResult(de,des_options[de][rand]);
		}

}]);