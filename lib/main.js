/*jshint esversion: 6 */
const qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
let completedStatus = 'hide';

getTasksFromStorage = () => {
  $('.task-box').remove();
  let tasksArray = [];
  for (let i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(!task.completed) {
      tasksArray.push(task);
    }
  };
  tasksArray.forEach(function(task, index, tasksArray) {
    displayOnPage(task);
  })
}

hideMoreThanTen = () => {
  let articleLength = $('article').length;
  for(i=0; i<articleLength; i++) {
    let article = $('article')[i];
    if(i > 9) {
      $(article).hide();
    }
  }
};

showMoreTasks = () => {
  let articleLength = $('article').length;
  for(i=0; i<articleLength; i++) {
    let article = $('article')[i];
    $(article).show()
  }
};

disableShowMoreButton = () => {
  $('#show-more').prop('disabled', true)
};

enableShowMoreButton = () => {
  $('#show-more').prop('disabled', false)
};

$('#show-more').on('click', () => {
  showMoreTasks();
  showMoreStatus = true;
  disableShowMoreButton();
});


toggleCompletedButton = () => {
  let completedCount = 0;
  for (let i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(task.completed) {
      completedCount += 1;
      if(completedCount > 0 && completedStatus === 'hide') {
        $('#show-completed').prop('disabled', false);
      } else if(completedStatus === 'show') {
        $('#show-completed').prop('disabled', true);
      }
    }
  }
};

displayOnPage = currentTask => {
  if(currentTask.completed) {
    currentTask.class = ' strike-thru';
    currentTask.upProp = 'disabled';
    currentTask.downProp = 'disabled';
  } else {
    currentTask.class = '';
    currentTask.upProp = '';
    currentTask.downProp = '';
  }
  if(!currentTask.completed && currentTask.quality === qualityArray[0]) {
    currentTask.downProp = 'disabled'
  } else if(!currentTask.completed && currentTask.quality === qualityArray[4]) {
    currentTask.upProp = 'disabled'
  } else {
    currentTask.upProp = '';
    currentTask.downProp = '';
  }
  $('.task-list').prepend(
    `<article id=${currentTask.uniqueid} class="task-box">
    <div class="search-field">
    <div class="task-box-header">
    <h2 class="task-title${currentTask.class}" contentEditable="true">${currentTask.titleText}</h2>
    <button class="delete-task" aria-label="delete-task"></button>
    </div>
    <textarea class="task-body${currentTask.class}" contentEditable="true" maxlength="120">${currentTask.bodyText}</textarea>
    </div>
    <div class="task-box-footer">
    <button class="upvote" ${currentTask.upProp}></button>
    <button class="downvote" ${currentTask.downProp}></button>
    <div class="task-ranking-quality">Importance:</div>
    <div class="task-ranking">${currentTask.quality}</div>
    <button id="completed-task-btn" class="btn">Completed</button>
    </div>
    </article>`);
  };

  toggleCompletedButton();
  getTasksFromStorage();
  hideMoreThanTen();

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
  toggleCompletedButton();
});

$('.task-list').on('click', '.upvote', (e) => {
  let upVote = e.currentTarget;
  let qualityStatus = $(upVote).closest('.task-box').find('.task-ranking').text();
  let taskId = upVote.closest('.task-box').id;
  let upButton = $(upVote).closest('article').find('.upvote');
  let downButton = $(upVote).closest('article').find('.downvote');

  if (qualityStatus === qualityArray[0]){
    qualityStatus = qualityArray[1];
    upButton.prop('disabled', false);
    downButton.prop('disabled', false);
  } else if (qualityStatus === qualityArray[1]){
    qualityStatus = qualityArray[2];
  } else if (qualityStatus === qualityArray[2]){
    qualityStatus = qualityArray[3];
  } else if (qualityStatus === qualityArray[3]){
    qualityStatus = qualityArray[4];
    upButton.prop('disabled', true);
  } else if (qualityStatus === qualityArray[4]){
    return qualityStatus;
  }
  storeUpdate(taskId, 'quality', qualityStatus);
  displayUpdate(upVote, 'ranking', qualityStatus);
});


$('.task-list').on('click', '.downvote', (e) => {
  let downVote = e.currentTarget;
  let qualityStatus = $(downVote).closest('.task-box').find('.task-ranking').text();
  let taskId = downVote.closest('article').id;
  let downButton = $(downVote).closest('article').find('.downvote');
  let upButton = $(downVote).closest('article').find('.upvote');
  if (qualityStatus == qualityArray[4]){
    qualityStatus = qualityArray[3];
    upButton.prop('disabled', false);
  } else if (qualityStatus === qualityArray[3]){
    qualityStatus = qualityArray[2];
  } else if (qualityStatus === qualityArray[2]){
    qualityStatus = qualityArray[1];
  } else if (qualityStatus === qualityArray[1]){
    qualityStatus = qualityArray[0];
    downButton.prop('disabled', true);
    upButton.prop('disabled', false);
  } else if (qualityStatus === qualityArray[0]){
    return qualityStatus;
  }
  storeUpdate(taskId, 'quality', qualityStatus);
  displayUpdate(downVote, 'ranking', qualityStatus);
});

