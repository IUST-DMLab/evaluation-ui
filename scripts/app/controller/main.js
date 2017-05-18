app
    .controller('MainController', function ($scope, $http, RestService, $mdDialog) {

        let personId = 'a';

        $scope.data = {};
        $scope.search = {};
        $scope.reasons = ['تعداد جوابهای صحیح بسیار زیاد است', 'پرس و جو ابهام دارد'];
        $scope.PREFIX = 'http://194.225.227.161/mapping/html/triple.html?subject=';

        $scope.checkAll = function (status) {
            for (let item of $scope.data.searchResults) {
                if (!item.fixed)
                    item.relevant = status;
            }
        };

        $scope.next = function () {
            RestService.next(personId)
                .then(function (response) {
                    $scope.data = response.data;
                });
        };

        $scope.submit = function () {

            let reason = $scope.data.statusReason || '';
            let status = (reason.length === 0);

            let judgmentList = $scope.data.searchResults
                .map(function (item) {
                    return {
                        'answer': item.title,
                        'relevant': item.relevant
                    }
                });

            let checked = judgmentList.filter(function (item) {
                return item.relevant !== undefined;
            });

            if (status && checked.length !== judgmentList.length) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element('body'))
                        .clickOutsideToClose(true)
                        .title('توجه')
                        .textContent('لطفا وضعیت همه موارد را تعیین کنید!')
                        .ariaLabel('توجه')
                        .ok('خب')
                    //.targetEvent(ev)
                );
                return;
            }

            let data = {
                "judgmentList": judgmentList,
                "personId": personId,
                "query": {"q": $scope.data.query.q},
                "status": {
                    "ableToAnswer": status,
                    "reson": status ? '' : reason
                }
            };

            RestService.submit(data)
                .then(function (response) {
                    $scope.next();
                });
        };

        $scope.search = function () {
            RestService.search($scope.search.keyword)
                .then(function (response) {
                    $scope.search.results = response.data;
                });
        };

        $scope.add = function (entity) {
            $scope.data.searchResults.push({link: entity.link, title: entity.title, relevant: "true", fixed: true});
        };

        $scope.remove = function (item) {
            _.remove($scope.data.searchResults, item);
        };

        // on load do the followings

        $scope.next();
    });
