(function () {
    'use strict';

    /**
     * @name PostService
     * @description Posts service for getting the initial posts
     */
        //@ngInject
    function PostService(HomeService, ngDialog) {

        function calculate(id) {
            service.current = id;
            service.last = service.posts[service.posts.length - 1].id === service.current;
            service.first = service.posts[0].id === service.current;

            angular.forEach(service.posts, function (post, key) {
                if(post.id === service.current) {
                    service.nextPost = !service.last ? service.posts[key + 1] : service.posts[0];
                    service.prevPost = !service.first ? service.posts[key - 1] : service.posts[service.posts.length - 1];
                }
            });
        }

        function closePrevious() {
            if(ngDialog.$result.length) {
                ngDialog.close();
            }
        }


        /**
         * Public API.
         */
        var service = {};

        service.posts = HomeService.data.posts;
        service.nextPost = null;
        service.prevPost = null;
        service.current = null;
        service.last = false;
        service.first = false;

        service.next = function (id) {
            calculate(id);
            closePrevious();
            ngDialog.open({
                template: 'modules/home/post/_index.html',
                className: 'ngdialog-theme-default',
                controller: 'PostCtrl',
                data: service.nextPost
            });
        };

        service.prev = function (id) {
            calculate(id);
            closePrevious();
            ngDialog.open({
                template: 'modules/home/post/_index.html',
                className: 'ngdialog-theme-default',
                controller: 'PostCtrl',
                data: service.prevPost
            });
        };

        return service;
    }

    angular
        .module('post')
        .factory('PostService', PostService);

})();