var services = angular.module('todoService', []);

// super simple service
// each function returns a promise object 
services.factory('Todos', ['$http', function ($http) {
  return {
    get: function () {
      return $http.get('/api/todos');
    },
    report: function () {
        return $http.get('/report');
    },
    create: function (todoData) {
      return $http.put('/api/todos', todoData);
    },
    delete: function (todo) {
      return $http.delete('/api/todos/' + todo._id + "?rev=" + todo._rev);
    }
  }
	}]);


