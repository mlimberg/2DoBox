
const assert    = require('assert');
const webdriver = require('selenium-webdriver');
const test      = require('selenium-webdriver/testing');
const expect    = require('expect');
const $    = require('jquery');

test.describe('testing ideabox', function() {
  this.timeout(10000)

  test.it('should allow me to add a title and decription', () => {
    //start building our selenium driver
    const driver = new webdriver.Builder()
                                .forBrowser('chrome')
                                .build()

    driver.get('http://localhost:8080')

    const title = driver.findElement({name: 'title'})
    const body  = driver.findElement({name: 'body'})

    title.sendKeys('this is a title').then(() => {
      return title.getAttribute('value')
    }).then((value) => {
      assert.equal(value, 'this is a title')
    })
    body.sendKeys('this is a description').then(() => {
      return body.getAttribute('value')
    }).then((value) => {
      assert.equal(value, 'this is a description')
    })
    driver.quit()
  })

test.it('should allow me to add an element to the dom', () => {

  const driver = new webdriver.Builder()
                              .forBrowser('chrome')
                              .build()

    driver.get('http://localhost:8080')

    const title      = driver.findElement({name: 'title'})
    const body       = driver.findElement({name: 'body'})
    const saveButton = driver.findElement({name: 'save'})

    title.sendKeys('this is a title')
    body.sendKeys('this is a description')
    saveButton.click()

    const taskTitle = driver.findElement({className: 'task-title'}).then((title) => {
      return title.getText()
    }).then((text) => {
      assert.equal(text, 'this is a title')
    })
    const taskBody = driver.findElement({className: 'task-body'}).then((body) => {
      return body.getText()
    }).then((text) => {
      assert.equal(text, 'this is a description')
    })
    driver.quit()
})

test.it("should allow me to complete a task when clicking 'complete' button", () => {

  const driver = new webdriver.Builder()
                              .forBrowser('chrome')
                              .build()

    driver.get('http://localhost:8080')

    const title          = driver.findElement({name: 'title'})
    const body           = driver.findElement({name: 'body'})
    const saveButton     = driver.findElement({name: 'save'})

    title.sendKeys('this is a title')
    body.sendKeys('this is a description')
    saveButton.click()

    const completeButton = driver.findElement({className: 'completed-task'})

    completeButton.click()

    const taskTitle = driver.findElement({className: 'task-title'}).then((element) => {
      element.getAttribute('class').then((taskClass) => {
        return taskClass;
      }).then((taskClass) => {
        assert.equal(taskClass, 'task-title strike-thru')
      })
    })

    const bodyTitle = driver.findElement({className: 'task-body'}).then((element) => {
      element.getAttribute('class').then((taskClass) => {
        return taskClass;
      }).then((taskClass) => {
        assert.equal(taskClass, 'task-body strike-thru')
      })
    })

    driver.quit()
})

test.it("test that quality changes when upvote or downvote are clicked", () => {

  const driver = new webdriver.Builder()
                              .forBrowser('chrome')
                              .build()

    driver.get('http://localhost:8080')

    const title          = driver.findElement({name: 'title'})
    const body           = driver.findElement({name: 'body'})
    const saveButton     = driver.findElement({name: 'save'})

    title.sendKeys('this is a title')
    body.sendKeys('this is a description')
    saveButton.click()


    const upVote   = driver.findElement({className: 'upvote'})
    const downVote = driver.findElement({className: 'downvote'})

    upVote.click()

    driver.findElement({className: 'task-ranking'}).then((quality) => {
      quality.getText().then((text) => {
        return text;
      }).then((text) => {
        assert.equal(text, 'High')
      })
    })

    downVote.click()
    downVote.click()

    driver.findElement({className: 'task-ranking'}).then((quality) => {
      quality.getText().then((text) => {
        return text;
      }).then((text) => {
        assert.equal(text, 'Low')
      })
    })

    driver.quit()
})

test.it("test that card is removed when delete button is clicked", () => {

  const driver = new webdriver.Builder()
                              .forBrowser('chrome')
                              .build()

    driver.get('http://localhost:8080')

    const title          = driver.findElement({name: 'title'})
    const body           = driver.findElement({name: 'body'})
    const saveButton     = driver.findElement({name: 'save'})

    title.sendKeys('this is a title')
    body.sendKeys('this is a description')
    saveButton.click()

    title.sendKeys('this is a title')
    body.sendKeys('this is a description')
    saveButton.click()

    const deleteButton = driver.findElement({className: 'delete-task'})

    deleteButton.click()

      driver.findElements({className: 'task-box'}).then((tasks) =>{
      assert.equal(tasks.length, 1)
    })

    driver.quit()
})

});
