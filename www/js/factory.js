angular.module('starter.factory', [])
.factory('BadgeService', function($rootScope,$q) {
    var total;// = Number(localStorage.getItem("badge"));
     return{
         GetCount: function(){
            // console.log("Total",this.total);
            return this.total;
         },
         SetCount: function(val){
            this.total = Number(val);
            localStorage.setItem("badge",val)
            $rootScope.$broadcast('update');
            return
         }

     }   
        
})
.factory('CDMSettings', function($rootScope,$q) {
    var soundEnable;// = Number(localStorage.getItem("badge"));
     return{
         GetSound: function(){
            console.log("Sound-:",this.soundEnable);
            return this.soundEnable;
         },
         SetSound: function(val){
             console.log("Set Sound:",val);
            this.soundEnable = val;
            localStorage.setItem("sound",val)
            $rootScope.$broadcast('soundSettings');
            return
         }

     }   
        
});