
getTasksFromStorage = qualityArray => {
  $('.task-box').remove();
  let tasksArray = [];
  for (let i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(!task.completed) {
      tasksArray.push(task);
    }
  }
  tasksArray.forEach(function(task, index, tasksArray) {
    displayOnPage(task, qualityArray);
  });
};

changeTextRed = (count) => {
  if(count <= 0) {
    $('.remaining-characters, .character-text').css('color', '#CF1E1E');
  } else {
    $('.remaining-characters, .character-text').css('color', '#000');
  }
};

verifyInputs = (count) => {
  if($('#body-input').val() && $('#title-input').val() && count <= 120 && count >= 0) {
    enableSaveButton();
  } else {
    disableSaveButton();
  }
};

disableSaveButton = () => {
  $('#save-button').prop('disabled', true);
};

enableSaveButton = () => {
  $('#save-button').prop('disabled', false);
};

disableShowMoreButton = () => {
  $('#show-more').prop('disabled', true);
};

enableShowMoreButton = () => {
  $('#show-more').prop('disabled', false);
};

disableShowCompletedButton = () => {
  $('#show-completed').prop('disabled', true);
}

enableShowCompletedButton = () => {
  $('#show-completed').prop('disabled', false);
}

clearInputFields = () => {
  let titleField = $('#title-input');
  let bodyField = $('#body-input');
  return titleField.val("") && bodyField.val("") && $('#search-input').val("");
};

hideMoreThanTen = () => {
  let articleLength = $('article').length;
  if(articleLength === 0) {
    $('.quality-btns').prop('disabled', true)
  } else {
    $('.quality-btns').prop('disabled', false)
  }
  if(articleLength <= 10) {
    disableShowMoreButton();
  } else {
    enableShowMoreButton();
  }
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
    $(article).show();
  }
};

storeNewObject = currentTask => {
  localStorage.setItem(currentTask.uniqueid, JSON.stringify(currentTask));
};

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

toggleCompletedButton = completedStatus => {
  let completedCount = 0;
  for (let i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(task.completed) {
      completedCount += 1;
      if(completedCount > 0 && completedStatus === 'hide') {
        enableShowCompletedButton();
      } else if(completedStatus === 'show') {
        disableShowCompletedButton();
      }
    }
  }
};

displayUpdate = (target, thing, update) => {
  if(thing === 'ranking') {
    $(target).closest('.task-box').find('.task-ranking').text(update);
  } else if(thing === 'textUpdate') {
    $(target).text(update);
  }
};

markCompletedTasks = currentTask => {
  if(currentTask.completed) {
    currentTask.class = ' strike-thru';
    currentTask.upProp = 'disabled';
    currentTask.downProp = 'disabled';
  } else {
    currentTask.class = '';
    currentTask.upProp = '';
    currentTask.downProp = '';
  }
}

disableNecessaryVoteButtons = (currentTask, qualityArray) => {
  if(!currentTask.completed && currentTask.quality === qualityArray[0]) {
    currentTask.downProp = 'disabled';
  } else if(!currentTask.completed && currentTask.quality === qualityArray[4]) {
      currentTask.upProp = 'disabled';
  } else if(currentTask.completed) {
      currentTask.downProp = 'disabled';
      currentTask.upProp = 'disabled';
  } else {
    currentTask.upProp = '';
    currentTask.downProp = '';
  }
}

displayOnPage = (currentTask, qualityArray) => {
  markCompletedTasks(currentTask);
  disableNecessaryVoteButtons(currentTask, qualityArray)
  $('.task-list').prepend(
    `<article id=${currentTask.uniqueid} class="task-box">
    <div class="search-field">
    <div class="task-box-header">
    <h2 class="task-title${currentTask.class}" contentEditable="true">${currentTask.titleText}</h2>
    <button class="delete-task" aria-label="delete-task"></button>
    </div>
    <textarea class="task-body${currentTask.class}" contentEditable="true" maxlength="120" aria-label="input">${currentTask.bodyText}</textarea>
    </div>
    <div class="task-box-footer">
    <button class="upvote" aria-label="upvote" ${currentTask.upProp}></button>
    <button class="downvote" aria-label="downvote" ${currentTask.downProp}></button>
    <div class="task-ranking-quality">Importance:</div>
    <div class="task-ranking">${currentTask.quality}</div>
    <button class="btn completed-task" name="complete">Completed</button>
    </div>
    </article>`);
  };

  displayAndStoreTask = qualityArray => {
    addNewTaskBox(qualityArray);
    clearInputFields();
    disableSaveButton();
    getTasksFromStorage(qualityArray);
  };

  class NewTaskConstructor {
    constructor(titleText, bodyText, quality, uniqueid) {
      this.titleText = titleText;
      this.bodyText = bodyText;
      this.quality =  quality || 'Normal';
      this.uniqueid = uniqueid || Date.now();
      this.completed = false;
    }
  }

  addNewTaskBox = qualityArray => {
    let titleField = $('#title-input');
    let bodyField = $('#body-input');
    let currentTask = new NewTaskConstructor(titleField.val(), bodyField.val());
    displayOnPage(currentTask, qualityArray);
    storeNewObject(currentTask);
  };
