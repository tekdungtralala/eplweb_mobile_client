(function() {
	"use strict";

	angular.module('app.matchday')
		.controller('MatchdayCtrl', MatchdayCtrl);

	function MatchdayCtrl($state, $stateParams, $ionicPlatform, $rootScope, $ionicPopup, dataservice) {
		var vm = this;
		vm.datas = [];
		vm.weeks = [];
		vm.currentWeek = null;

		vm.changeWeek = changeWeek;
		vm.gotoRating = gotoRating;
		vm.gotoVoting = gotoVoting;

		activate();
		function activate() {
			fetchPageData();
		};

		function gotoVoting(match) {
			var matchStr = JSON.stringify(match);
			if ($rootScope.loggedUser) {
				$state.go('app.voting', {match: matchStr});
			} else {
				$state.go('app.voting', {match: matchStr});
				// showUnLoggedUserWarn();
			}			
		}

		function gotoRating(match) {
			var matchStr = JSON.stringify(match);
			if ($rootScope.loggedUser) {
				$state.go('app.rating', {match: matchStr});
			} else {
				showUnLoggedUserWarn();
			}
		}

		function showUnLoggedUserWarn() {
			$ionicPopup.alert({
				title: 'Oops,,,',
				template: "Hai there, you need to login before continuing."
			});
		}

		function changeWeek(value) {
			var newValue = vm.currentWeek + value;
			if (newValue < 1) {
				newValue = 1;
			} else if (newValue > vm.weeks.length) {
				newValue = vm.weeks.length;
			}
			doChangeWeek(newValue);
		}

		function doChangeWeek(weekNumber) {
			vm.currentWeek = parseInt(weekNumber);
			dataservice.fetchMatchday(vm.currentWeek).then(processMatchData);
		}

		function processMatchData(result) {
			if (200 === result.status) {
				vm.datas = result.data.model;
				updateDatas(vm.datas);
			}
		}

		function fetchPageData() {
			dataservice.fetchPageData('matchday').then(processPageData);
		}

		function processPageData(result) {
			if (200 === result.status) {
				vm.datas = result.data.matchdayModelView.model;
				vm.weeks = result.data.weeks;
				vm.currentWeek = parseInt(result.data.matchdayModelView.week.weekNumber);

				var selectedWeek = $stateParams.week;
				updateDatas(vm.datas);
				if (selectedWeek) 
					doChangeWeek(selectedWeek);				
			}
		};
	};

	function updateDatas(datas) {
		_.every(datas, function(d) {
			_.every(d, function(m) {
				m.ratingPointStr = m.ratingPoint.toFixed(2);
				return true;
			});
			return true;
		});
	}
	
})();