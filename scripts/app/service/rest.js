app.service('RestService', ['$http', function ($http) {
    var baseURl = 'http://194.225.227.161:8096';

    var self = this;
    this.ingoing = 0;

    self.init = function (rootAddress) {
        baseURl = rootAddress;
    };

    function onerror(response) {
        loading.hide();
        self.ingoing--;
        console.log('error : ', response);
        return response;
    }

    function onsuccess(response) {
        loading.hide();
        self.ingoing--;
        return response;
    }

    function get(url, params, headers) {
        params = params || {};
        params.random = new Date().getTime();

        var req = {
            method: 'GET',
            url: url,
            headers: headers,
            params: params
        };

        self.ingoing++;
        loading.show();
        return $http(req).then(onsuccess, onerror);
    }

    function post(url, data, headers) {
        var req = {
            method: 'POST',
            url: url,
            headers: headers,
            data: data
        };

        self.ingoing++;
        loading.show();

        return $http(req).then(onsuccess, onerror);
        //return $http.post(url, data, headers).then(onsuccess, onerror);
    }

    //

    this.next = function (personId) {
        var url = baseURl + '/rest/v1/evaluation/next';
        var params = {"personId": personId};
        return get(url, params, {});
    };

    this.submit = function (userResponse) {
        let url = baseURl + '/rest/v1/evaluation/submit';
        let params = userResponse;
        return post(url, params, {});
    };

    this.search = function (keyword) {
        let url = 'http://194.225.227.161:8093' + '/rest/v1/searcher/search';
        let params = {keyword: keyword};
        return get(url, params, {});
    };

    // eval

    this.eval = function (k) {
        var url = baseURl + '/rest/v1/evaluation/admin/eval-p-at-k';
        var params = {"k": k};
        return get(url, params, {});
    }

}]);

var loading = {
    show: function () {
        $('#loading').remove();
        $('body').append('<div id="loading" class="loading"><span>در حال تبادل اطلاعات ...</span></div>');
        $('#loading').fadeIn();
    },
    hide: function () {
        $('#loading').fadeOut();
    }
};
