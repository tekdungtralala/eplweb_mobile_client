(function() {
	"use strict";
	angular
		.module("app.core")
		.factory("dataservice", Dataservice);

	function Dataservice($q, $http, $rootScope) {
		var ADDRESS_URL = "localhost";
		ADDRESS_URL = "162.220.10.249";
		var API_URL = "http://" + ADDRESS_URL + ":8080/eplweb";

		var service = {
			fetchPageData: fetchPageData,
			fetchRanks: fetchRanks,
			fetchMatchday: fetchMatchday
		};
		return service;

		function fetchPageData(page) {
			return fetchData("GET", "/api/page/" + page);
		}

		function fetchRanks(weekNumber) {
			var path = "/api/ranks";
			if (weekNumber) path = path + "/" + weekNumber;
			return fetchData("GET", path);
		}

		function fetchMatchday(weekNumber) {
			var path = "/api/matchday";
			if (weekNumber) path = path + "/" + weekNumber;
			return fetchData("GET", path);
		}

		function fetchData(method, path) {
			var req = {
				method: method,
				url: API_URL + path
			};
			return $http(req).then(getResult);
		}


		function getResult(result) {
			return result;
		}

	}

})();