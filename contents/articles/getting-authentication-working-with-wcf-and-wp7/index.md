---
title: Getting Authentication Working with WCF and WP7
author: Simon Guest
date: Wed, 29 Dec 2010 18:29:15 GMT
template: article.jade
---

Although Windows Phone 7 (WP7) has support for a Windows Communication Foundation (WCF) client, connecting to Web services that require authentication can be a little quirky. 

After working on a project over the holidays putting together a WP7 client to connect to a Web service requiring authentication, this is what I found...

<span class="more"></span>

1. NTLM/Kerberos is a no go…

   As of today, the WCF client on WP7 does not support NTLM or Kerberos authentication.  If you are accessing Web services from a device, you’ll want to make sure that the your server  is setup to handle Basic authentication (preferably over SSL).

2. And even Basic authentication needs a helping hand…

   Even with Basic authentication enabled on the server, I was noticing that the client was still not sending the right HTTP headers – even when setting the **ClientCredentials** property on the client and playing with the config file.  No matter what I tried, I couldn’t get it to work.

To overcome this however, you can force the Basic authentication details to be written as part of the request header.  To do this, first create a method that generates a UTF8 encoded string for your domain, username, and password:

```cs
public static string GetCredentials(string domain, string username, string password)
{    
    return Convert.ToBase64String(Encoding.UTF8.GetBytes(String.Format(@"{0}{1}:{2}",domain,username,password)));      
}
```

Then, you’ll need to create a new property with your credentials:

```cs
HttpRequestMessageProperty request = new HttpRequestMessageProperty();
request.Headers[System.Net.HttpRequestHeader.Authorization] = "Basic " + GetCredentials;
```

Finally, add the header to your outgoing request:

```cs
OperationContextScope clientScope = new OperationContextScope(client.InnerChannel);
OperationContext.Current.OutgoingMessageProperties.Add(HttpRequestMessageProperty.Name, request);
```

(in the above client is your service reference)

And voila!  You should now have Basic authentication headers as part of your client requests, and you can access username/password protected Web services from your WP7 device!

One final tip - during all of this you will likely need to use a tool like Fiddler to trace your requests and responses from the device.  If you are having troubles getting Fiddler working with the WP7 emulator, [here](http://phone7.wordpress.com/2010/10/17/fiddler-and-wp7-emulator-working/) is a great post that outlines what to do.