displayUpdate = (target, thing, update) => {
  if(thing === 'ranking') {
    $(target).closest('.task-box').find('.task-ranking').text(update);
  } else if(thing === 'textUpdate') {
    $(target).text(update);
  }
};

$('.task-list').on('blur', '.task-title', (e) => {
  let taskTitle = e.currentTarget;
  let title = $(taskTitle).text();
  let taskId = taskTitle.closest('article').id;
  storeUpdate(taskId, 'title', title);
  displayUpdate(taskTitle, 'textUpdate', title);
});

$('.task-list').on('blur', '.task-body', (e) => {
  let taskBody = e.currentTarget;
  let body = $(taskBody).val();
  let taskId = taskBody.closest('article').id;
  storeUpdate(taskId, 'body', body);
  displayUpdate(taskBody, 'textUpdate', body);
});

$('.task-list').on('keypress', '.task-title', function(e){
  let taskTitle = e.currentTarget;
  let title = $(taskTitle).text();
  let taskId = taskTitle.closest('article').id;
  if(e.which === 13) {
    storeUpdate(taskId, 'title', title);
    displayUpdate(taskTitle, 'textUpdate', title);
    taskTitle.blur();
    e.preventDefault();
  }
});

$('.task-list').on('keypress', '.task-body', function(e){
  let taskBody = e.currentTarget;
  let body = $(taskBody).val();
  let taskId = taskBody.closest('article').id;
  if(e.which === 13) {
    storeUpdate(taskId, 'body', body);
    displayUpdate(taskBody, 'textUpdate', body);
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
  getTasksFromStorage();
  // DisplayTasks();
};

$('.task-list').on('click', '#completed-task', (e) => {
  let complete = e.currentTarget;
  let title = $(complete).closest('article').find('h2');
  let body = $(complete).closest('article').find('textarea');
  let taskId = complete.closest('article').id;
  let upvote = $(complete).closest('article').find('.upvote');
  let downvote = $(complete).closest('article').find('.downvote');
  let quality = $(complete).closest('article').find('.task-ranking').text();
  title.toggleClass('strike-thru');
  body.toggleClass('strike-thru');
  if(title.hasClass('strike-thru')) {
    upvote.prop('disabled', true);
    downvote.prop('disabled', true);
    storeUpdate(taskId, 'completed', true);
  } else {
    if(quality === qualityArray[0]) {
      upvote.prop('disabled', false);
      downvote.prop('disabled', true);
    } else if (quality === qualityArray[4]) {
      upvote.prop('disabled', true);
      downvote.prop('disabled', false);
    } else {
      upvote.prop('disabled', false);
      downvote.prop('disabled', false);
    }
    storeUpdate(taskId, 'completed', false);
  }
});

storeNewObject = currentTask => {
  localStorage.setItem(currentTask.uniqueid, JSON.stringify(currentTask));
};

$('#show-completed').on('click', (e) => {
  let button = e.currentTarget;
  for (let i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(task.completed && completedStatus === 'hide') {
      displayOnPage(task);
    }
  }
  completedStatus = 'show';
  $('#show-completed').prop('disabled', true);
});

//       OPTION 1

// $('.quality-btns').on('click', (e) => {
//   let quality = $(e.currentTarget).text();
//   for (i = 0; i < localStorage.length; i++) {
//     let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
//     $(`#${task.uniqueid}`).show();
//     if(quality !== task.quality && quality !== 'All'){
//       $(`#${task.uniqueid}`).hide();
//       disableShowMoreButton();
//     }
//     if(quality === 'All') {
//       $('article').show();
//       hideMoreThanTen();
//       $('#show-more').prop('disabled', false)
//     }
//   }
// });

//        OPTION 2

$('.quality-btns').on('click', (e) => {
  $('.task-box').remove();
  let quality = $(e.currentTarget).text();
  let tasksArray = [];
  for (let i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(quality === 'All' && !task.completed) {
      tasksArray.push(task);
    } else if(!task.completed && task.quality === quality) {
      tasksArray.push(task);
    }
  }
  tasksArray.forEach(function(task, index, tasksArray) {
    displayOnPage(task);
    hideMoreThanTen();
  })
  if(tasksArray.length > 10) {
    enableShowMoreButton();
  } else {
    disableShowMoreButton();
  }
});

$('#title-input').on('keyup', () => {
  let characterCount = 120 - $('#body-input').val().length;
  if($('#body-input').val() && characterCount >= 0) {
    $('#save-button').prop('disabled', false);
  } else {
    $('#save-button').prop('disabled', true);
  }
});

  $('#body-input').on('keyup', () => {
    let characterCount = 120 - $('#body-input').val().length;
    $('.remaining-characters').text(characterCount);
    if(characterCount <= 0) {
      $('.remaining-characters, .character-text').css('color', '#ec8383');
    } else {
      $('.remaining-characters, .character-text').css('color', '#bab6b6');
    }
    if(characterCount < 0){
      $('#save-button').prop('disabled', true);
    } else if(characterCount >= 0 && $('#title-input').val()) {
      $('#save-button').prop('disabled', false);
    }
  });
