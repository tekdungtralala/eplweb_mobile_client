(function() {
	"use strict";

	angular.module('app.ranks')
		.controller('UserRegCtrl', UserRegCtrl);

	function UserRegCtrl($state, $ionicPopup, $stateParams, dataservice, userhelper) {
		var vm = this;
		vm.username = null;
		vm.userModel = null;
		vm.errorMsg = null;

		vm.presave = presave;
		activate();
		function activate() {
			var param = $stateParams.userModel;
			var str = decodeURIComponent(param);
			vm.userModel = JSON.parse(str);
		}

		function checkusername(result) {
			if (200 === result.status) {

				$ionicPopup.confirm({
					title: 'Saving Confirmation',
					template: 'Username can not be changed.<br/>Are you sure with <b>' + vm.username + '</b> as your username ?'
				}).then(popupConfirmation);

			} else {
				vm.errorMsg = "Username is not available.";
			}
		}

		function popupConfirmation(res) {
			if (res) {
				vm.userModel.username = vm.username;
				dataservice.userSignIn(vm.userModel).then(afterSignup);
			}
		}

		function afterSignup(result) {
			if (200 === result.status) {
				userhelper.saveUserLogged(result.data);
				$state.go('app.home');
			}
		}

		function presave() {
			vm.errorMsg = null;

			var username = vm.username;
			if (username) {
				if (username.length >= 5 && username.length <= 16) {
					var regex = /^[a-zA-Z0-9_]+$/;
					var isValid = regex.test(username);

					if (isValid) {
						// Need to check whatever the username exist or not
						dataservice.isUsernameAvailable(username)
							.then(checkusername);
					} else {
						vm.errorMsg = 
							"Please, use only alphabetic characters or underscore.";
					}
				} else {
					vm.errorMsg = "Username length is must between 5 - 16";
				}
			} else {
				vm.errorMsg = "Please fill the input text.";
			}
		}

	}

})();