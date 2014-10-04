---
title: Using Apple Push Notifications from Windows Azure
author: 
date: Thu, 21 Apr 2011 22:24:17 GMT
template: article.jade
---

In my [MIX11 session](http:&#x2F;&#x2F;channel9.msdn.com&#x2F;events&#x2F;MIX&#x2F;MIX11&#x2F;EXT18) last week I demonstrated how to create push notifications to iPhone and iPad devices from Wndows Azure.&amp;nbsp; I’ve put together this blog post to share more detail and the source code for how this works.

Firstly, if you haven’t already, you will need to register your iPhone&#x2F;iPad application for push notifications.&amp;nbsp; To do this, log into the iOS developer center (you’ll need to be a registered Apple Developer) and in the provisioning portal setup a new App ID, enabling it for push notifications.&amp;nbsp; Here’s the App ID for my MIX demo:

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;04&#x2F;image_thumb.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;04&#x2F;image.png)

With the development certificate that you downloaded during this process, create a new Azure worker role and import the certificate into a folder called “certs”:&amp;nbsp; In addition, you’ll need to configure the properties of the certificate file such that the build action is set to “Content”.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;04&#x2F;image_thumb1.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;04&#x2F;image1.png)

(I’ve deliberately skimmed over the previous points of creating and App ID and Azure Worker role as they are both well documented by Apple and Microsoft).

&amp;nbsp;

To start configuring the worker role for push notifications, first add a reference to the Windows Azure Storage Client (Microsoft.WindowsAzure.StorageClient) library.&amp;nbsp; In the OnRun section of the worker role, access the Azure queue that messages are going to be placed in.&amp;nbsp; 
&lt;pre class=&quot;brush:c-sharp&quot;&gt;StorageCredentials creds = new StorageCredentialsAccountAndKey(&quot;YOUR ACCOUNT NAME&quot;, &quot;YOUR ACCOUNT KEY&quot;);

CloudQueueClient cqc = new CloudQueueClient(&quot;&quot;YOUR QUEUE URL”, creds);

var testQueue = cqc.ListQueues().First(q =&amp;gt; q.Name.StartsWith(&quot;YOUR QUEUE NAME&quot;));&lt;&#x2F;pre&gt;

Then, still within the OnRun method, create a routine that checks the queue for incoming messages and sets up the connection to the APN (Apple Push Notification) service.

&lt;pre class=&quot;brush:c-sharp&quot;&gt;while (true)
            {
                Thread.Sleep(10000);

                if (testQueue.RetrieveApproximateMessageCount() != 0)
                {

                    List&lt;cloudqueuemessage&gt; messages = testQueue.GetMessages(testQueue.RetrieveApproximateMessageCount()).ToList();
                    foreach (CloudQueueMessage message in messages)
                    {
                        Trace.WriteLine(&quot;Retrieved message from Queue: &quot; + message.AsString);
                        &#x2F;&#x2F; open the APN connection
                        InitializeAPN();
                        &#x2F;&#x2F; send message
                        string session = message.AsString.Substring(0, message.AsString.IndexOf(&#39;:&#39;));
                        SendAPNMessage(message.AsString, session);
                        &#x2F;&#x2F; tear down the APN connection
                        CloseAPN();

                        testQueue.DeleteMessage(message);
                    }
                }
            }
&lt;&#x2F;pre&gt;

&lt;p&gt;You’ll probably want to do something a little more elegant than “while (true)” but this works for the purposes of this post.&amp;nbsp; Also, as I mentioned in the talk, you may or may not want to setup and tear down the connection to the APN for each message that you send.&amp;nbsp; If you are planning to send a large volume of messages to a large number of devices, Apple may view this as a denial of service attack and refuse your connection.&amp;nbsp; A more prescriptive approach in this scenario would be to instead open the connection in the OnStart method and keep it alive during OnRun.

Within the worker role, setup the following declarations.&amp;nbsp; Most of these should be straightforward, and you’ll need to replace a number of them with your own details.&amp;nbsp; 
&lt;pre class=&quot;brush:c-sharp&quot;&gt;private static string HOST = &quot;gateway.sandbox.push.apple.com&quot;;

private static int PORT = 2195;

private static string CERT_PASSWORD = &quot;YOUR PASSWORD&quot;;

private static X509Certificate2 CLIENT_CERT = new X509Certificate2(Environment.GetEnvironmentVariable(&quot;RoleRoot&quot;) + @&quot;approotcertsmix11_dev_cert.p12&quot;, CERT_PASSWORD);

private static X509Certificate2Collection CLIENT_CERT_COLLECTION = new X509Certificate2Collection(CLIENT_CERT);

private static string DEVICE_TOKEN = &quot;YOUR DEVICE TOKEN&quot;;&amp;nbsp; &#x2F;&#x2F;Replace this with the Device token we obtain later on in this example

private TcpClient client;

private SslStream sslStream;
&lt;&#x2F;pre&gt;

With these declarations in place, we can now start writing the APN code.&amp;nbsp; First, create an IntializeAPN method, responsible for setting up the connection to the APN.
&lt;pre class=&quot;brush:c-sharp&quot;&gt;private void InitializeAPN()

{

&amp;nbsp;&amp;nbsp;&amp;nbsp; client = new TcpClient(HOST, PORT);

&amp;nbsp;&amp;nbsp;&amp;nbsp; sslStream = new SslStream(client.GetStream(), false);

&amp;nbsp;&amp;nbsp;&amp;nbsp; try

&amp;nbsp;&amp;nbsp;&amp;nbsp; {

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; sslStream.AuthenticateAsClient(HOST, CLIENT_CERT_COLLECTION, SslProtocols.Tls, false);

&amp;nbsp;&amp;nbsp;&amp;nbsp; }

&amp;nbsp;&amp;nbsp;&amp;nbsp; catch (AuthenticationException ex)

&amp;nbsp;&amp;nbsp;&amp;nbsp; {

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; Trace.WriteLine(&quot;Could not open APN connection: &quot; + ex.ToString());

&amp;nbsp;&amp;nbsp;&amp;nbsp; }

&amp;nbsp;&amp;nbsp;&amp;nbsp; Trace.WriteLine(&quot;APN connection opened successfully.&quot;);

}

&lt;&#x2F;pre&gt;

Then, create a method called SendAPNMessage which will construct and sent the push notification message in the correct format.&amp;nbsp; 
&lt;pre class=&quot;brush:c-sharp&quot;&gt;private void SendAPNMessage(string message, string session)

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; {

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; try

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; {

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; MemoryStream memoryStream = new MemoryStream();

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; BinaryWriter binaryWriter = new BinaryWriter(memoryStream);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; &#x2F;&#x2F; construct the message

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; binaryWriter.Write((byte)0);&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; binaryWriter.Write((byte)0);&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; binaryWriter.Write((byte)32); 

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; &#x2F;&#x2F; convert to hex and write

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; byte[] deviceToken = new byte[DEVICE_TOKEN.Length &#x2F; 2];

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; for (int i = 0; i &amp;lt; deviceToken.Length; i++)

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; deviceToken[i] = byte.Parse(DEVICE_TOKEN.Substring(i * 2, 2), System.Globalization.NumberStyles.HexNumber);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; binaryWriter.Write(deviceToken);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; &#x2F;&#x2F; construct payload within JSON message framework

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; String payload = &quot;{&quot;aps&quot;:{&quot;alert&quot;:&quot;&quot; + message + &quot;&quot;,&quot;session&quot;:&quot;&quot;+session+&quot;&quot;,&quot;badge&quot;:1}}&quot;;

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; &#x2F;&#x2F; write payload data

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; binaryWriter.Write((byte)0);&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; binaryWriter.Write((byte)payload.Length);&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; byte[] payloadBytes = System.Text.Encoding.UTF8.GetBytes(payload);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; binaryWriter.Write(payloadBytes);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; binaryWriter.Flush();

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; &#x2F;&#x2F; send across the wire

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; byte[] array = memoryStream.ToArray();

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; sslStream.Write(array);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; sslStream.Flush();

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; }

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; catch (Exception ex)

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; {

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; Trace.WriteLine(ex.ToString());

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; }

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; Trace.WriteLine(&quot;Message successfully sent.&quot;);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; }
&lt;&#x2F;pre&gt;

You’ll notice that my SendAPNMessage method signature contains a “session” value.&amp;nbsp; For the purposes of the demo, I was sending across the session code that had changed as an explicit value in the notification message.&amp;nbsp; Feel free to change or remove this as you need.

Finally, the close method is called to close the connection.
&lt;pre class=&quot;brush:c-sharp&quot;&gt;private void CloseAPN()

{

&amp;nbsp;&amp;nbsp;&amp;nbsp; client.Close();

}&lt;&#x2F;pre&gt;

At this point, you might be wondering how you obtain the DEVICE_TOKEN value for the above.&amp;nbsp; This is not the UDID of the device, but instead a separate token that is generated by the phone itself.&amp;nbsp; To get this token, and to handle incoming push notifications, let’s turn our attention to the XCode project.&amp;nbsp; For my demo I was receiving push notifications within a [PhoneGap](http:&#x2F;&#x2F;www.phonegap.com) application, but this code will work equally in a regular native client application.

First, we need to instruct the application to register for APN messages.&amp;nbsp; This is done using the registerForRemoteNotificationTypes method.&amp;nbsp; You’ll need to call this method when the application first starts up (for PhoneGap projects, this can be in the init method of the AppDelegate).
&lt;pre class=&quot;brush:c&quot;&gt;NSLog(@&quot;Registering for APN&quot;);

[[UIApplication sharedApplication] registerForRemoteNotificationTypes: (UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound)];

&lt;&#x2F;pre&gt;

This method has three callbacks that it can take advantage of.&amp;nbsp; One to indicate that registration was successful (we also get the Device ID from here), one to indicate that something went wrong (e.g. if we are running in the simulator, which doesn’t support push notifications), and one for when we actually receive a message).

The first two are easy to handle:
&lt;pre class=&quot;brush:c&quot;&gt;- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {

&amp;nbsp;&amp;nbsp;&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp; NSString *str = [NSString stringWithFormat:@&quot;Device Token=%@&quot;,deviceToken];

&amp;nbsp;&amp;nbsp;&amp;nbsp; NSLog(@&quot;%@&quot;,str);

}

- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)err {

&amp;nbsp;&amp;nbsp;&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp; NSString *str = [NSString stringWithFormat: @&quot;Error: %@&quot;, err];

&amp;nbsp;&amp;nbsp;&amp;nbsp; NSLog(@&quot;%@&quot;,str);&amp;nbsp;&amp;nbsp;&amp;nbsp; 
}
&lt;&#x2F;pre&gt;

Note how the first method (didRegisterForRemoteNotificationsWithDeviceToken) is where we actually extract the DEVICE_TOKEN string required in the worker role.&amp;nbsp; You’ll have to run this once, and copy and paste appropriately.&amp;nbsp; Of course, in a production environment, we would likely pass this value to the service via a separate call.&amp;nbsp; 

The third callback gets called when the device actually receives a message.
&lt;pre class=&quot;brush:c&quot;&gt;- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {

&amp;nbsp;&amp;nbsp;&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp; for (id key in userInfo) {

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSLog(@&quot;key: %@, value: %@&quot;, key, [userInfo objectForKey:key]);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSString *payload = [NSString stringWithFormat:@&quot;%@&quot;,[userInfo objectForKey:key]];

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; &#x2F;&#x2F; work out the session code from the JSON payload

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSRegularExpression* regex;

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSTextCheckingResult* result;

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSError* error = nil;

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSString* regexStr = @&quot;session = ([^&#39;]*);&quot;;

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSString* value = nil;

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; regex = [NSRegularExpression regularExpressionWithPattern:regexStr options:NSRegularExpressionCaseInsensitive error:&amp;amp;error];

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; result = [regex firstMatchInString:payload options:0 range:NSMakeRange(0, payload.length)];

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; 
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; if(result &amp;amp;&amp;amp; [result numberOfRanges] == 2)

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; {

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSRange r = [result rangeAtIndex:1];

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; value = [payload substringWithRange:r];

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; }

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; if(value)

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; {

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSLog(@&quot;Found session value in payload: %@&quot;,value);

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; NSString* jsString = [NSString stringWithFormat:@&quot;handleOpenURL(&quot;[http:&#x2F;&#x2F;URLHERE.cloudapp.net&#x2F;Session&#x2F;Lookup?session=%@&quot;);&quot;,value];](http:&#x2F;&#x2F;URLHERE.cloudapp.net&#x2F;Session&#x2F;Lookup?session=%@&amp;quot;);&amp;quot;,value];)

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; [webView stringByEvaluatingJavaScriptFromString:jsString];

&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; }

&amp;nbsp;&amp;nbsp;&amp;nbsp; }&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp; 
}

&amp;nbsp;
&lt;&#x2F;pre&gt;

As you can see above, this method parses the payload of the message, tries to work out the session code, and if one is found, creates a new javascript call to a method called handleOpenURL which instructs PhoneGap to call the method of the same name.&amp;nbsp; Of course, you are going to want to configure this for your own scenario, but hopefully this gives you a sense of how to pass a value as part of the message, and then take an action on that accordingly.&amp;nbsp; 

Well, that wraps up this post.&amp;nbsp; I hope you enjoyed the talk at MIX, and that this code is useful if you have services in Windows Azure that have a need to push notification messages to iPhone and iPad devices. 

&lt;pre&gt;&lt;&#x2F;pre&gt;
