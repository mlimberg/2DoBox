const assert = require('assert');
var Task  = require('../lib/newTask');

describe('New task', function() {
  context('with default attributes', function() {
    var task = new NewTask('task title', 'task description');

    it('should be a function', function() {
      assert.isFunction(NewTask);
    });

  });

});
