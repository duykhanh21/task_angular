'use strict';

app.factory('Task', function($resource){
  return $resource('/api/v1/tasks/:taskId',
    {taskId: '@id'}, {
      'update': {method: 'PATCH', params: '@params'}
    })
  }
);

app.controller('TasksCtrl', function($scope, $modal, $log, Task){
  $scope.tasks = Task.query();

  $scope.create = function(title, content){
    Task.save({title: title, content: content}, function(task){
      $scope.tasks.push(task);
    });
  };

  $scope.delete = function(index) {
    Task.delete({taskId: $scope.tasks[index].id}, function(){
      $scope.tasks.splice(index, 1);
    });
  };

  $scope.edit = function(task){
    var taskModal = $modal.open({
      templateUrl: "modal.html",
      size: "lg",
      controller: "ModalInstance1Ctrl",
      resolve: {
        task: function(){
          return task ;
        }
      }
    })

    taskModal.result.then(function(){
      $log.info("update successfully");
    }, function () {
    });
  }
});

app.controller("ModalInstance1Ctrl", function($scope, $modalInstance, task){
  $scope.task = task;
  $scope.update = function(title, content){
    this.task.$update({title: title, content: content});
  }

  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  };
})
