---
title: Easy Event Logging on Windows Azure
author: Simon Guest
date: Wed, 04 Aug 2010 23:42:45 GMT
template: article.jade
---

I’ve been working on an application that has a need to log many events on a Web Role running on Windows Azure.   Effective logging can be difficult to setup.  Do a search, and you’ll find a handful of articles that cover logging to the blobstore, mounting drives to extract the logs, etc. Instead, I wanted an easy way to log custom events and exceptions in my application.  This is how to do it:

<span class="more"></span>

Create a class that inherits from System.Diagnostics.TraceListener. 

```cs
public class AzureTraceListener : TraceListener
{
public static List<String> Events = new List<String>();

    public override void Write(string message)
    {
        Events.Add(message);
    }

    public override void WriteLine(string message)
    {
        Events.Add(message);
    }
}
```

In your web role, add a reference to your custom trace listener.  This is done by adding the following two lines in your OnStart() method.

```cs
AzureTraceListener atl = new AzureTraceListener();
Trace.Listeners.Add(atl);
```
 
In your application, log your events using the Trace.Write(string) method.

To display your events, create a new page called Traceviewer.aspx with the following block of HTML:

```html
<h1>Trace Log</h1>
<% foreach (String eventitem in WebRole1.AzureTraceListener.Events)
   {
       Response.Write("<h4>"+eventitem+"</h4>");
   }
%>
```

That’s it.  Deploy your application and simply call Traceviewer.aspx to look at all of your generated events.