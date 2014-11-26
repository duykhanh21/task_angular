'use strict';

app.factory('Task', function($resource){
  return $resource('/api/v1/tasks/:taskId',
    {taskId: '@id'}, {
      'update': {method: 'PATCH'}
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
    var editedTask = angular.copy(task);
    var tasks = this.tasks;
    var taskModal = $modal.open({
      templateUrl: "modal",
      size: "lg",
      controller: "taskModalCtrl",
      resolve: {
        task: function(){
          return task;
        },
        editedTask: function(){
          return editedTask;
        }
      }
    })
  }
});

app.controller("taskModalCtrl", function($scope, $modalInstance, editedTask, task){
  $scope.editedTask = editedTask;
  $scope.update = function(editedTask){
    task.$update({title: editedTask.title, content: editedTask.content}, function(){
      $modalInstance.dismiss('cancel');
    });
  }

  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  };
})
