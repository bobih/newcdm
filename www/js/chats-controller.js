angular.module('starter.chat-controllers', [])
.controller('ChatsCtrl', function($scope,BadgeService,$firebaseArray,$firebaseObject,$ionicTabsDelegate,$ionicScrollDelegate,$timeout,$ionicLoading,$ionicPopup) {
	
	var lastMsgDate = Number(localStorage.getItem("lastmessagedate"));
	var msgLimit;
	$scope.username = localStorage.getItem("username");
	var badgeCount = Number(localStorage.getItem("badge"));
	var ref = firebase.database().ref().child("livechat");
	var txtInput;
	var footerBar;
	var scroller;
	var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

	// Set Badge
	//$scope.badge = {total : 0 };

	$scope.$on('$ionicView.enter', function() {
      console.log('UserMessages $ionicView.enter');

       badgeCount = 0;
       BadgeService.SetCount(0);
	   
	   console.log("Set Total -> 0");
	    console.log("Get Total: ",BadgeService.GetCount());
		$scope.badge = 0;
      	$timeout(function() {
        footerBar = document.body.querySelector('#userMessagesView .bar-footer');
        scroller = document.body.querySelector('#userMessagesView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));
      }, 0);
    });

	$scope.init = function () {
		//var ref = firebase.database().ref().child("livechatdev");// new Firebase('https://classicdiscomix-2f7f9.firebaseio.com/livechatdev');
		if(lastMsgDate == 0){
			msgLimit = 25;
			//localStorage.setItem("lastmessagedate",msgLimit);
			console.log("Chatlist Kosong - Create Chatlist");
		
		var lastMessagesQuery = ref.orderByChild('lastmessagedate').limitToLast(msgLimit);
		$firebaseArray(lastMessagesQuery);
		var list = $firebaseArray(lastMessagesQuery);

    } else {
		msgLimit = 25;
    var lastMessagesQuery = ref.orderByChild('lastmessagedate').limitToLast(msgLimit);
		var list = $firebaseArray(lastMessagesQuery);
    }
		$scope.show($ionicLoading);

		list.$loaded()
		.then(function (arrdata) {
			$scope.chats = arrdata;
			$scope.hide($ionicLoading);
			
			//localStorage.setItem("badge",badgeCount);
			$timeout(function () {
            $ionicScrollDelegate.$getByHandle('userMessageScroll').scrollBottom();
            //console.log("Timeout");
          	}, 2);
		})
		.catch(function (error) {

		});
		

		
		ref.on("value", function (snapshot) {

			
			snapshot.forEach(function(messageSnapshot) {
			
				if($ionicTabsDelegate.selectedIndex() ==2){
					var data = messageSnapshot;
					//console.log("Data", messageSnapshot);
					var getMsgDate = Number(messageSnapshot.child("updateat").val());
					if(lastMsgDate === 0){
						lastMsgDate = getMsgDate;
						//console.log('Local  = 0');
					} else if(lastMsgDate < getMsgDate) {
						lastMsgDate = getMsgDate;
						//console.log('Set Local ' + msgLimit + " -> " + getMsgDate);
					} else {
						// Do Nothing
						//console.log('Local is Newer ' + msgLimit + " <- " + getMsgDate);
					}
					localStorage.setItem("lastmessagedate",lastMsgDate);
					// Reset Badge
					//localStorage.setItem("badge",0);

						 $timeout(function() {
					viewScroll.scrollBottom();
					}, 0);
				}
			})
			

		
		});

		

	};

	$scope.sendChat = function (chat) {
		//$scope.chats = $firebaseArray(ref);

		var list = $firebaseArray(ref);
			list.$add({
			user: localStorage.getItem("username"),
			message: chat.message,
			updateat: firebase.database.ServerValue.TIMESTAMP,
			date: new Date().getTime(),
		//time: new Date().getTime()
		}).then(function(ref) {
			  var id = ref.key;
			  console.log("added record with id " + id);
			  list.$indexFor(id); // returns location in the array
			});
		/*
		$scope.chats.$add({
			user: localStorage.getItem("username"),
			message: chat.message,
			updateat: Firebase.ServerValue.TIMESTAMP,
			date: new Date().getTime(),
		//time: new Date().getTime()
		});
		*/

		chat.message = '';
		
		
		 $timeout(function() {
          viewScroll.scrollBottom();
        }, 0);
		
		//$ionicScrollDelegate.scrollBottom();

	};

	$scope.show = function () {
		$ionicLoading.show({
			template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		});
	};

	$scope.hide = function () {
		$ionicLoading.hide();
	};

	$scope.doRefresh = function() {
		//var ref = new Firebase('https://classicdiscomix-2f7f9.firebaseio.com/livechatdev');
		msgLimit = msgLimit + 10;
		localStorage.setItem("lastmessagedate",msgLimit);
		console.log("Set Limit to ",msgLimit);
      	var lastMessagesQuery = ref.orderByChild('date').limitToLast(msgLimit);
     	var list = $firebaseArray(lastMessagesQuery);
     	list.$loaded()
		.then(function (arrdata) {
			$scope.chats = arrdata;
			$ionicScrollDelegate.scrollTop();
			$scope.$broadcast('scroll.refreshComplete');
			//badgeCount = 0;
			//localStorage.setItem("badge",badgeCount);
			$timeout(function () {
            	$ionicScrollDelegate.$getByHandle('userMessageScroll').scrollTop();
          	}, 2);
		})
		.catch(function (error) {

		});
	};

	$scope.showPopup = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Clear Chat',
			template: ''
		});

		confirmPopup.then(function(res) {
			if(res) {
				//console.log('You are sure');
				//var ref = new Firebase('https://classicdiscomix-2f7f9.firebaseio.com/livechatdev');
				msgLimit = 10;
				localStorage.setItem("lastmessagedate",msgLimit);
				var lastMessagesQuery = ref.orderByChild('date').limitToLast(msgLimit);
				var list = $firebaseArray(lastMessagesQuery);
				$scope.show($ionicLoading);

				list.$loaded()
				.then(function (arrdata) {
					$scope.chats = arrdata;
					$scope.hide($ionicLoading);
					badgeCount = 0;
					localStorage.setItem("badge",badgeCount);
					var lastMessagesQuery = ref.orderByChild('date').limitToLast(25);
					$timeout(function () {
		            	$ionicScrollDelegate.$getByHandle('userMessageScroll').scrollBottom();
		            //console.log("Timeout");
		          	}, 2);
				})
				.catch(function (error) {

				});


			} else {
				console.log('You are not sure');
			}
		});
	};
	
	$scope.$on('taResize', function(e, ta) {
      //console.log('taResize');
      if (!ta) return;
      
      var taHeight = ta[0].offsetHeight;
      //console.log('taHeight: ' + taHeight);
      
      if (!footerBar) return;
      
      var newFooterHeight = taHeight + 10;
      newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
      
      footerBar.style.height = newFooterHeight + 'px';
      scroller.style.bottom = (newFooterHeight + 50) +  'px'; 
    });


    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function() {
        console.log('textarea blur, focus back on it');
        txtInput[0].focus();
      });
    }

	$scope.init();
	//localStorage.setItem("badge",0);

});