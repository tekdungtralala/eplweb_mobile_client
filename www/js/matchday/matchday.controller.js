(function() {
	"use strict";

	angular.module('app.matchday')
		.controller('MatchdayCtrl', MatchdayCtrl);

	function MatchdayCtrl($ionicPlatform, dataservice) {
		var vm = this;
		vm.datas = [];
		vm.weeks = [];
		vm.currentWeek = null;

		vm.changeWeek = changeWeek;

		activate();
		function activate() {
			fetchPageData();
		};

		function changeWeek(value) {
			var newValue = vm.currentWeek + value;
			if (newValue < 1) {
				newValue = 1;
			} else if (newValue > vm.weeks.length) {
				newValue = vm.weeks.length;
			}
			vm.currentWeek = newValue;
			dataservice.fetchMatchday(vm.currentWeek).then(processMatchData);
		}

		function processMatchData(result) {
			if (200 === result.status) {
				vm.datas = result.data.model;
			}
		}

		function fetchPageData() {
			dataservice.fetchPageData('matchday').then(processPageData);
		}

		function processPageData(result) {
			if (200 === result.status) {
				vm.datas = result.data.matchdayModelView.model;
				vm.currentWeek = parseInt(result.data.matchdayModelView.week.weekNumber);
				vm.weeks = result.data.weeks;
			}
		};
	};
	
})();