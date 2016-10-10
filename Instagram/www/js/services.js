angular.module('starter.services', [])

.factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    return {
        all: function () {
            return chats;
        },
        remove: function (chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function (chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})
.factory('Profile', function () {
    var Profile = {
        name: 'Brandon Nguyen',
        face: 'img/profile.jpg',
    }

    var length = 0;

    return {
        getProfile: function () {
            return Profile;
        },
        setProfile: function (profile) {
            Profile = profile;
        },
        resetProfile: function () {
            Profile = {};
        },
        addLength: function () {
            length += 1;
        },
        getLength: function () {
            return length;
        }
    }
})
.factory('Posts', function ($q, $http) {

    

    var posts = [{
       
        name: 'Ben Sparrow',
        comment: 'Check this out',
        face: 'img/ben.png',
        pic: 'img/wall1.jpg'
    }, {
       
        name: 'Max Lynx',
        comment: 'Some cool shit',
        face: 'img/max.png',
        pic: 'img/wall2.jpg'
    }, {
        
        name: 'Adam Bradleyson',
        comment: 'Nice road',
        face: 'img/adam.jpg',
        pic: 'img/wall3.jpg'
    }, {
        name: 'Perry Governor',
        comment: 'WOW!',
        face: 'img/perry.png',
        pic: 'img/wall4.jpg'
    }];
    return {
        all: function () {
            return posts;
        },
        allFromServer() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var link = 'http://khuongstagram.herokuapp.com/posts/';

            $http.get(link, {}).then(function (res) {
                if (res.data == false) {
                    deferred.reject('Something went wrong.');
                }
                else {
                    posts = res.data;
                    deferred.resolve(posts);
                }
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        },
        addPost: function (profile, comment,image) {
            posts.unshift({
             
                name: profile.name,
                comment: comment,
                face: profile.face,
                pic: image
            });
        },
        addPostToServer: function (profile, comment, image) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var link = 'http://khuongstagram.herokuapp.com/posts/create';

            $http.post(link, { post_user_id: profile.id, caption: comment,image:imgae }).then(function (res) {
                if (res.data == false) {
                    deferred.reject('Something went wrong.');
                }
                else {                    
                    deferred.resolve('Welcome ' + name + '!');
                }
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        },
    };
})
.factory('Pictures', function () {
    var pictures = ['img/pic1.jpg', 'img/pic2.jpg', 'img/pic3.jpg', 'img/pic4.jpg', 'img/pic5.jpg', 'img/pic6.png', 'img/pic7.jpg', 'img/pic8.jpg', 'img/pic9.jpg'];
    return {
        all: function () {
            return pictures;
        },
        addImg: function (image) {
            pictures.unshift(image);
        }
    };
})
.factory('Camera', function ($q) {

    return {
        getPicture: function (options) {
            var q = $q.defer();

            navigator.camera.getPicture(function (result) {
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        }
    }

})
.service('LoginService', function ($q, $http, Profile) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var link = 'http://khuongstagram.herokuapp.com/users/login';

            $http.post(link, { username: name, password: pw }).then(function (res) {                
                if (res.data == false)
                {
                    deferred.reject('Wrong credentials.');
                }
                else
                {
                    Profile.setProfile(res.data);
                    console.warn(res.data);
                    deferred.resolve('Welcome ' + name + '!');
                }
            });
    
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        }
    }
})
.service('SignupService', function ($q, $http,Profile) {
    return {
        createUser: function (user) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var link = 'http://khuongstagram.herokuapp.com/users/create';

            $http.post(link, { username: user.username, password: user.password, firstname: user.firstname, lastname: user.lastname }).then(function (res) {
                
                if (res.data == false) {
                    deferred.reject('Wrong credentials.');
                }
                else {
                    var link = 'http://khuongstagram.herokuapp.com/users/' + user.username;                    
                    $http.get(link).then(function (res) {                        
                        if (res.data.length == 0) {
                            deferred.reject('Something went wrong.');
                        }
                        else {
                            Profile.setProfile(res.data[0]);
                            deferred.resolve('Welcome ' + name + '!');
                        }
                    });
                }
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        }
    }
});