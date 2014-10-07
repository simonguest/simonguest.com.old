---
title: Tips, Tricks, and Recommendations for HTML5/Mobile Web Development
author: Simon Guest
date: Thu, 12 Apr 2012 13:14:45 GMT
template: article.jade
---

Over the past few months I've been fortunate to have worked with several customers creating Mobile Web applications for different devices.  These have included an iPad based Mobile Web app for a healthcare provider, a cross-platform Mobile Web app for a commercial real estate broker, and an Android tablet solution to allow scientists to research experiment details from the comfort of their lab.

From these projects, I've come up with a list of tips, tricks, and recommendations that I wanted to share if you are looking to develop your own Mobile Web applications.  Hope you find them useful...

<span class="more"></span>

**Understand the differences between Mobile Web and hybrid applications**

It’s important to make an early decision on whether your application is going to be pure Mobile Web (the user accesses it through the browser on the device) or hybrid (the user launches an application with an embedded control to display web based content).  The decision to use the mobile browser or to have a dedicated hybrid application will likely be determined by the functionality the application requires.  For example, obtaining the GPS location from the device can be performed perfectly well inside the browser, but accessing the camera from a Web page needs a hybrid application to provide the functionality. 

In my experience there are three common features that drive developers towards a hybrid application:  1\. Access to the camera.  2\. Access to local contacts on the device.  3\. Deployment to the AppStore/Marketplace.  The first two are to overcome limitations of what can and can’t be accessed through the mobile browser (and is something that Mozilla is trying to tackle through [WebAPI](https://wiki.mozilla.org/WebAPI)).  The latter one is probably the most important to understand however – as while a hybrid solution will enable the application to be published to the app stores, extreme care needs to be taken to ensure that the application will not be rejected.  This is most common with applications destined for Apple’s AppStore (if Apple view your application as a single container for web content with no apparent native functionality, they will more than likely reject it).

If you do take the hybrid approach, you really have two options to build the application – you can either set out and build a native application, embed a WebView control and then hook different events to create your own bridge between the two.  This can be very useful if you only have a small piece of Web functionality that you need to embed in your application.  Alternatively, you can consider using a framework such as [PhoneGap](http://phonegap.com/) (now known as [Apache Cordova](http://incubator.apache.org/cordova/)).  Using Cordova is  not without it’s challenges (for example, with cross domain scripting and client side certificate authentication), but it can definitely give you a head start especially if the majority of your application is going to be based on mobile web content.

**Setup a robust development and testing environment**

Setting up a robust development environment might be viewed as obvious for most of us, but tools for developing Mobile Web applications are still relatively immature, so it’s an important area to get right before you start your first app.  In the most basic setup, you are going to need three things to be successful:

The first is a great IDE for HTML development.  You've probably got your favorite already, but a strong IDE with as much JavaScript code completion support as possible will be your friend.  Personally, I switch between [TextMate](http://macromates.com/), [Visual Studio 2010](http://www.microsoft.com/visualstudio/en-us), and [WebStorm](http://www.jetbrains.com/webstorm/) depending on which platform I'm working with.  It’s also interested to see where Adobe are headed with their toolset.

Secondly, you are going to need a browser capable of inspecting the DOM and doing JavaScript debugging.  Personally, I use Safari for doing this, but Chrome and/or IE9 will equally provide you the tools that you need.  The important thing here is not so much the choice of the browser, but the understanding of how to breakpoint JavaScript code and inspect elements both on and off the page. 

Finally, you'll need some kind of device, or device emulator.  Switching the user agent on a desktop browser will only get you so far, and eventually you are going to need to test on something representative of the device that the user will be using.  If you are developing an application that will be primarily used on iOS devices, I would certainly recommend a Mac (as the iOS simulator is very robust).  If a Mac doesn’t float your boat as your development machine however you could consider a hosted solution such as [MacinCloud](http://www.macincloud.com/) or simply do all your debugging using an iPod touch.  There are a few PC based utilities that claim to emulate mobile safari/iOS, but I've had a poor experience with all of them.

For Android, I tend to avoid the emulator whenever possible (it’s a resource hog) and instead have a selection of devices that I can use for debugging on the fly.  I've found that the key for Android testing is to have a selection of devices with preferably different resolutions and running different versions of the OS (e.g. a separate device running 2.1, 2.2, 2.3, and 4.0 should cover most of the current market, unless you have a need to go back to 1.6 for some reason).  If you don’t have access to physical handsets, you may want to consider one of the testing providers such as [Perfecto Mobile](http://www.perfectomobile.com/).  They have a variety of devices that you can rent, covering many different platforms.

**Use client side JavaScript instead of server side scripting**

If you've been developing Web applications for some time, especially enterprise facing applications, you'll be used to having a lot of the presentation and application logic tied up in server side scripts, maybe running server-side ASP, ASP.NET, JSP, PHP, etc.  When developing Mobile Web applications however, things need to change.  While server-side scripting will of course still work for a mobile application (and might be very tempting as you start to write your first application), it quickly creates a tight coupling between your device and the server.  In the old days where you were accessing the server from a desktop browser on the same network, this wasn’t a problem – but once you move the experience to a mobile device with a potentially patchy network connection, the last thing you want to be doing is relying on the server side for generation of pages and views.  If your mobile web application needs to do a roundtrip to the server when you hit the “Next Page” button, you're going to be heading for a world of hurt.

The answer is to move as much (if not all) of the application logic to client-side JavaScript.  This might be a painful exercise as you translate the move from an MVC server side framework to handcrafting page navigation using client side JavaScript, but the pay off will be worth it.  If you have all of the application logic locally, together with pre-fetching as many of the pages into the DOM when your application first loads, you effectively disconnect yourself from the server side which makes performance much better and also moving to offline much easier.  Of course, you still want to communicate with the server side – who doesn’t? – but this should be done via a set of asynchronous REST/JSON calls to bring data into the application rather than relying on the server to generate HTML for your application.

**Design for running offline**

Related to the previous point, you should also start thinking about how your application could run offline, even if you have no plans to do so.  This will put you on a good architectural path, and will also mean that your application will work if and when network connectivity is lost.  There are plenty of articles explaining how to enable offline access in HTML5 applications, so I won’t plan to cover here – other than to say you'll be creating a cache manifest for your application, specifying the files to go into your cache, enabling the scripts for checking the cache when your application starts, and handling control logic accordingly (e.g. when you hit that submit button, you'll want to know whether there is network connectivity before making the call to the server!).

If there’s one piece of advice that I can offer here however (and we learned this the hard way) it is to design for offline first, but implement last.  Do all of the right things to support offline in your application, but don’t enable it until you are close to the end of your development cycle.  If you enable it too early, it can cause mayhem with the development team – as your developers could end up debugging against a version of the application that could be slightly older – or the cache doesn’t get refreshed in the way it should.  This doesn’t application to local storage – this is fine to access during development – I would just recommend not enabling the cache manifest until you go into UAT.

**Select the right UI framework for your needs**

Almost every other day there seems to be a new HTML UI framework released, and mobile frameworks are no exception.  At Neudesic we've had most experience and success using [jQuery Mobile](www.jquerymobile.com), but have equally done work using [Sencha](http://www.sencha.com/), [Dojo](http://dojotoolkit.org/features/mobile) and others.  As all the frameworks offer slightly different combinations of controls, I've found one of the tricks for selecting a suitable framework is to first build out a list of the controls that you are likely to need.  For example, in one project we developed a set of paper prototypes (side note – I really dig [UI Stencils](http://www.uistencils.com/) for this) and realized that we would be creating a multi-tabbed application, with many lists on each page.  Knowing what controls we were likely to use ahead of time made selecting the framework easier, and also put into perspective what controls we would have to build from scratch.

The good news is that most of the frameworks have demo pages/sites available, so that you can check them out beforehand without having to download anything.   This can be a great way of testing the controls across a different number of devices, as well as getting a feel for the performance.  My rough order of magnitude is that HTML based mobile UI will feel around 85% of a native control – it will look similar, react similar, but you just know that there’s this 10 – 15% gap that doesn’t quite feel native.

**Understand the caveats with implementing maps in Mobile Web applications**

Related to the last point, many applications have a need to display maps and pinpoints, and this will likely remain true for many mobile web applications that you might be creating.  Based on experience, there are a couple of caveats that need to be understood before you head down this path.

Firstly, performance on Mobile Web map controls is not to par with native controls.  Using Google Maps in Safari on iOS seems sluggish when comparing it to using MapKit in a native iOS application.  I'm not sure what optimizations have been done in MapKit to give it the performance it has, but the difference is quite noticeable.  As a result, if your application has a fundamental need to do a lot of mapping (i.e. if this is it’s primary function) you may want to consider a hybrid approach where you navigate to native pages for the mapping as part of your application.

Secondly, the web control for Google Maps (and this probably applies to other mapping controls) likes to “own” the page – which can put it into conflict with UI frameworks such as jQuery Mobile.  For example, when you change pages in jQuery Mobile, the DIV element of your current page is set to hidden, and the DIV element of the new page to block.  If your map control is embedded on a page that gets set to hidden this can cause Google maps to have a hard time.  We've experienced random behavior such as the map control not updating or repainting correctly when it is brought back into focus.  This can be overcome by an event on the page load to refresh the map canvas (example below), but it’s one of those bugs that takes a lot longer to find than it does to fix.

```javascript
$(‘#mappage’).live(‘pageshow’, function() { google.maps.event.trigger(map, ‘resize’); });
```

**Think ahead for non-standard UI elements you are likely to need**

While frameworks such as jQuery Mobile will provide standard controls such as buttons, lists, labels, and radio boxes, your application will likely have a need for elements and controls that are non-standard.  These can include tables, grids, and image carousels to name a few.  Many of these can be created using custom controls, but before going down that path, I always try and ask myself two questions:

Firstly, if the control does not exist, does that mean a better UI nuance is available for the device?  For example, there are few mobile web controls for displaying datagrids on mobile devices.  Rather than force-fitting a solution that might not work well on a 3.2" screen, think about what alternative solutions could be used instead.  For example, maybe a series of cascading list controls would actually provide for a better user experience over some custom hacked-together table control.  When in doubt, try to look at how other mobile applications have used controls to represent a similar data set.  

Secondly, if the control does seem to fit, but it’s just not included in the standard UI framework that you've chosen, think about searching for a third party solution before re-creating something new.  This can apply to image carousels ([PhotoSwipe](http://www.photoswipe.com/) is one of my favorite controls for doing this) as well as charting (there are several really good JS based charting controls out there).

**Make your mobile web app look and feel like it belongs with native applications.**

Why not go that extra step and have your mobile application look like it belongs with other native applications on the device?  A couple of small recommendations for this one:

Firstly, never show the address bar in your mobile application.  Simply use a <viewport…/> tag to have your application run in full screen mode.  The user will still be able to get to the address bar, but it will be hidden from view by default.  (side note – jQuery Mobile now performs this automatically without the need to do “scroll to” events in JavaScript).

Secondly, if you are targeting iOS devices, consider using Cubiq’s [AddToHome](http://cubiq.org/add-to-home-screen) JS library.  This is an excellent add on that will display instructions for the user to add the application to the iOS home screen, enabling the application to have it’s own icon and run completely full screen when launched.

**Don’t go creating your own username and password database**

Have users sign on to your application can be very useful for security of the application and for storing preferences and other settings.  Unless you have a very strong reason however, I recommend that you avoid creating your own username and password database for your application.  Doing so can seem really easy at first, but as your application gets more popular you'll be left with a nightmare situation of having to deal with registration issues, password resets, and all of the other administration that comes with owning your own identity provider.

If you are building a mobile web application for the enterprise, I suspect you'll already be thinking about this – either hooking in to an existing Active Directory instance or other identity provider (although you'll likely need to consider how this will work outside the firewall when your mobile users are accessing your application via a public connection).

If you are building a public-facing application however, an efficient solution can be to federate with an existing identity provider.  Chances are your users already have a Google, Yahoo, or Facebook account.  Why not take advantage of this and use this sign-in information to authenticate the user for your application?  This can be done in a couple of different ways – either with a native SDK from one of the providers – or using a federated service such as Microsoft Azure’s [Access Control Service](http://acs.codeplex.com/).  This is a simple service to setup, which will enable you to configure a list of providers and returns a bag of claims to your application which you can use to match up with a list of settings, preferences, etc.  There are a few caveats with this approach, especially as some of the providers return the information via a post back (which can really upset your mobile application if you've pre-fetched all of the pages in to the DOM beforehand).  This is something that I've written previously about in [this post](http://simonguest.com/2011/08/13/authenticating-with-google-facebook-and-others-from-your-jquerymobile-application/).

**Make your Mobile Web application perform well**

It might sound obvious, but if you want your Mobile Web application to come anywhere near to the performance of a native application, you'll want to keep a keen eye on performance.  Generally, I've found there are three main causes of bad performance in Mobile Web applications:

First is server-side generation of the UI and round tripping (as discussed in the point on client-side JavaScript earlier).  If you are generating any of the UI on the server-side or making any synchronous server-side calls, you are more than likely to run in to trouble.

Second is too many CSS effects/transitions.  Many of the UI frameworks, including jQuery Mobile, include several page transitions for when the user navigates between different pages.  Unless you are exclusively targeting iOS devices, I would recommend turning all of these off.  Many of the older Android devices don’t implement a version of Webkit that supports hardware acceleration – plus they are running on less capable hardware – so to avoid creating an application that stutters on Android devices, it’s best to disable any transitions and effects.

Finally, watch out for too many registered JavaScript events (especially on the class level).  The JavaScript performance on mobile browsers can be much lower than desktop equivalents, and if you are not careful you can end up where the performance of the browser is being compromised by too many registered events.  Often this will only add 100ms to various events, but combine this with specific events (such as a button tap) that must immediately navigate to another page, any delay over 100ms might be enough that your user thinks that the button wasn’t pressed correctly.  They'll press it again, and before you know it you have two JavaScript navigation events that you'll need to handle.

**Wrapping up**

A bit of a lengthy post, but I hope that this is useful if you are heading down the path of developing Mobile Web applications.  If you'd like more information on this, or maybe to share with colleagues, I've uploaded [this presentation](http://www.slideshare.net/simonguest/top-ten-tips-for-html5mobile-web-development) to SlideShare that goes through the above list in some detail.
