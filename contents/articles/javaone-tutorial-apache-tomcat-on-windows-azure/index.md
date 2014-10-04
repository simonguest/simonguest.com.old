---
title: JavaOne Tutorial Apache Tomcat on Windows Azure
author: 
date: Sat, 18 Sep 2010 15:00:00 GMT
template: article.jade
---

&lt;html xmlns=&quot;&quot;&gt;As I mentioned in [my previous post](http:&#x2F;&#x2F;simonguest.com&#x2F;2010&#x2F;09&#x2F;08&#x2F;speaking-at-javaone-2010&#x2F;), I’ll be participating in a [panel](http:&#x2F;&#x2F;www.eventreg.com&#x2F;cc250&#x2F;sessionDetail.jsp?SID=313962) at JavaOne on Monday.  With a similar format to last year, each panelist is given 5 – 10 minutes before it opens up for general discussion. Rather than showing a bunch of marketing slides, I thought it would be more interesting to put together a short tutorial for running Apache Tomcat on Windows Azure.  When I speak with Java developers interested in Windows Azure, this is often the #1 request.

Here is an overview of what I will be showing:

**Step 1 – What you’ll need to get started**

As you might imagine, you are going to first need a Windows Azure account.  I would recommend going to [www.microsoft.com&#x2F;windowsazure&#x2F;offers](http:&#x2F;&#x2F;www.microsoft.com&#x2F;windowsazure&#x2F;offers) and signing up for the introductory special, which will allow you to test your application for free.  The introductory offer gives you the first 25 hours at no cost, which should be more than enough time to get up and running.

**I****f you are at JavaOne however, **I have a limited quantity (100) of tokens that give you 30 days worth of access with no need to submit any registration or credit card information.  See me at the end of the panel session or throughout the conference, and in exchange for a business card, I’ll be happy to give you one at no cost!

After you have your account, you’ll want to download and install the [Windows Azure SDK](http:&#x2F;&#x2F;go.microsoft.com&#x2F;fwlink&#x2F;?LinkID=130232).  After installation, set your PATH environment to include the location of the SDK binaries (typically _C:Program FilesWindows Azure SDKv1.1bin_).  This is important to ensure that the SDK is accessible from the command line.

Finally, you’ll need to install the [Windows Azure Tomcat Solution Accelerator](http:&#x2F;&#x2F;code.msdn.microsoft.com&#x2F;winazuretomcat).  Feel free to install this in any directory you’d like – I’m using _c:devjavaone2010tomcatazure_ for the purposes of this tutorial.

&lt;p$1$2$3$4$5$6&gt;

**Step 2 – Building and running your site**

With all of the pre-requisites downloaded and installed, it’s time to build and test your site.  To do this, open a command prompt, and navigate to the directory that you chose for the solution accelerator.  From this directory, run **buildme.cmd**.  You’ll be prompted to provide the installation path of your Tomcat installation and a JRE on your machine.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image.png)

After a successful build, run the **runme.cmd** file. This will run Tomcat using the Windows Azure Desktop Execution Tool – also known as the local development fabric.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb1.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image1.png)

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb2.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image2.png)

This is a great way to test that your application is going to work when deployed to production.  Navigate to the URL provided at the end  (replace the tcp with http) to ensure that the Tomcat instance is working correctly on your local machine.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb3.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image3.png)

You can open the development fabric tool (found running in your system tray) if you want to stop and&#x2F;or investigate the service.

&lt;p$1$2$3$4$5$6&gt;

**Step 3 – Packaging and deploying your site**

Once you are satisfied that everything looks good, it’s time to package the application ready for deployment to the cloud.  To do this, run the **packme.cmd **script.  This will invoke the Windows Azure Packaging Tool, and pull together everything needed into one package file for deployment.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb4.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image4.png)

When this has completed, you should see a **Tomcat.cspkg **file and a **ServiceConfiguration.cscfg **file in the directory.  The .cspkg file is quite large as it contains your application, the Tomcat instance, and JRE binaries.  Despite the size, this format makes it convenient if you prefer to use a different version of Tomcat or a different JRE in the future.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb5.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image5.png)

To deploy to the cloud, log on to the portal ([http:&#x2F;&#x2F;windows.azure.com](http:&#x2F;&#x2F;windows.azure.com)) and create a new hosted service.  Walk through the wizard to specify the name, description, URL, and location where you want the service to be deployed.  Next, hit the “Deploy” button and specify the location of the previous package and configuration file.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb6.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image6.png)

You have two options when it comes to deploying – either a file from your local storage (i.e. your local disk) or a file from an Azure storage account (blob storage).  If you have issues with the local storage (many http connections timeout before the package can be uploaded in time), I would recommend using [Neudesic’s Azure Storage Explorer](http:&#x2F;&#x2F;azurestorageexplorer.codeplex.com&#x2F;) to upload your files to a blob storage container.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb7.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image7.png)

Hit _Deploy_, and your package will be uploaded to Windows Azure – this will likely take a few minutes because of the size of the deployment.

Once this has been completed, hit the _Run_ button to bring your site to life.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb8.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image8.png)

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image_thumb9.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2010&#x2F;09&#x2F;image9.png)

Once you have a site up and running, feel free to explore some of the ways that you can either scale your application to multiple nodes or explore some of the [other features](http:&#x2F;&#x2F;www.windowsazure4j.org) on Windows Azure available to Java developers.

&lt;p$1$2$3$4$5$6&gt;

There are many ways that this could be improved by integrating with existing build environments (I think Maven integration would be fascinating), but hopefully this short tutorial gives you a starting point for getting a simple Tomcat site up and running on Windows Azure.
