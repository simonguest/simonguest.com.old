---
title: Working with the Windows Azure Toolkit for Android
author: 
date: Fri, 21 Oct 2011 15:16:18 GMT
template: article.jade
---

&lt;small&gt;At the end of August, Microsoft &lt;&#x2F;small&gt;[&lt;small&gt;published&lt;&#x2F;small&gt;](http:&#x2F;&#x2F;www.zdnet.com&#x2F;blog&#x2F;microsoft&#x2F;microsoft-rolls-out-windows-azure-toolkit-for-android&#x2F;10503)&lt;small&gt; the Windows Azure Toolkit for Android. At Neudesic, the partner behind developing the both toolkits for iOS and Android, we&#39;ve been working with customers that use the toolkit to connect mobile applications to the cloud. One of the recent requests however has been to provide a walkthrough of getting started with the toolkit. The current build on &lt;&#x2F;small&gt;[&lt;small&gt;GitHub&lt;&#x2F;small&gt;](http:&#x2F;&#x2F;github.com&#x2F;microsoft-dpe)&lt;small&gt; was released for a specific version of Eclipse and the Android tools, and as a result, can be a little challenging getting the library and sample code up and running.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;In this post, I&#39;ll explain what it takes to download the toolkit, create a brand new environment in Eclipse, and get started quickly with the toolkit.
&lt;&#x2F;small&gt; **&lt;small&gt; &lt;&#x2F;small&gt;**
**&lt;small&gt;Getting Started – What You&#39;ll Need&lt;&#x2F;small&gt;**&lt;small&gt;
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Firstly, there is a list of tools that you&#39;ll need to download.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;1\. &lt;&#x2F;small&gt;**&lt;small&gt;Eclipse.&lt;&#x2F;small&gt;**&lt;small&gt; Download from http:&#x2F;&#x2F;eclipse.org – we&#39;ll be using Helios in this tutorial.
&lt;&#x2F;small&gt;
&lt;small&gt;2\. &lt;&#x2F;small&gt;**&lt;small&gt;JDK. &lt;&#x2F;small&gt;**&lt;small&gt; We&#39;ll be using the default that ships with Mac OSX, but if you are on a PC, you&#39;ll need JDK 1.6 or higher.
&lt;&#x2F;small&gt;
&lt;small&gt;3\. &lt;&#x2F;small&gt;**&lt;small&gt;Android SDK and Eclipse Tooling.&lt;&#x2F;small&gt;**&lt;small&gt; Download the Android SDK from http:&#x2F;&#x2F;developer.android.com (we are using r14 for this walkthrough). Also follow the instructions for configuring the Android tooling within Eclipse. After you have installed everything, use the AVD manager to setup a new AVD for an Android 2.3.3 device.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
**&lt;small&gt;Setting Up the Library in Eclipse
&lt;&#x2F;small&gt;** **&lt;small&gt; &lt;&#x2F;small&gt;**
&lt;small&gt;To import and build the library in Eclipse, perform the following steps.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;1\. Download the Windows Azure Toolkit for Android from GitHub. If you have the Git client installed, you can use this command:
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;git clone https:&#x2F;&#x2F;github.com&#x2F;microsoft-dpe&#x2F;wa-toolkit-android
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;Otherwise, go to the site and pull down the zip file of the repo.
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;2\. Create a new directory for your Eclipse workspace:
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;mkdir wa-toolkit-android-workspace
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;3\. Launch Eclipse, and point the default workspace to this newly created directory:
&lt;&#x2F;small&gt; &lt;small&gt; &lt;&#x2F;small&gt;
&lt;small&gt;![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234031.jpg)&lt;&#x2F;small&gt;&lt;small&gt;￼&lt;&#x2F;small&gt;

1.  Create a new Android project called **AzureLibrary**, set the target to Android 2.3.3, use **com.microsoft.cloud.android** as the package name, but do not create an activity or test project.
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234174.jpg)

1.  Right click on the AzureLibrary project and select **Import**. Choose **General** &#x2F; **File System** as the import source, and click on **Next**.
2.  Browse to the &#x2F;library&#x2F;src&#x2F;com folder in the toolkit folder that you downloaded from GitHub.
3.  Click on the **Browse (into folder) **button and select the src folder under your project. Expand the **src** folder, and check the **com **folder as shown in this screenshot:
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234318.jpg)

1.  Click on the Finish button. The import will complete.
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234368.jpg)

1.  Right click on the project, select properties, and change the Java compiler version from 1.5 to 1.6\. (The default is 1.5, yet the toolkit uses many constructs only supported in 1.6)
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234440.jpg)

1.  Click OK, and say **yes** to rebuilding the project. The project should now build with no errors.
2.  Assuming everything builds correctly, right click on the project, and select Properties again. Go to the Android setting, and click on the **Is Library** check box.
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234507.jpg)

**Setting Up the Sample Application in Eclipse
**

To import and build the sample application in Eclipse, perform the following steps:

1.  Create a new Android project called **AzureSample**. Select Android 2.3.3, set the namespace to **com.windowsazure.samples.sample**, and choose not to create an activity.
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234644.jpg)

1.  As you did with the library, right click on the project, and select **Import**. Select the **&#x2F;samples&#x2F;simple&#x2F;src** as the source and import into the **AzureSample&#x2F;src** folder.
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234748.jpg)

1.  Right click on the project, select **Properties**, select **Android** and add a reference to the **AzureLibrary** project:
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234806.jpg)

1.  Right click on the project, select **Import**. Import from the **&#x2F;samples&#x2F;simple&#x2F;res** folder into the **AzureSample&#x2F;res** folder. This will import the resources required for the sample application.
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234884.jpg)

Answer **yes **when prompted to overwrite the **main.xml** file.

1.  Right click on project, select **Import** and select the file system again. Select the **AndroidManifest.xml** from the root of the source directory and import into the root of the destination project.
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319234988.jpg)

The Sample project should now build with no errors.

**
**
**Configuring your Windows Azure Account Name and Key
**

In order to setup the sample project, you need to supply your account name and key, as provided by Windows Azure. You can obtain this by logging into the Windows Azure Portal (http:&#x2F;&#x2F;windows.azure.com) and navigating to Storage Accounts to obtain the details.

When you have the name and key, perform the following:

1.  In the sample project, open **ProxySelector.java** from the **src&#x2F;com.windowsazure.samples.sample** package.
2.  At the top of the file replace the **ACCOUNT** and **ACCESS_KEY** values with the account name and access key for your Azure storage account.
&amp;nbsp;

**Running the Sample****
**
1\. To run the sample, right click on the sample project, select **Run As &#x2F; Android Application.**

1.  Once the emulator is up and running, unlock the device.
2.  Refer to the LogCat&#x2F;Console window in Eclipse if there are any errors.
3.  Click on the Start button in the sample application.
4.  Select either table, blob, or queue storage and browse the storage associated with your Windows Azure account.
![myWPEdit Image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;10&#x2F;myWPEdit_Image_1319235204.jpg)

That’s it! Your sample application is now up and running, and you are able to browse Windows Azure storage!
