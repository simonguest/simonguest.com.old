---
title: Announcing Neudesic Slingshot!
author: 
date: Wed, 27 Jun 2012 15:06:58 GMT
template: article.jade
---

&lt;small&gt;Getting SharePoint working on a mobile device can be hard. The “out of the box” experience, even with SharePoint 2010, is very basic and doesn’t take advantage of the device. Solutions on the AppStore are a step in the right direction, but many don’t do anything over providing the ability to browse a SharePoint site.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;At Neudesic, we are hoping to change all this through a project we call [Slingshot](http:&#x2F;&#x2F;neudesic.github.com&#x2F;slingshot).
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Slingshot is an open source mobile client and library for SharePoint. Built upon the jQuery Mobile and Apache Cordova frameworks, Slingshot makes it ridiculously easy to expose tasks, announcements, documents, and virtually any other object directly from SharePoint to any mobile device.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2012&#x2F;06&#x2F;myWPEdit_Image_1340834594.jpg)&lt;&#x2F;small&gt;&lt;small&gt;￼&lt;&#x2F;small&gt;&lt;small&gt;
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;We demonstrated Slingshot for the first time in public at the SharePointFest in Denver this week, and the response has been tremendous. For those that didn’t make it to the event, I wanted to use this blog post to expand on what the framework can do.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Slingshot is very lightweight, and can be deployed in one of two ways: The code can run on the SharePoint server, and users access it using their mobile browser. Alternatively the same code can run on the mobile device in a native application, with no changes required on the SharePoint server.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Here’s a quick run through of what Slingshot supports today:
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;SharePoint Lists and Items &lt;&#x2F;small&gt;**&lt;small&gt;
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Slingshot uses the ODATA support in SharePoint 2010 to expose virtually any list or item to the mobile device. The out of the box demo shows announcements, tasks, and organizational details, and it’s easy to extend to workflows and other lists. Each of these items can be exposed through a form with touch native controls.  &lt;&#x2F;small&gt;&lt;small&gt;For example, task items have a slider control to indicate percentage complete.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;Bi-Directional Updates&lt;&#x2F;small&gt;**&lt;small&gt;
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;The sample app also demonstrates bi-directional updating. Update an item from SharePoint UI, and it automatically gets updated on the mobile device. Alternatively, update on the mobile device and the item is automatically updated in SharePoint. This update is seamless, so the user doesn’t have to hit “save” after making the change on the mobile device.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;Document Library Support&lt;&#x2F;small&gt;**&lt;small&gt;
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;One of the core scenarios for using Slingshot is to browse document libraries, which Slingshot handles really well. Supported file types (such as PDFs) can also be opened directly from the mobile app.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;Integration with Photo Capture
&lt;&#x2F;small&gt;** &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Browsing and opening files from a mobile device is useful, but Slingshot also supports uploading data from the device. The majority of phones now come with a camera. The sample application shows how to take a photo on the device and upload it to a document library or attach it to an item. We find this functionality well suited for field employees who need to interact with workflows that involve taking pictures and uploading them to SharePoint.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;Support for Offline Scenarios
&lt;&#x2F;small&gt;** &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Because Slingshot works locally on the device it enables a number of offline scenarios. Currently the application has the ability to work offline, and we are working on synchronization of SharePoint lists and items to the device, which will provide a true offline experience if no connection is available.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;Authentication&lt;&#x2F;small&gt;**&lt;small&gt;
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Authentication works in one of two ways. If you are accessing Slingshot via a mobile browser, the browser will prompt for credentials (the same way as if you&#39;d just navigated to any other SharePoint page). If you are running Slingshot locally on the device, we use a form-based mechanism that can be customized and extended as needed.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;Multi Platform Support&lt;&#x2F;small&gt;**&lt;small&gt;
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Because we&#39;ve developed all of this using jQuery Mobile and Cordova (PhoneGap), it is supported on multiple platforms by default. Both these frameworks support up to six platforms today, including iOS, Android, Windows Phone 7, and Blackberry. We provide default templates for iPhone and Android, and creating new templates for other devices is as simple as creating new CSS files.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;Easy to Extend and Update&lt;&#x2F;small&gt;**&lt;small&gt;
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Apart from the device integration, everything in Slingshot is based on HTML5 and JavaScript. For those coming from a web background, this makes it very simple to extend and update.&lt;&#x2F;small&gt;

&lt;small&gt; &lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Best of all, we&#39;ve licensed Slingshot as an open source framework, under the MIT license. You can get all the bits for free, and we even have other developers that are signing up to contribute.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Ready to see more? If you didn’t have an opportunity to stop by the booth at SharePointFest in Denver, check out the &lt;&#x2F;small&gt;[&lt;small&gt;repo&lt;&#x2F;small&gt;](http:&#x2F;&#x2F;neudesic.github.com&#x2F;slingshot)&lt;small&gt; on GitHub – or drop me a line using the &lt;&#x2F;small&gt;[&lt;small&gt;contact form&lt;&#x2F;small&gt;](http:&#x2F;&#x2F;simonguest.com&#x2F;contact-me&#x2F;)&lt;small&gt; if you&#39;d like more information. Neudesic is actively extending this framework for many other scenarios and customers, and we&#39;d be happy to help you extend this for your own needs also. &lt;&#x2F;small&gt;&lt;small&gt;
&lt;&#x2F;small&gt;
