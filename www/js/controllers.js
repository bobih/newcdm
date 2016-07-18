angular.module('starter.controllers', [])

.controller('LoginCtrl',function($scope,CDMSettings,$state,$ionicLoading,LoginService,$ionicPlatform,$ionicPopup,$firebaseAuth,BadgeService) {

  $scope.enablesocial = true;
  /*
  $ionicPlatform.ready(function() {
    document.addEventListener("deviceready", function() {
        if (localstorage.getItem("username") !== null ) {
            state.go("tab.dash");
        } 
      }, false);
  });
  */

  
   $scope.$on("$ionicView.beforeEnter", function (event, data) {
      if (localStorage.getItem("username")) {
        $state.go('tab.dash');
      }
    });
  
    $scope.data = {};
    $scope.options = $scope.options || {};
    $scope.options.hideBackButton = true;

    $scope.login = function () {
  
      if($scope.data.username){
         $scope.show($ionicLoading);
          LoginService.loginUser($scope.data.username, $scope.data.password)
            .success(function (data) {
              var arrInfo = {
              'uid': 1234,
              'name': $scope.data.username,
              'email': "(No Email)",
              'photo': "img/nopic.jpg"
            };
            $scope.loginInit(arrInfo);
              
              $state.go('tab.dash');
            }).error(function (data) {
              var alertPopup = $ionicPopup.alert({
                title: 'Login gagal!',
                template: ''
              });
            }).finally(function ($ionicLoading) {
              // On both cases hide the loading
              $scope.hide($ionicLoading);
            })

      } else {
        var alertPopup = $ionicPopup.alert({
              title: 'Login gagal!',
              template: ''
        });
      }
    }


    $scope.gLogin=function(){

        //console.log("Starting Google Login");
        /*

       if ((window.cordova && device.platform == 'iOS') || (window.cordova && device.platform == 'Android')) {
            facebookConnectPlugin.login(['public_profile'], function(result) {

                console.log("Facebook Result ->" + JSON.stringify(result));
                $scope.authObj = $firebaseAuth();
                
                provider = firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);
                $scope.authObj.$signInWithCredential(provider).then(function(firebaseUser) {
                    console.log("Signed in as: " + JSON.stringify(firebaseUser));
                    localStorage.setItem("badge",0);
                    localStorage.setItem("lastmessagedate",0);
                    localStorage.setItem("username",firebaseUser.user.displayName);

                    var arrInfo = {
                      'uid': firebaseUser.user.uid,
                      'name': firebaseUser.user.displayName,
                      'email': firebaseUser.user.email,
                      'photo': firebaseUser.user.photoURL
                    };
                    localStorage.setItem("userinfo",JSON.stringify(arrInfo));

                    $state.go("tab.dash");
                     console.log('Auth :', $scope.authObj);
                    // User successfully logged in
                }).catch(function(error) {
                    console.log('Error : ' + JSON.stringify(error));
                    // Login error
                });
            }, function(error) {
                console.log('Error : ' + JSON.stringify(error));
                // Login error
            });
        } else {
            $scope.authObj = $firebaseAuth();
            provider = new firebase.auth.GoogleAuthProvider();
            $scope.authObj.$signInWithPopup(provider).then(function(firebaseUser) {
                console.log("Signed in as:", firebaseUser);
                localStorage.setItem("badge",0);
                localStorage.setItem("lastmessagedate",0);
                localStorage.setItem("username",firebaseUser.user.displayName);

                var arrInfo = {
                  'uid': firebaseUser.user.uid,
                  'name': firebaseUser.user.displayName,
                  'email': firebaseUser.user.email,
                  'photo': firebaseUser.user.photoURL
                };
                localStorage.setItem("userinfo",JSON.stringify(arrInfo));

                $state.go("tab.dash");
                 console.log('Auth :', $scope.authObj);
            }).catch(function(error) {
                 console.log("Error Facebook Login", error);
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
            });
        }
        */

        
        $scope.authObj = $firebaseAuth();

        //$scope.authObj = $firebaseAuth();
        var provider = new firebase.auth.GoogleAuthProvider();
        $scope.authObj.$signInWithPopup(provider).then(function(firebaseUser) {
            //console.log("Signed in as:", firebaseUser);
            var arrInfo = {
              'uid': firebaseUser.user.uid,
              'name': firebaseUser.user.displayName,
              'email': firebaseUser.user.email,
              'photo': firebaseUser.user.photoURL
            };
           $scope.loginInit(arrInfo);

            $state.go("tab.dash");
             //console.log('Auth :', $scope.authObj);
            }).catch(function(error) {
               //console.log("Error Google Login", error);
               var alertPopup = $ionicPopup.alert({
                title: 'Login gagal!',
                template: JSON.stringify(error)
              });
            });
      }

      /** Facebook Login */
    $scope.fbLogin=function(){

      facebookConnectPlugin.login(['email'], function(response){
            //alert('Logged in');
            //alert(JSON.stringify(response.authResponse));
            // Get Detail
            facebookConnectPlugin.getLoginStatus(function(response){
            if(response.status == "connected") {
                facebookConnectPlugin.api('/' + response.authResponse.userID + '?fields=id,name,gender,picture,email',[], 
                function onSuccess(result) {
                    //alert(JSON.stringify(result));
                    console.log(JSON.stringify(result));
                    var arrInfo = {
                          'uid': result.id,
                          'name': result.name,
                          'email': result.email,
                          'photo': "https://graph.facebook.com/" + result.id + "/picture?type=large"
                        };
                        var badgeCount = Number(localStorage.getItem("badge"));
                        BadgeService.SetCount(badgeCount);

                        var enableSound = localStorage.getItem("sound")
                        if(enableSound == null){
                          //console.log("Sound Undefine");
                          enableSound = true;
                          localStorage.setItem("sound",enableSound);
                        }
                        CDMSettings.SetSound(enableSound);

                        localStorage.setItem("lastmessagedate",0);
                        localStorage.setItem("username",result.name);

                        localStorage.setItem("userinfo",JSON.stringify(arrInfo));
                        $state.go("tab.dash");

                },
                function onError(error) {
                    alert(error);
                }
                );
            }
            else {
                alert('Not logged in');
            }
        })
      }, function(error){
        alert(error);
      });

        
    

    /*  
    //console.log("Starting Facebook Login");
    $scope.authObj = $firebaseAuth();

    var provider = new firebase.auth.FacebookAuthProvider();
    $scope.authObj.$signInWithPopup(provider).then(function(firebaseUser) {
            //console.log("Signed in as:", firebaseUser);
            var arrInfo = {
              'uid': firebaseUser.user.uid,
              'name': firebaseUser.user.displayName,
              'email': firebaseUser.user.email,
              'photo': firebaseUser.user.photoURL
            };
            loginInit(arrInfo);

            $state.go("tab.dash");
             //console.log('Auth :', $scope.authObj);
            }).catch(function(error) {
               var alertPopup = $ionicPopup.alert({
                title: 'Login gagal!',
                template: JSON.stringify(error)
                });
            });

     */       
  }

    $scope.loginInit = function(arrData){

      //var arrData = [];
      //arrData = a;

      var badgeCount = Number(localStorage.getItem("badge"));
	    BadgeService.SetCount(badgeCount);

      var enableSound = localStorage.getItem("sound")
      if(enableSound == null){
        //console.log("Sound Undefine");
        enableSound = true;
        localStorage.setItem("sound",enableSound);
      }
      CDMSettings.SetSound(enableSound);

      localStorage.setItem("lastmessagedate",0);
      localStorage.setItem("username",arrData.name);

      var arrInfo = {
        'uid': arrData.uid,
        'name': arrData.name,
        'email': arrData.email,
        'photo': arrData.photo
      };
      localStorage.setItem("userinfo",JSON.stringify(arrInfo));
       $state.go("tab.dash");
      return "OK";
    }


    $scope.show = function () {
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });
    };

    $scope.hide = function () {
      $ionicLoading.hide();
    };
})

