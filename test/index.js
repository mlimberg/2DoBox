
const assert    = require('assert');
const webdriver = require('selenium-webdriver');
const test      = require('selenium-webdriver/testing');


test.describe('testing idea-box', function() {
  this.timeout(10000)

  test.it('should allow me to add a title and decription', () => {
    //start building our selenium driver
    const driver = new webdriver.Builder()
                                .forBrowser('chrome')
                                .build()

    driver.get('http://localhost:8080')

    const title       = driver.findElement({name: 'title'})
    const body        = driver.findElement({name: 'body'})

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
    // driver.quit()
})

});
