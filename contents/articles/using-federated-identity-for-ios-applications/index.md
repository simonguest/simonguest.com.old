---
title: Using Federated Identity for iOS Applications
author: Simon Guest
date: Mon, 01 Aug 2011 08:45:42 GMT
template: article.jade
---

Last week, Microsoft released v1.2 of the Windows Azure Toolkit for iOS.  As development partner for the toolkit, [Neudesic](http://www.neudesic.com) has been working with several customers on implementing ACS for iPhone and iPad applications.  Due to popular demand, I wanted to share a short overview of how simple it is to get this up and working for your own iOS projects.

<span class="more"></span>

**First, some background…**

Many iPhone and iPad applications have a need to authenticate.  Maybe it's to access sensitive information or record a particular high score against your name.  Implementing an authentication scheme for iOS can however be time consuming and tricky – you often have to create an authentication service, host it, expose the service through REST, and consume it on the device.  And afterwards you are responsible for backing up the user database and dealing with lost passwords, etc.

To help overcome this many applications are now turning to external providers.  For example, to identify yourself when playing Zynga Poker, instead of creating a new account, you simply sign into Facebook (when launching the application for the first time) and the game uses these credentials as you play. This type of sign in method is called federated identity. This prevents Zynga from having to maintain a complex and large set of user accounts and passwords, and also prevents the player from having to remember yet another username and password. 

Adding federated identity to your iPhone or iPad application can be difficult, requiring knowledge of exchange secure tokens with a set of providers, and creating and sending the right OAuth headers in your application.  Removing this difficultly is exactly what we are trying to address in v1.2 of the Windows Azure Toolkit for iOS. 

**Sounds great – how do I use it?**

To implement ACS in your application, you'll first need to access the Windows Azure portal by navigating to [http://windows.azure.com](http://windows.azure.com/) and signing in with your credentials.

![clip_image002](clip_image002.png)

Click on the **Service Bus, Access Control & **Caching menu item and select the **Access Control** menu item under the **AppFabric** folder.  Select an active Windows Azure subscription and click on the **New** button in the toolbar.

![clip_image004](clip_image004.png)

The new service namespace dialog will open.  Ensure that **Access Control** is selected, and enter a unique namespace and country/region for the service.

![clip_image006](clip_image006.png)

The ACS namespace will now be created.  This might take a few minutes.  Wait until the namespace is showing in an **Active** state.

![clip_image008](clip_image008.png)

Once this is complete, highlight the newly created service and click on the **Access Control Service** button in the toolbar.  This will launch the Access Control Service portal.

Within the portal, click on **Identity Providers** and add the identity providers you would like to use for your application.

![clip_image010](clip_image010.png)

The default is Windows Live ID, but you can add other preconfigured providers (such as Google and Yahoo!) as well as external identity systems configured to use WS-Federation.

Once you have added the required providers, click on the **Relying Parties** section of the portal.

![clip_image012](clip_image012.png)

Click on the **Add** button and enter the following information for the relying party application:

**Name** – a given name for your application

**Realm** – a unique ID for your application.  For this walkthrough, we’ll be using uri:wazmobiletoolkit

**Return URL** – you can leave this blank

**Error URL** – you can leave this blank

**Token Format** – select SWT

**Token Lifetime** – Feel free to change the default from 600 seconds.

Select the identity providers that you would like to use, and then under the **Token Signing Settings** section, click on the **Generate** button to create a new symmetric key that will be used for this application.

Finally, click on the **Save** button.  This will create the Relying Party Application.

Next, go into the **Rule Groups** section of the portal and select the default rule group that was created for the application.

![clip_image014](clip_image014.png)

Click on the **Generate** link in order to generate a set of default rules for this rule group.

![clip_image016](clip_image016.png)

Select the providers that you wish to use, and click on the **Generate** button.  Once this is complete, you should see a set of rules.

![clip_image018](clip_image018.png)

After this step is complete, ACS has now been configured correctly to be used with your iOS application.  Make a note of your Service Namespace (found at the top of the portal) and Realm.

**Ok, the service is now setup.  How do I use it in my Xcode project?**

To start, launch Xcode (4.02 or higher) and create a new project.

![clip_image020](clip_image020.png)

From the project template dialog, select a **View-based application** and click on the **Next** button.  Enter a **Product Name** and **Company Identifier** and click on the **Next** button to continue.  Select a directory to use for the project file and return to the IDE.

Next, download the latest version of the Windows Azure Toolkit for iOS library from [http://github.com/microsoft-dpe/watoolkitios-lib](http://github.com/microsoft-dpe/watoolkitios-lib). In the download will be a zip file containing two versions of the library (one for the device, one for the simulator) and some header files for the project.

Right click on your project and select the **Add Files to…** menu option.

![clip_image022](clip_image022.png)

Locate the .a file (for the simulator) and header files and add them to your project.  You may want to create a new group (called lib) to store these in.

![clip_image024](clip_image024.png)

Now we need to add a reference to a library required for XML parsing.  To do this, click on the top most project file, click on the target in the 2nd column of the IDE, and select **Build Phases** from the tab menu.

![clip_image026](clip_image026.png)

In the main window, expand the **Link Binary with Libraries** option.

Ensure that the libwatoolkitios.a file has been automatically added as a reference, click the + button to add a new library, and select the libxml2.dylib library from the drop down list.

![clip_image028](clip_image028.png)

Click on the **Add** button to add a reference to this library for your project.

Before we start adding any code, we need to add a couple of required linker flags to the project.  To do this, click on the **Build Settings** tab (next to Build Phases).

In the search box, type “other linker” to filter the settings.

![clip_image030](clip_image030.png)

You should see a setting called **Other Linker Flags**.  Double click on the right side of this row to add new flags.

Click on the + button to add two flags.  The first is **–ObjC** and the second is **–all_load**.  Once complete, your linker flags should look like the following screenshot:

![clip_image032](clip_image032.png)

Click on the **Done** button to save these settings.  The project is now configured correctly to reference the Windows Azure Toolkit library.

To test that the library works, click on the project’s **[ProjectName]AppDelegate.m** file.  Add the following #import statement at the top of the class:

```objectivec
#import "WACloudAccessControlClient.h"
```

Next, search for a method called **didFinishLaunchingWithOptions **and after the **[self.window makeKeyAndVisible]** line, enter the following code.

```objectivec
NSLog(@"Intializing the Access Control Client...");
WACloudAccessControlClient *acsClient = [WACloudAccessControlClient accessControlClientForNamespace:@"iostest-walkthrough" realm:@"uri:wazmobiletoolkit"];
[acsClient showInViewController:self.viewController allowsClose:NO withCompletionHandler:^(BOOL authenticated) {
    if (!authenticated)
    {
        NSLog(@"Error authenticating");
    }
    else
    {
        NSLog(@"Creating the authentication token...");
        WACloudAccessToken *token = [WACloudAccessControlClient sharedToken];
        /* Do something with the token here! */
    }
}];
```

Replace the namespace and realm in the first line with the service namespace and realm for your own service.

As you can see from the above, the code creates a new instance of the access control client, requests that the client shows itself in the current view controller, and then extracts a token.

Build and run the application in the iOS Simulator.

Once the application starts, you should be prompted to select an identity provider from the list that you configured in your ACS service.

![clip_image034](clip_image034.png)

Pick one of the providers, and enter a valid set of credentials.

![clip_image036](clip_image036.png)

Click on the **Remember me** checkbox if you want to skip this step when running this application again, and click on the **Sign in** button.

The first time the application is run, you’ll be prompted to authorize the application to access your provider data.

![clip_image038](clip_image038.png)

Click on the **Allow** button to continue.  The login window will now disappear and you’ll be returned to your application.

In the debug window, you should see the following two logs:

```
2011-07-22 10:12:26.284 iostest-walkthrough[25838:207] Intializing the Access Control Client...
2011-07-22 10:12:36.359 iostest-walkthrough[25838:207] Creating the authentication token...
```

If you are seeing this, congratulations!  You've successfully setup federated identity for your application.  The final message indicates that the access token was retrieved and can be used for further use.  The **WACloudAccessToken** (derived from **[WACloudAccessControlClient sharedToken]**) contains an NSDictionary of claims and other properties that can be stored within your application.  Using these properties on future calls can be used to identify returning users to your application.
