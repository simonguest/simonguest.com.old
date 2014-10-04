---
title: Getting Authentication Working with WCF and WP7
author: 
date: Wed, 29 Dec 2010 18:29:15 GMT
template: article.jade
---

Although Windows Phone 7 (WP7) has support for a Windows Communication Foundation (WCF) client, connecting to Web services that require authentication can be a little quirky.&amp;#160; 

After working on a project over the holidays putting together a WP7 client to connect to a Web service requiring authentication, this is what I found:

1.&amp;#160; NTLM&#x2F;Kerberos is a no go…

As of today, the WCF client on WP7 does not support NTLM or Kerberos authentication.&amp;#160; If you are accessing Web services from a device, you’ll want to make sure that the your server&amp;#160; is setup to handle Basic authentication (preferably over SSL).

2.&amp;#160; And even Basic authentication needs a helping hand…

Even with Basic authentication enabled on the server, I was noticing that the client was still not sending the right HTTP headers – even when setting the **ClientCredentials** property on the client and playing with the config file.&amp;#160; No matter what I tried, I couldn’t get it to work.

To overcome this however, you can force the Basic authentication details to be written as part of the request header.&amp;#160; To do this, first create a method that generates a UTF8 encoded string for your domain, username, and password:
  &lt;pre class=&quot;brush:c-sharp&quot;&gt;

public static string GetCredentials(string domain, string username, string password)

{&amp;#160;&amp;#160;&amp;#160;&amp;#160; 

    return Convert.ToBase64String(Encoding.UTF8.GetBytes(String.Format(@&amp;quot;{0}{1}:{2}&amp;quot;,domain,username,password)));&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160; 
}
&lt;&#x2F;pre&gt;

Then, you’ll need to create a new property with your credentials:

&lt;pre class=&quot;brush:c-sharp&quot;&gt;

HttpRequestMessageProperty request = new HttpRequestMessageProperty();
request.Headers[System.Net.HttpRequestHeader.Authorization] = &amp;quot;Basic &amp;quot; + GetCredentials;
&lt;&#x2F;pre&gt;

Finally, add the header to your outgoing request:

&lt;pre class=&quot;brush:c-sharp&quot;&gt;

OperationContextScope clientScope = new OperationContextScope(client.InnerChannel);
OperationContext.Current.OutgoingMessageProperties.Add(HttpRequestMessageProperty.Name, request);
&lt;&#x2F;pre&gt;

(in the above client is your service reference)

And voila!&amp;#160; You should now have Basic authentication headers as part of your client requests, and you can access username&#x2F;password protected Web services from your WP7 device!

One final tip - during all of this you will likely need to use a tool like Fiddler to trace your requests and responses from the device.&amp;#160; If you are having troubles getting Fiddler working with the WP7 emulator, [here](http:&#x2F;&#x2F;phone7.wordpress.com&#x2F;2010&#x2F;10&#x2F;17&#x2F;fiddler-and-wp7-emulator-working&#x2F;) is a great post that outlines what to do.
