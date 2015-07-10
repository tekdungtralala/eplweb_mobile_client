(function() {
	"use strict";

	angular.module('app.matchday')
		.controller('VotingCtrl', VotingCtrl);

	function VotingCtrl($rootScope, $state, $stateParams, $ionicHistory, $ionicPopup, dataservice) {
		var vm = this;
		vm.match = null;

		vm.vote = vote;

		vm.labels = null;
		vm.data = null;
		vm.chartOptions = {
			colours: ['#00FFFF', '#00FFFF']
		};

		activate();
		function activate() {
			vm.match =  JSON.parse($stateParams.match);
			updateData();
		}

		function showUnLoggedUserWarn() {
			$ionicPopup.alert({
				title: 'Oops,,,',
				template: "Hai there, you need to login before continuing."
			});
		}

		function updateData() {
			vm.labels = [
				vm.match.homeTeam.simpleName + ' Win', 
				'Tie', 
				vm.match.awayTeam.simpleName + ' Win'];
			var total = vm.match.votingHomeWin + vm.match.votingTie + vm.match.votingAwayWin;
			var percent = (100/total);

			vm.data = [[vm.match.votingHomeWin*percent, vm.match.votingTie*percent, vm.match.votingAwayWin*percent]];
		}

		function vote(value) {
			if (!$rootScope.loggedUser) {
				showUnLoggedUserWarn();
			} else {
				dataservice.postVoting(vm.match.id, value).then(afterPost);
			}
		}

		function afterPost(result) {
			if (result && 200 === result.status) {
				vm.match = result.data;
				updateData();
			}
		}
	}
})();