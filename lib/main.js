/*jshint esversion: 6 */
const qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical'];

// getAndDisplayTasks = () => {
//   let taskFields = $('#title-input, #body-input');
//   $('.task-box').remove();
//   for (var i = 0; i < localStorage.length; i++) {
//     var task = JSON.parse(localStorage.getItem(localStorage.key(i)));
//     displayOnPage(task);
//   }
// };

displayOnPage = currentTask => {
  $('.task-list').prepend(
    `<article id=${currentTask.uniqueid} class="task-box">
    <div class="search-field">
    <div class="task-box-header">
    <h2 class="task-title" contentEditable="true">${currentTask.titleText}</h2>
    <p class="delete-task"></p>
    </div>
    <textarea class="task-body" contentEditable="true" maxlength="125">${currentTask.bodyText}</textarea>
    </div>
    <div class="task-box-footer">
    <p class="upvote"></p>
    <p class="downvote"></p>
    <div class="task-ranking-quality">quality:</div>
    <div class="task-ranking">${currentTask.quality}</div>
    <button id="completed-task">Completed Task</button>
    </div>
    </article>`);
  };

getAndDisplayTasks = () => {
  $('.task-box').remove();
  for (i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(task.completed === false) {
      displayOnPage(task);
    }
  }
};

  getAndDisplayTasks();

  $('#save-button').on('click', () => {
    displayAndStoreTask();
  });

  class NewTaskConstructor {
    constructor(titleText, bodyText, quality, uniqueid) {
      this.titleText = titleText;
      this.bodyText = bodyText;
      this.quality =  quality || 'Normal';
      this.uniqueid = uniqueid || Date.now();
      this.completed = false;
    }
  }

  addNewTaskBox = () => {
    let titleField = $('#title-input');
    let bodyField = $('#body-input');
    let currentTask = new NewTaskConstructor(titleField.val(), bodyField.val());
    displayOnPage(currentTask);
    storeNewObject(currentTask);
  };


  clearInputFields = () => {
    let titleField = $('#title-input');
    let bodyField = $('#body-input');
    return titleField.val("") && bodyField.val("") && $('#search-input').val("");
  };

  disableSaveButton = () => {
    $('#save-button').prop('disabled', true);
  };


  $('.task-list').on('click', '.delete-task', (e) => {
    let deleteButton = e.currentTarget;
    let taskId = deleteButton.closest('article').id;
    deleteButton.closest('article').remove();
    localStorage.removeItem(taskId);
  });

  $('.task-list').on('click', '.upvote', (e) => {
    let upVote = e.currentTarget;
    let qualityStatus = $(upVote).closest('.task-box').find('.task-ranking').text();
    let taskId = upVote.closest('.task-box').id;
    if (qualityStatus === qualityArray[0]){
      qualityStatus = qualityArray[1];
    } else if (qualityStatus === qualityArray[1]){
      qualityStatus = qualityArray[2];
    } else if (qualityStatus === qualityArray[2]){
      qualityStatus = qualityArray[3];
    } else if (qualityStatus === qualityArray[3]){
      qualityStatus = qualityArray[4];
    } else if (qualityStatus === qualityArray[4]){
      return qualityStatus;
    }
    storeUpdate(taskId, 'quality', qualityStatus);
    getAndDisplayTasks();
  });

  $('.task-list').on('click', '.downvote', (e) => {
    let downVote = e.currentTarget;
    let qualityStatus = $(downVote).closest('.task-box').find('.task-ranking').text();
    let taskId = downVote.closest('article').id;
    if (qualityStatus == qualityArray[4]){
      qualityStatus = qualityArray[3];
    } else if (qualityStatus === qualityArray[3]){
      qualityStatus = qualityArray[2];
    } else if (qualityStatus === qualityArray[2]){
      qualityStatus = qualityArray[1];
    } else if (qualityStatus === qualityArray[1]){
      qualityStatus = qualityArray[0];
    } else if (qualityStatus === qualityArray[0]){
      return qualityStatus;
    }
    storeUpdate(taskId, 'quality', qualityStatus);
    getAndDisplayTasks();
  });

  $('.task-list').on('blur', '.task-title', (e) => {
    let taskTitle = e.currentTarget;
    let title = $(taskTitle).text();
    let taskId = taskTitle.closest('article').id;
    storeUpdate(taskId, 'title', title);
    getAndDisplayTasks();
  });

  $('.task-list').on('blur', '.task-body', (e) => {
    let taskBody = e.currentTarget;
    let body = $(taskBody).val();
    let taskId = taskBody.closest('article').id;
    storeUpdate(taskId, 'body', body);
    getAndDisplayTasks();
  });

  $('.task-list').on('keypress', '.task-title', function(e){
    let taskTitle = e.currentTarget;
    let title = $(taskTitle).text();
    let taskId = taskTitle.closest('article').id;
    if(e.which === 13) {
      storeUpdate(taskId, 'title', title);
      getAndDisplayTasks();
    }
  });

  $('.task-list').on('keypress', '.task-body', function(e){
    let taskBody = e.currentTarget;
    let body = $(taskBody).val();
    let taskId = taskBody.closest('article').id;
    if(e.which === 13) {
      storeUpdate(taskId, 'body', body);
      getAndDisplayTasks();
    }
  });

  storeUpdate = (id, attribute, newValue) => {
    for (let i = 0; i < localStorage.length; i++) {
      let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if (id == task.uniqueid) {
        if (attribute === 'quality') {
          task.quality = newValue;
        } else if (attribute === 'title') {
          task.titleText = newValue;
        } else if (attribute === 'body') {
          task.bodyText = newValue;
        } else if(attribute === 'completed') {
          task.completed = newValue;
        }
        localStorage.setItem(parseInt(id), JSON.stringify(task));
      }
    }
  };

  $('#title-input, #body-input').on('input', () => {
    if($('#title-input').val() && $('#body-input').val()){
      $('#save-button').prop('disabled', false);
    } else {
      $('#save-button').prop('disabled', true);
    }
  });

  $('#title-input, #body-input').keypress((e) => {
    let taskFields = $('#title-input, #body-input');
    let titleField = $('#title-input');
    let bodyField = $('#body-input');
    if(e.which === 13) {
      e.preventDefault();
  }
    if (e.which === 13 && taskFields.val()) {
      displayAndStoreTask();
    }
});

  displayAndStoreTask = () => {
    addNewTaskBox();
    clearInputFields();
    disableSaveButton();
    getAndDisplayTasks();
  };

  $('.task-list').on('click', '#completed-task', (e) => {
    let complete = e.currentTarget;
    let title = $(complete).closest('article').find('h2');
    let body = $(complete).closest('article').find('textarea');
    let taskId = complete.closest('article').id;
    title.toggleClass('strike-thru');
    body.toggleClass('strike-thru');
    storeUpdate(taskId, 'completed', true);
  });


  storeNewObject = currentTask => {
    localStorage.setItem(currentTask.uniqueid, JSON.stringify(currentTask));
  };
