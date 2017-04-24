angular.module('cartes').service('cartesQuestionsPioche',
	['$mdDialog',
	function($mdDialog) {

	var questionsPiocheFunctions = {};

	questionsPiocheFunctions.pioche = function(){
		var poseur = Math.floor(Math.random() * 3);
		var poseurNoms = ['Julia','Marie','Romain'];
		var poseurTextes = [
			"J'espère que tu connais les lois américaines stupides !",
			"Easy !",
			"J'espère que tu es très cultivé !"
		];
		var piocheQuestionPopup = $mdDialog.confirm({
        	templateUrl: 'modules/cartes/views/cartes-questions-pioche-popup.view.html',
        	clickOutsideToClose: true,
		    controller: function($scope,$mdDialog){
	        	$scope.poseur = poseurNoms[poseur];
	        	$scope.texte = poseurTextes[poseur];
	            $scope.popupConfirm = function(){
	            	$mdDialog.hide();
	            }
            }
        });
		$mdDialog.show(piocheQuestionPopup).then(function(){

		});
	}

	return(questionsPiocheFunctions);
}]);