.controller('StreamCtrl', function($log,$scope,$rootScope,$interval,MediaManager,$sce) {

 
    
    
    
    $scope.dynamicTrack = {};

    /*
    $scope.tracks = [
      {
        url: 'http://202.51.28.222:8000/cdmlive.mp3',
        artist: 'CDM Deejay',
        title: 'Classic Disco Mix Live',
        art: 'img/cdm.png'
      }
    ];
    */

    
    $scope.playeroptions = {
      sources: [
                {
                    src: 'http://202.51.19.140/vod/mp4:0009009001FTD.m4a/playlist.m3u8',
                    type: 'application/x-mpegURL'
                }
      ],
      tracks: [],
      controls: true,
      preload: "auto",
      autoplay: false,
      poster: '',
      width: 220,
      height: 50,
      BigPlayButton: false,
      ControlBar:{
        LiveDisplay: true
      }
    };

    $scope.options = {
        type: 'mp3',
        image: 'img/cdm.png',
        androidhls: 'true',
        mediaid: 1232,
        height: 30,
        primary: "html5",
        width: 220,
        autostart: 'false'
   };
    $scope.file = $sce.trustAsResourceUrl("http://202.51.19.140/vod/mp4:0009009001FTD.m4a/playlist.m3u8");
    //$scope.file = $sce.trustAsResourceUrl("http://202.51.28.222:8000/cdmlive.mp3");

    
    $scope.$on('ng-jwplayer-ready', function(event, args) {

        $log.info('Player' + args.playerId + 'Ready.');
        // Get player from service
        var player = jwplayerService.myPlayer[args.playerId];
   });
   

    $scope.tracks = [
      {
        url: 'http://202.51.28.222:8000/cdmlive.mp3',
        artist: 'CDM Deejay',
        title: 'Classic Disco Mix Live',
        art: 'img/cdm.png'
      }
    ];

    $scope.stopPlayback = function () {
      MediaManager.stop();
    };
    $scope.playTrack = function (index) {
      $scope.dynamicTrack = $scope.tracks[index];

      $scope.togglePlayback = !$scope.togglePlayback;
      //console.log("Playing media", index);
    };




})


