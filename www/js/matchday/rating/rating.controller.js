(function() {
	"use strict";

	angular.module('app.matchday')
		.controller('RatingCtrl', RatingCtrl);

	function RatingCtrl($state, $stateParams, $ionicHistory, dataservice) {
		var vm = this;
		vm.match = null;
		vm.stars = [false, false, false, false, false];

		vm.selectStar = selectStar;

		activate();
		function activate() {
			vm.match =  JSON.parse($stateParams.match);
			var maxFullStar = parseInt(vm.match.ratingPoint);
			for(var i = 0; i < maxFullStar; i++) {
				vm.stars[i] = true;
			}
		}

		function selectStar(index) {
			vm.stars = [false, false, false, false, false];
			for(var i = 0; i < index; i++) {
				vm.stars[i] = true;
			}
			dataservice.postRating(vm.match.id, i).then(afterPost);
		}

		function afterPost(result) {
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go("app.matchday", {week: vm.match.week.weekNumber});
		}
	}
})();