angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($rootScope,$scope, Posts) {

    var load = function () {
        Posts.allFromServer().success(function (data) {
            $scope.posts = data;
            $scope.like = true;
        }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Load post failed!',
                template: 'Something went wrong!'
            });
        });
    }
    
    load();

    $rootScope.$on('reload', function () {
        load();
    });
})
.controller('LikeCtrl', function ($scope, Posts) {
    $scope.posts = Posts.all();
})


.controller('SearchesCtrl', function ($scope, Pictures) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.pictures = Pictures.all();

})
.controller('ProfileCtrl', function ($rootScope,$scope, Pictures, Profile, Posts, Camera, $state) {
    $scope.profile = Profile.getProfile();
    $scope.pictures = Pictures.all();
    $scope.posts = Posts.all();
    $scope.like = true;
    $rootScope.$on('reload', function () {
        $scope.profile = Profile.getProfile();        
    });
    $scope.toggleLike = function () {
        $scope.like = $scope.like === false ? true : false;
    };
    $scope.signout = function () {
        Profile.resetProfile();
        $state.go('login');
    }
})
.controller('CameraCtrl', function ($rootScope,$scope, Camera, Pictures, Posts, Profile, $state) {
    $scope.image = null;

    $scope.data = {};

    $scope.submit = function () {
        Posts.addPostToServer(Profile.getProfile(), $scope.data.comment, $scope.image).success(function (data) {
            $scope.image = null;
            $scope.data = {};
            $rootScope.$broadcast('reload');
            $state.go('tab.home');
        }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Create failed!',
                template: 'Something went wrong!'
            });
        });       
    };

    $scope.takePicture = function (options) {
        
        var options = {
            quality: 75,
            targetWidth: 200,
            targetHeight: 200,
            destinationType:0,
            sourceType: 1
        };

        Camera.getPicture(options).then(function (imageData) {
            console.warn(imageData);
            alert(imageData);
            $scope.image = 'data:image/png;base64,' + imageData;
            console.warn($scope.image)
            Pictures.addImg($scope.image);
        }, function (err) {
            console.log(err);
        });
    };
    $scope.takePictureGallery = function (options) {

        var options = {
            quality: 75,
            targetWidth: 200,
            targetHeight: 200,
            destinationType: 0,
            sourceType: 0
        };

        Camera.getPicture(options).then(function (imageData) {
            alert(imageData);
            console.warn(imageData);
            $scope.image = 'data:image/png;base64,' + imageData;
            console.warn($scope.image)
            Pictures.addImg($scope.image);
        }, function (err) {
           console.log(err);
        });
    };

})
.controller('LoginCtrl', function ($rootScope, $scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function () {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function (data) {            
            $rootScope.$broadcast('reload');
            $state.go('tab.home');
            $scope.data = {};
        }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }

    $scope.signup = function () {
        $state.go('signup');
    }
})
.controller('SignupCtrl', function ($rootScope,$scope, SignupService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.back = function () {
        $state.go('login');
    }

    $scope.create = function () {
        SignupService.createUser($scope.data).success(function (data) {
            $rootScope.$broadcast('reload');
            $state.go('tab.home');
            $scope.data = {};
        }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Create failed!',
                template: 'Something went wrong!'
            });
        });
    }
})