/*
.service('BadgeService', function() {
        this.BadgeCount;
});
*/



.controller('tabCtrl', function($scope,CDMSettings,$cordovaLocalNotification,$firebaseArray,BadgeService,$timeout,$ionicPlatform,$interval,$ionicTabsDelegate) {
  
  //Check TabionicTabsDelegate
  
  
ionic.Platform.ready(function() {
  var lastMsgDate = Number(localStorage.getItem("lastmessagedate"));
  var newdevice = true;
  if(lastMsgDate > 0){
    newdevice = false;
  }
  var msgLimit;
	$scope.username = localStorage.getItem("username");
	var badgeCount = Number(localStorage.getItem("badge"));
	var ref = firebase.database().ref().child("livechat");
  var sound = '';

  if(badgeCount > 0){
    BadgeService.SetCount(badgeCount);
    $scope.badge =  BadgeService.GetCount();
  }
  
  if(lastMsgDate == 0){
			msgLimit = 25;
			//localStorage.setItem("lastmessagedate",msgLimit);
			console.log("Chatlist Kosong from Tab - Create Chatlist");
		
		    var lastMessagesQuery = ref.orderByChild('lastmessagedate').limitToLast(msgLimit);
	  } else {
        var lastMessagesQuery = ref.orderByChild('lastmessagedate').startAt(lastMsgDate);
	  }

    $firebaseArray(lastMessagesQuery);
		var list = $firebaseArray(lastMessagesQuery);

		list.$loaded()
		.then(function (arrdata) {
		//	$scope.chats = arrdata;
		})
		.catch(function (error) {

		});
		

  BadgeService.SetCount(badgeCount);
  $scope.$on('update',function(){
           $scope.badge =  BadgeService.GetCount();
  });

  $scope.$on('soundSettings',function(){
      enableSound = CDMSettings.GetSound();
      if(enableSound){
        console.log("Got Broadcast Sound", enableSound);
          sound =  'file://sound.mp3';
      }
           
  });


    ref.on("value", function (snapshot) {
        //console.log("Get Data", snapshot);
        snapshot.forEach(function(messageSnapshot) {
           lastMsgDate = Number(localStorage.getItem("lastmessagedate"));
           badgeCount = Number(localStorage.getItem("badge"));
            var data = messageSnapshot;
            var getMsgDate = Number(messageSnapshot.child("updateat").val());

            if($ionicTabsDelegate.selectedIndex() ==2){
                BadgeService.SetCount(0);
                badgeCount = 0;
              }
            
            if(lastMsgDate === 0){
              lastMsgDate = getMsgDate;
            } else if(lastMsgDate < getMsgDate) {
              lastMsgDate = getMsgDate;
              
                if($ionicTabsDelegate.selectedIndex() ==2){
                    badgeCount = 0;
                    BadgeService.SetCount(0);
                } else {
                  badgeCount = badgeCount + 1;
                  BadgeService.SetCount(badgeCount);
                  var timestmp = messageSnapshot.child("updateat").val();
                  var nama = messageSnapshot.child("user").val();
                  var msg = messageSnapshot.child("message").val();

                  console.log(timestmp + " " + nama + " " + msg);

                 // var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
                  

                    if(newdevice == false){
                      $cordovaLocalNotification.schedule([{
                          id: timestmp,
                          title: "From " + nama,
                          text: msg,
                          icon: 'cdmnotif',
                          smallIcon: 'cdmnotifsmall',
                          badge: 2,
                          sound: sound
                      }]
                      ).then(function (err) {
                          console.log("The notification has been set");
                      });
                    }
                 
                  //console.log("Save Badge from Tab  ", badgeCount);
                  //console.log("Get From Service  ", BadgeService.GetCount());
                }
            } else {
               // Do Nothing
            }
          localStorage.setItem("lastmessagedate",lastMsgDate);
        })
        newdevice = false;
      })
   })
})

