---
title: Authenticating with Google, Facebook, and others from your jQueryMobile Application
author: 
date: Sat, 13 Aug 2011 05:13:20 GMT
template: article.jade
---

In my last post, I showed how to implement authentication using Google, Facebook, etc. for your iOS application – using the [Windows Azure Toolkit for iOS](http:&#x2F;&#x2F;github.com&#x2F;microsoft-dpe).&amp;#160; This works well for iPhone applications written in Objective C, but what if you are developing a Web based mobile applications that span multiple platforms?&amp;#160; Given that everything is using Web pages, you would hope that it would be a little easier, but things can get tricky - especially if you are using jQueryMobile.&amp;#160; 

Having implemented this a couple of times now, here is a rough guide of how to integrate AppFabric ACS (Access Control Service) authentication into a jQueryMobile application. (There is already a ton of documentation of both jQueryMobile and ACS, so I’m assuming that you understand the basics of how these both work).&amp;#160;&amp;#160;&amp;#160; 

**Step 1:&amp;#160; Create your own provider selection screen**

When you first start playing around with using ACS on mobile web browsers, the first thing you&#39;ll notice is that the default login page isn&#39;t that nice.&amp;#160; 

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;08&#x2F;image_thumb.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;08&#x2F;image.png)

While the functionality of logging in will work, users have to pinch zoom to be able to read the buttons, which isn&#39;t a great experience.&amp;#160; It also doesn&#39;t fit in with any jQueryMobile theme that you may have created.&amp;#160; To overcome this, we can create our own provider screen.&amp;#160; 

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;08&#x2F;image_thumb1.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;08&#x2F;image1.png)

To build something similar to the above, I&#39;ve used a jQueryMobile [Dialog](http:&#x2F;&#x2F;jquerymobile.com&#x2F;test&#x2F;docs&#x2F;pages&#x2F;dialog-alt.html) (which has an automatic border as well as a background effect).&amp;#160; The basic code for the screen looks like the following:
  &lt;pre class=&quot;brush:html&quot;&gt;&amp;lt;!DOCTYPE html&amp;gt;
&amp;lt;html&amp;gt;
&amp;lt;head&amp;gt;
    &amp;lt;title&amp;gt;Select Login Provider&amp;lt;&#x2F;title&amp;gt;
&amp;lt;&#x2F;head&amp;gt;
&amp;lt;body&amp;gt;
    &amp;lt;div data-role=&amp;quot;dialog&amp;quot;&amp;gt;
        &amp;lt;div data-role=&amp;quot;header&amp;quot;&amp;gt;
            &amp;lt;h1&amp;gt;Select Login Provider&amp;lt;&#x2F;h1&amp;gt;
        &amp;lt;&#x2F;div&amp;gt;
        &amp;lt;div data-role=&amp;quot;content&amp;quot;&amp;gt;
            @{
                if (ViewBag.JSONProviders != null)
                    {
                    var providers = Json.Decode(ViewBag.JSONProviders);
                    foreach (var provider in providers)
                    {
                        &amp;lt;button type=&amp;quot;button&amp;quot; onclick=&amp;quot;javascript:window.location.href=&#39;@provider.LoginUrl&#39;&amp;quot;&amp;gt;@provider.Name&amp;lt;&#x2F;button&amp;gt;
                    }
                }
            }
        &amp;lt;&#x2F;div&amp;gt;
    &amp;lt;&#x2F;div&amp;gt;
&amp;lt;&#x2F;body&amp;gt;
&amp;lt;&#x2F;html&amp;gt;&lt;&#x2F;pre&gt;

As you can see from the above, the form is built by parsing a JSON object containing a list of identity providers and creating buttons for each provider – setting a name for a button and setting an on click action to the URL.&amp;#160; (The above code uses the Razor-based syntax for&amp;#160; ASP.NET MVC, but the same will work just by using JSON calls in regular Javascript).&amp;#160; 

Two things to note here:

1.&amp;#160; It&#39;s really important to use **window.location.href** instead of an &amp;lt;a&amp;gt; anchor when linking to the provider – otherwise you&#39;ll break the AJAX model of your jQueryMobile app and a new browser window will be launched (which looks horrible, especially in full screen web applications).

2.&amp;#160; You are probably asking yourself where the JSON objects actually come from.&amp;#160; This brings us to our next point…

**Step 2:&amp;#160; Make a call to the ACS JSON endpoint**

The buttons in the form are based on identity providers, which you likely setup when you configured ACS.&amp;#160; These providers can be extracted as JSON objects using a JSON based endpoint that the ACS service providers.&amp;#160; 

Here&#39;s the URL of the JSON endpoint for ACS v2.

[https:&#x2F;&#x2F;{0}.accesscontrol.windows.net&#x2F;v2&#x2F;metadata&#x2F;IdentityProviders.js?protocol=wsfederation&amp;amp;realm={1}&amp;amp;reply_to={2}&amp;amp;context=&amp;amp;request_id=&amp;amp;version=1.0](https:&#x2F;&#x2F;{0}.accesscontrol.windows.net&#x2F;v2&#x2F;metadata&#x2F;IdentityProviders.js?protocol=wsfederation&amp;amp;realm={1}&amp;amp;reply_to={2}&amp;amp;context=&amp;amp;request_id=&amp;amp;version=1.0)

{0} is the namespace of your ACS service

{1} is the realm within your ACS service

{2} is an optional URL (which must be HTML encoded) that specifies where to return the browser once authentication has been completed.&amp;#160; Remember, if you are using AJAX navigation, then you&#39;ll want to pass in the correct #-prefixed syntax.&amp;#160; For example a return URL of the following:

[http:&#x2F;&#x2F;localhost&#x2F;MyWebApp#&#x2F;MyWebApp&#x2F;Accounts](http:&#x2F;&#x2F;localhost&#x2F;MyWebApp#&#x2F;MyWebApp&#x2F;Accounts)

Will instruct the ACS service to return to the Accounts page in your jQueryMobile app.

Again, you can make the call to the JSON endpoint using Javascript, or if you are using ASP.NET MVC like in Step 1 I would recommend creating a controller action called Providers which passes the return JSON object in a ViewBag.&amp;#160; 

**Step 3:&amp;#160; Launch the providers screen from your app**

Finally, once you have your provider screen created, you&#39;ll need to call it when authentication is required.&amp;#160; There are a couple of different ways of doing this – if you are using Javascript only, then create and maintain a variable called claims – which corresponds to the claims bag returned from the service (when the ACS service returns it does a post back to your application so that you can capture the claims).&amp;#160; Secondly, if you are using ASP.NET MVC then you can create a second action on the Account controller called claims with something similar to the following:

&lt;pre class=&quot;brush:csharp&quot;&gt;

public JsonResult Claims()

{

&amp;#160;&amp;#160;&amp;#160; return Json(string.Join(&amp;quot;n&amp;quot;, ((IClaimsIdentity)this.User.Identity).Claims.Select(c =&amp;gt; c.ClaimType + &amp;quot;: &amp;quot; + c.Value).ToArray()));

}
&lt;&#x2F;pre&gt;

This will return the claims bag directly from the User.Identity property from the controller.

Well, just a short overview, but if you are thinking of implementing Google and Facebook authentication in your jQueryMobile application, hopefully this has been of some help.
