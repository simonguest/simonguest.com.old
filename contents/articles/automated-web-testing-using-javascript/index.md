---
title: Automated Web Testing using JavaScript
author: 
date: Thu, 27 Mar 2014 20:22:01 GMT
template: article.jade
---

The process of creating automated tests for Web applications has been around for many years. Vendors such as HP, Parasoft, QFS, and even Microsoft have test software that can be used to create and run automated tests. Over the past couple of years however, we’ve seen an industry-trend towards open source Web testing solutions based on JavaScript. Such solutions have the advantage of being easily modified, free to download, very modular, supported by a vibrant community, and (given the popularity of client-side JavaScript) tests can often be written using the same language as the Web application. 

For this blog post, I wanted to share some of our observations at Neudesic, and some of the tools that we’ve had success with during recent projects.

**Unit Tests or Assertions?**

Before considering any unit test, one of the questions we try to ask is whether the same functionality can be provided by an assertion. An assertion is, in its simplest form, code in your application that asserts that some condition is true – and if it’s false, stops the application and&#x2F;or reports an error message.

The easiest way to perform an assertion in JavaScript is with the **console.assert** function. This is supported on the latest version of most major browsers (Chrome, Safari, and IE 10 upwards). A simple use of console.assert might look as follows:

&lt;pre&gt;var myMethod = function(x){
  console.assert(x, &#39;X should not be undefined&#39;);
  &#x2F;* rest of method goes here *&#x2F;
};
&lt;&#x2F;pre&gt;

As shown above, this is the simplest form of an assertion, yet quite effective. More importantly, it also negates the need to have a redundant unit test that checks whether the value of x is null, resulting in fewer tests that simply do assertion checking. There are many developers who use assertions during development and then strip out the assertions for production. While this has some merit, a more productive approach can be to create your own assertion function. This might look something like the following:

&lt;pre&gt;var myMethod = function(x){
  assert(x, &#39;X should not be undefined&#39;);
  &#x2F;* rest of method goes here *&#x2F;
};
&lt;&#x2F;pre&gt;

As shown above, instead of calling console.assert we call a custom function. This has the advantage that in development mode we can inject an assert function that writes to the console or adds a breakpoint in code, whereas in production mode we might choose to display a more friendly error message to the user and potentially log the crash via an analytics service.

**QUnit**

Assertions are useful for performing simple checks on methods, but there will likely come a time where you need to perform more rigorous tests of logic, using a unit test. [QUnit](http:&#x2F;&#x2F;qunitjs.com) is a popular JavaScript framework for unit testing, whose origins come from jQuery and jQuery UI. QUnit works by defining a set of tests that are run within the QUnit test runner (which itself is just a Web page). Unit tests are simple, and follow a format similar to the following:

&lt;pre&gt;test(&#39;a basic test example&#39;, function() {
  var value = &#39;hello&#39;;
  equal(value, ‘hello&#39;, &#39;We expect value to be hello&#39;);
})
&lt;&#x2F;pre&gt;

If you are new to unit testing in JavaScript, and starting out by writing simple single page tests, QUnit is a good way to get started.

**Jasmine and Karma**

While QUnit provides a good introduction to unit testing, it is easy to quickly reach a limit, especially if your application has a lot of tests nested in a hierarchy. In addition, QUnit does not typically provide any CI (Continuous Integration) functionality out of the box. As you increase your familiarity with unit testing using JavaScript, it is well worth checking out [Jasmine](http:&#x2F;&#x2F;jasmine.github.io) and [Karma](http:&#x2F;&#x2F;karma-runner.github.io).

Jasmine is a BDD-style framework for writing tests. While similar to the QUnit construct, the syntax tends to be cleaner and more widely adopted in the JavaScript community:

&lt;pre&gt;describe(&#39;a basic test example&#39;, function() {
  it(&#39;tests that true is always the truth&#39;, function() {
  expect(true).toBe(true);
  });
});
&lt;&#x2F;pre&gt;

As can be shown in the example above, the describe, it, and expect keywords work with unit tests, but also apply to BDD style tests also – making Jasmine a good candidate for writing tests of both types. Jasmine is just a language syntax and by design doesn’t offer any test runner implementation. Fortunately, there are a number of test runners available that can run Jasmine tests. One such framework gaining adoption is Karma, a test framework developed by the AngularJS team at Google.

Karma, which used to be called Testacular (insert your joke here about why the name changed!), is a flexible test framework that can be used to call unit tests written in Jasmine and other frameworks. Karma is very lightweight, which means it works well in CI (Continuous Integration) settings, even to the point where it’s possible to have Karma invoke a series of tests after each file save on your development machine. While there are many different test runners capable of executing unit tests, I believe Karma adoption will continue to grow, and this should be something that you should look at for your own testing needs.

**Selenium**

Unit testing is useful for testing discreet logic in your application, but falls short of telling you whether the application is working correctly for the user in their environment – i.e. through their browser. To do this we need to turn to integration testing – testing the end to end operation of your Web application. [Selenium](http:&#x2F;&#x2F;seleniumhq.org) is an open source project that has been in development for the past 10 years, originally developed by [ThoughtWorks](http:&#x2F;&#x2F;thoughtworks.com) as a replacement for Mercurial (hence the name, as Selenium is often used to cure Mercury poisoning!).

Today, Selenium has three major components: Selenium IDE, Selenium WebDriver, and Selenium Grid.

**Selenium IDE** is a browser extension for Firefox that enables you to record a series of actions and test assertions via a “recording function” in the browser. By default, the test gets written to a HTML-based test suite, and can be replayed at any time. While Selenium IDE is a useful tool for investigating the underlying operations of the testing platform, it is not well suited for use in production – the tests don’t support inheritance, which makes management of the tests difficult, especially when things change in your application. Moreover, the tests have to be run through the Firefox browser, which makes true automation difficult.

**Selenium WebDriver** (which used to be Selenium RC) is a server-side version of the Selenium testing platform that does support scripted tests. WebDriver (based on the emerging WebDriver spec, hence the name), runs as a Java service and accepts incoming TCP socket connections from test clients. Upon receiving a connection, the service invokes a browser, runs the tests, and reports status back to the client via the socket. Any test platform that implements the [WebDriver specification](https:&#x2F;&#x2F;dvcs.w3.org&#x2F;hg&#x2F;webdriver&#x2F;raw-file&#x2F;default&#x2F;webdriver-spec.html) can issue tests to a Selenium server.

**Selenium Grid** is a service where multiple Selenium servers can be clustered to handle a high volume of tests. It is often used by service providers (such as SauceLabs) who are offering testing services to multiple clients.

For many projects, Selenium WebDriver makes the most sense. In order to use WebDriver with Jasmine however, you still need to have a test runner (remember that Jasmine doesn’t provide any test platform). Karma is not a fit here as it is best suited for unit tests, not end-to-end tests (as it happens, the documentation actually discourages the use of Karma for integration testing). To solve this, we turn to another testing framework from Google, [Protractor](http:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor):

**Protractor** is an end-to-end test framework, typically used to test [AngularJS](http:&#x2F;&#x2F;angularjs.org) applications – although any Web application can be tested as protractor contains methods to call the underlying WebDriver implementation. It is built upon a library called [WebDriverJS](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;wiki&#x2F;WebDriverJs), a JavaScript-implementation of the WebDriver client, which makes it wire compatible with Selenium WebDriver. Protractor is simple to install, and supports Jasmine as it’s primary test language. A test using protractor might look as follows:

&lt;pre&gt;describe(&#39;test hello world home page&#39;, function() {
  it(&#39;should greet the named user&#39;, function() {
    browser.get(&#39;http:&#x2F;&#x2F;www.angularjs.org&#39;);
    element(by.model(&#39;yourName&#39;)).sendKeys(&#39;Simon&#39;);
    var greeting = element(by.binding(&#39;yourName&#39;));
    expect(greeting.getText()).toEqual(&#39;Hello Simon!&#39;);
  });
});
&lt;&#x2F;pre&gt;

As you can see above, this simple test will open a Web page, look for a data binding called ‘yourName’, send a name to it, and then assert that the greeting replied is correct. You should note that the model and binding above are specific to AngularJS, and (if you are not using AngularJS) can be replaced with similar lookups based on HTML ID, CSS, or XPATH query. Using the protractor test runner, this test can be sent to an instance of Selenium, which in turn will invoke a new browser, run the test, and report back the results to the client.

**IDEs for Creating Protractor Tests. **While creating tests is a manual process today, there are several open source projects with a goal of being able to generate protractor-based tests from a more visual interface. One such tool is [Selenium Builder](http:&#x2F;&#x2F;sebuilder.github.io&#x2F;se-builder&#x2F;), which while still in Alpha, looks very promising.

**Using Page Objects.** While Jasmine and Protractor offer a very quick way of creating and running tests, you often need to be careful to manage the tests that you create. If you make a simple change in the UI, you want to avoid a situation where you need to change many tests. One way of overcoming this is to use [Page Objects](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;master&#x2F;docs&#x2F;getting-started.md#organizing-real-tests-page-objects) when using Protractor. A Page Object is, by definition, a JavaScript class that defines methods on a page.

These methods might be AddCustomer, DeleteCustomer, ModifyCustomer, etc. The tests then call these page objects to perform the function. For example, AddCustomer(valid), AddCustomer(invalid), AddCustomer(invalid2), etc. This approach offers many advantages, especially if the page changes. If a change to page occurs, only the page object has to be changed once, which makes maintenance and re-use throughout the tests more predictable.

**PhantomJS.** Finally, as we discussed previously, Selenium works by invoking a new browser process in order to run tests. While this is useful on your development machine, there are times where you may want to invoke tests that do not have access to a fully installed browser – for example, if you are doing server-side tests on a Linux or a [Docker](http:&#x2F;&#x2F;docker.io) instance without a UI installed. To accomplish this, [PhantomJS](http:&#x2F;&#x2F;phantomjs.org) can be used. PhantomJS is a headless version of WebKit written in Qt, and can act as a browser without any of the UI overhead associated with actually launching a browser.

PhantomJS can be invoked in one of two ways – either plugged directly into Selenium as an alternative browser process – or, because PhantomJS implements [GhostDriver](https:&#x2F;&#x2F;github.com&#x2F;detro&#x2F;ghostdriver) (wire level compatibility with WebDriver), it can be called directly from Protractor. PhantomJS is still in early development stages (and at the time of writing being ported to Qt5), but looks to offer a lot of potential for developers who are looking to do integration testing in a headless environment.