.controller('DashCtrl', function($scope,$ionicSlideBoxDelegate,$ImageCacheFactory) {

  var arrImage = [];
  arrImage[0] = "img/cdm.png"; 
  arrImage[1] = "img/cdm.jpg"; 
  arrImage[2] = "img/cdm2.jpg"; 
  arrImage[3] = "img/cdm3.jpg"; 
  arrImage[4] = "img/cdm4.png"; 
  arrImage[5] = "img/cdm5.jpg"; 

  $ImageCacheFactory.Cache(arrImage).then(function () {
              //console.log("New Images done loading!");
              //$scope.homeNews = res.entries;
            })
    



})



.controller('LogoutCtrl', function($scope,$state,$firebaseAuth) {

   $scope.authObj = $firebaseAuth();
    console.log("Auth : ",$scope.authObj);
    $scope.authObj.$signOut();

    /* Facebook Logout */
    facebookConnectPlugin.logout(function(response) {
            alert(JSON.stringify(response));
        });

   localStorage.removeItem("username");
   localStorage.removeItem("userinfo");
   localStorage.removeItem("lastmessagedate");
   localStorage.removeItem("badge");
    $state.go('login');
  
  
})

.controller('SettingsCtrl', function($scope,CDMSettings) {
  
  
  $scope.$on("$ionicView.beforeEnter", function(event, data){

 
  //console.log("data from service", CDMSettings.GetSound());
  
  var getSound;
    //if(CDMSettings.GetSound() == null){
      
     getSound = localStorage.getItem("sound");
      //console.log("Set From DB", getSound);
      CDMSettings.SetSound(getSound);
   // } else {
   //    getSound = CDMSettings.GetSound();
   // }
    //console.log("passing Data", getSound);
    $scope.Notification = { checked: getSound };
  
  
  })

  $scope.NotificationChange = function () {
      //console.log("CheckSound", $scope.Notification.checked);
      //Get Animation
      CDMSettings.SetSound($scope.Notification.checked);
  }

  
})

.controller('AboutCtrl', function($scope) {
  
})

.controller('AccountCtrl', function($scope,$state,$firebaseAuth) {

  $scope.userData = JSON.parse(localStorage.getItem("userinfo"));
  //$scope.authObj = $firebaseAuth();
  //console.log("UserData", $scope.userData);


$scope.logout = function(){
    //var authObj = $firebaseAuth();
    $scope.authObj = $firebaseAuth();
    //console.log("Auth : ",$scope.authObj);
    $scope.authObj.$signOut();

   localStorage.removeItem("username");
   localStorage.removeItem("userinfo");
    $state.go('login');
  };
 
 });


