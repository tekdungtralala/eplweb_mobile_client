(function() {
	"use strict";
	angular
		.module("app.core")
		.factory("dataservice", Dataservice);

	function Dataservice($state, $q, $http, $rootScope, $ionicLoading, $ionicPopup, 
		userhelper) {

		var ADDRESS_URL = "localhost";
		ADDRESS_URL = "162.220.10.249";
		ADDRESS_URL = "weekendmatch.info";
		var API_URL = "http://" + ADDRESS_URL;

		var fbData = {};
		var service = {
			fetchPageData: fetchPageData,
			fetchRanks: fetchRanks,
			fetchMatchday: fetchMatchday,
			socialMediaSignin: socialMediaSignin,
			isUsernameAvailable: isUsernameAvailable,
			userSignIn: userSignIn,
			me: me
		};
		return service;

		function fetchPageData(page) {
			return submitRequest("GET", "/api/page/" + page);
		}

		function fetchRanks(weekNumber) {
			var path = "/api/ranks";
			if (weekNumber) path = path + "/" + weekNumber;
			return submitRequest("GET", path);
		}

		function fetchMatchday(weekNumber) {
			var path = "/api/matchday";
			if (weekNumber) path = path + "/" + weekNumber;
			return submitRequest("GET", path);
		}

		function generateUrl(path) {
			return API_URL + path;
		}

		function submitRequest(method, path, data) {
			var req = generateReqObj(method, path, data);
			showLoading();
			return $http(req).then(getResult).catch(getResult);
		}

		function generateReqObj(method, path, data) {
			var req = {
				method: method,
				url: generateUrl(path)
			};
			if (data) req.data = JSON.stringify(data);
			return req;
		}

		function socialMediaSignin(socialType) {
			if ('FACEBOOK' === socialType) {
				fbDoSignin();
			}
		}

		function fbDoSignin() {
			facebookConnectPlugin.login(["public_profile", "email"], 
				fbGetProfilData,fbLoginError);
		}
		function fbGetProfilData(data) {
			fbData.data1 = data;
			facebookConnectPlugin.api( "/me", [], fbGetImageData, fbLoginError);
		}
		function fbGetImageData(data) {
			fbData.data2 = data;
			facebookConnectPlugin.api( "/me?fields=picture", [], 
				fbSuccessLogin, fbSuccessLogin);
		}
		function fbSuccessLogin(data) {
			fbData.data3 = data;
			var userModel = {
				"firstName" : fbData.data2.first_name,
				"lastName" : fbData.data2.last_name,
				"type" : "FACEBOOK",
				"userNetworkID" : fbData.data2.id,
				"email" : fbData.data2.email,
				"imageUrl" : fbData.data3.picture.data.url
			};
			fbData.userModel = userModel;

			isRegisteredUser(fbData.data2.email, "FACEBOOK")
				.then(checkRegisteredUser)
				.catch(checkRegisteredUser);

		}
		function fbLoginError(error) {
			$ionicPopup.alert({
				title: 'Error code : ' + error.errorCode,
				template: error.errorMessage
			});
		}

		function isRegisteredUser(email, networkType) {
			var model = {
				networkType: networkType,
				email: email
			};
			var req = generateReqObj('POST', '/api/user/isRegisteredUser', model);
			showLoading();
			return $http(req);
		}

		function isUsernameAvailable(username) {
			var model = {username: username};
			var req = generateReqObj('POST', '/api/user/isUsernameAvailable', model);
			showLoading();
			return $http(req).then(getResult).catch(getResult);
		}

		function userSignIn(userModel) {
			var req = generateReqObj('POST', '/api/usernetwork/signin', userModel);
			showLoading();
			return $http(req).then(getResult).catch(getResult);
		}		

		function checkRegisteredUser(result) {
			hideLoading();
			if (404 === result.status) {		
				var str = JSON.stringify(fbData.userModel);
				var um = encodeURIComponent(str);
				$state.go('app.user.reg', {userModel: um});
			} else {
				userSignIn(fbData.userModel).then(afterSignin);
			}
		}

		function afterSignin(result) {
			if (result && 200 === result.status)
				userhelper.saveUserLogged(result.data);
		}

		function userSignIn(userModel) {
			return submitRequest('POST', '/api/usernetwork/signin', userModel);
		}

		function me() {
			if (userhelper.get('session')) {
				var req = userhelper.getConf(null, "GET", generateUrl("/api/usernetwork/me"));
				return $http(req).then(getResult).catch(getResult);
			} else {
				return false;
			}
		}

		// hide and show loading
		function showLoading() {
			$ionicLoading.show({
				template: '<ion-spinner icon="android"></ion-spinner>'
			});
		}
		function hideLoading() {
			$ionicLoading.hide();
		}

		function getResult(result) {
			hideLoading();
			return result;
		}

	}

})();