---
title: Easy Event Logging on Windows Azure
author: 
date: Wed, 04 Aug 2010 23:42:45 GMT
template: article.jade
---

I’ve been working on an application that has a need to log many events on a Web Role running on Windows Azure.&amp;#160;&amp;#160; Effective logging can be difficult to setup.&amp;#160; Do a search, and you’ll find a handful of articles that cover logging to the blobstore, mounting drives to extract the logs, etc.&amp;#160; 

Instead, I wanted an easy way to log custom events and exceptions in my application.&amp;#160; This is how to do it:

1\. Create a class that inherits from System.Diagnostics.TraceListener.&amp;#160; 
  &lt;pre class=&quot;brush:c-sharp&quot;&gt;

public class AzureTraceListener : TraceListener   

{    

public static List&amp;lt;String&amp;gt; Events = new List&amp;lt;String&amp;gt;(); 

&amp;#160;&amp;#160;&amp;#160; public override void Write(string message)   
&amp;#160;&amp;#160;&amp;#160; {    
&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160; Events.Add(message);    
&amp;#160;&amp;#160;&amp;#160; } 

&amp;#160;&amp;#160;&amp;#160; public override void WriteLine(string message)   
&amp;#160;&amp;#160;&amp;#160; {    
&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160; Events.Add(message);    
&amp;#160;&amp;#160;&amp;#160; }  

} 
&lt;&#x2F;pre&gt;
2.&amp;#160; In your web role, add a reference to your custom trace listener.&amp;#160; This is done by adding the following two lines in your OnStart() method.

&lt;pre class=&quot;brush:c-sharp&quot;&gt;

AzureTraceListener atl = new AzureTraceListener();   
Trace.Listeners.Add(atl);

&amp;#160;
&lt;&#x2F;pre&gt;
3.&amp;#160; In your application, log your events using the Trace.Write(string) method.

4.&amp;#160; To display your events, create a new page called Traceviewer.aspx with the following block of HTML:

&lt;pre class=&quot;brush:html&quot;&gt;

&amp;lt;h1&amp;gt;Trace Log&amp;lt;&#x2F;h1&amp;gt;   
&amp;lt;% foreach (String eventitem in WebRole1.AzureTraceListener.Events)     
&amp;#160;&amp;#160; {     
&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160; Response.Write(&amp;quot;&amp;lt;h4&amp;gt;&amp;quot;+eventitem+&amp;quot;&amp;lt;&#x2F;h4&amp;gt;&amp;quot;);    
&amp;#160;&amp;#160; } 
%&amp;gt;
&lt;&#x2F;pre&gt;

That’s it.&amp;#160; Deploy your application and simply call Traceviewer.aspx to look at all of your generated events.
