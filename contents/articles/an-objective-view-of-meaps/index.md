---
title: An Objective View of MEAPs
author: 
date: Tue, 24 Apr 2012 20:45:01 GMT
template: article.jade
---

I recently had the opportunity to put together some research for a customer who has been interested in the MEAP (Mobile Enterprise Application Platform) space.  My premise is that the market has become flooded with MEAPs (Mobile Enterprise Application Platforms, as coined by Gartner), yet most of them are fundamentally taking organizations and developers down the wrong path when it comes to developing mobile applications.  The problem is that MEAPs demo really well in front of the CIO… &amp;ldquo;Wow!  You just hit F5, and your application is compiled and deployed to iOS, Android, Blackberry devices…  Where do I sign?&amp;rdquo; &amp;ndash; yet the reality is very different.  Namely:

**Language Abstraction** – Many MEAPs have their own language that claim to be similar to Java or a flavor of JavaScript.  Even if it is the same language, there is always something new to learn.  Also, developers tend to shy away from learning any language that&amp;rsquo;s vendor specific (APEX on Force.com anyone? ;&amp;ndash;)

**Language Limitations** – When you create a language that abstracts other languages you always end up serving only the lowest common denominator.  Often there are ways of coding styles and nuances supported in the native language that the MEAP won&amp;rsquo;t expose because it&amp;rsquo;s not on other platforms.

**Platform Limitations** – Time has shown that platform abstraction doesn&amp;rsquo;t work (do a search on Wikipedia for cross platform RAD tools if you don&amp;rsquo;t believe me).  Also, platforms change quickly.  What happens if&#x2F;when the next version of iOS is released?  You have to wait for your MEAP vendor to catchup before you can use any of the features.

**UI Limitations** – Following on from the previous point, many of the controls that MEAPs offer also follow the lowest common denominator rule.  For example, Cocoa Touch has a neat feature called a &amp;ldquo;Half Page Curl Transition&amp;rdquo;.  If you abstract your UI to a MEAP vendor, how is this supported on other platforms?  Either a) it&amp;rsquo;s not (so by default you can&amp;rsquo;t use it on iOS), b) you can only use it on iOS (which breaks the promise of a MEAP) or c) it&amp;rsquo;s implemented as a hack job on all platforms. 

**Tooling** – MEAP tooling is often Web based, or bundled as an Eclipse add-on &amp;ndash; but in both cases it often doesn&amp;rsquo;t fit in with the other tools that developers use today (e.g. ALM, refactoring, unit testing, etc.).  Also, many of the MEAP vendors seem to be aiming their toolsets towards business analysts.  When are we going to let this one go?  Business analysts have an important role to play in teams, but they shouldn&amp;rsquo;t be developing UI, and they shouldn&amp;rsquo;t be writing code.

**Debugging** – Let&amp;rsquo;s say you create your application with a MEAP, and then it crashes 1 time in every 10 (i.e. one of those really nasty bugs to find).  What are you going to do?   a) Reach out to Apple?  I suspect they won&amp;rsquo;t help you.  b) Search the web for other people with the same issue?  Could be difficult to find.  c) Pay the MEAP vendor even more money to investigate your issue?  Ah, that&amp;rsquo;s the one…

**Data Abstraction **– Many MEAPs offer connectors to databases, XML files, SAP, etc.  Not only are these costly, but many are just pass-through connectors, so as a developer you don&amp;rsquo;t get any control over the connection.  Want to implement synchronization?  Want to change the formatting or query for better optimization?  Probably not going to be possible.

**Difficult to Extend** – Many MEAPs don&amp;rsquo;t extend very easily.  Found a new JavaScript library that you want to use in your application?  How about a native control that you&#39;d like to display?  Could be tough.  Some MEAPs do offer bridging to native code – but in which case, why not just write the whole thing in native code to start with?

**Vendor Lock In** – The sum of all the above leads to quite the definition of vendor lock in.  Chances are by the time you deploy your first application you&#39;ll be signed up with an expensive support and service agreement, with your developers working on code in a language that they&#39;ll never be able to re-use, on a platform that won&amp;rsquo;t go anywhere.

I&#39;ve extended this into a presentation that you can find below &amp;ndash; which cover the above points in more detail, plus outline some general alternative approaches to creating applications without the dependency on a MEAP framework.

&lt;div style=&quot;width:425px&quot; id=&quot;__ss_12678560&quot;&gt;**[Objective View of MEAPs](http:&#x2F;&#x2F;www.slideshare.net&#x2F;simonguest&#x2F;objective-view-of-meaps &quot;Objective View of MEAPs&quot;)**&lt;object id=&quot;__sse12678560&quot; width=&quot;425&quot; height=&quot;355&quot;&gt;&lt;param name=&quot;movie&quot; value=&quot;http:&#x2F;&#x2F;static.slidesharecdn.com&#x2F;swf&#x2F;ssplayer2.swf?doc=objectiveviewofmeaps-120424223859-phpapp01&amp;stripped_title=objective-view-of-meaps&amp;userName=simonguest&quot; &#x2F;&gt;&lt;param name=&quot;allowFullScreen&quot; value=&quot;true&quot;&#x2F;&gt;&lt;param name=&quot;allowScriptAccess&quot; value=&quot;always&quot;&#x2F;&gt;&lt;param name=&quot;wmode&quot; value=&quot;transparent&quot;&#x2F;&gt;&lt;embed name=&quot;__sse12678560&quot; src=&quot;http:&#x2F;&#x2F;static.slidesharecdn.com&#x2F;swf&#x2F;ssplayer2.swf?doc=objectiveviewofmeaps-120424223859-phpapp01&amp;stripped_title=objective-view-of-meaps&amp;userName=simonguest&quot; type=&quot;application&#x2F;x-shockwave-flash&quot; allowscriptaccess=&quot;always&quot; allowfullscreen=&quot;true&quot; wmode=&quot;transparent&quot; width=&quot;425&quot; height=&quot;355&quot;&gt;&lt;&#x2F;embed&gt;&lt;&#x2F;object&gt;&lt;div style=&quot;padding:5px 0 12px&quot;&gt;View more [presentations](http:&#x2F;&#x2F;www.slideshare.net&#x2F;) from [Simon Guest](http:&#x2F;&#x2F;www.slideshare.net&#x2F;simonguest).&lt;&#x2F;div&gt;&lt;&#x2F;div&gt;

Based on other people&amp;rsquo;s experience with MEAPs, am I missing anything?
