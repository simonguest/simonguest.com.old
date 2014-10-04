---
title: Upgrading your Windows Phone 7 to Mango RC
author: 
date: Tue, 23 Aug 2011 21:41:50 GMT
template: article.jade
---

In late July, Microsoft [announced](http:&#x2F;&#x2F;windowsteamblog.com&#x2F;windows_phone&#x2F;b&#x2F;wpdev&#x2F;archive&#x2F;2011&#x2F;07&#x2F;27&#x2F;wpsdk-beta-2-refresh-for-mango-devs.aspx) availability of a new build of Mango, build 7712 – also commonly known as the RC Build.  Given that we are close to RTM, yet it may still take carriers some time before deploying Mango to your device, you might be itching to try out the new bits.  If you are, but don’t know where to start, I’ve put together this quick guide based on my own experience of updating my phone, an AT&amp;amp;T Samsung Focus.  Note: As you would expect, if you do decide to upgrade your phone, this is entirely at your own risk.

Before you begin, you’ll need a few things:

1.  A Windows Phone 7 device with all of the current updates (a.k.a. NoDo) installed.  Double check the updates in the Zune application to make sure everything is up to date.  You should see that your WP7 build number is 7390.

2.  Zune Software 4.7.1404.  Although 4.8 was released yesterday, you won’t be able to do the update with this version (yet).  Download 4.7.1404 from [here](http:&#x2F;&#x2F;www.microsoft.com&#x2F;download&#x2F;en&#x2F;details.aspx?id=23771) if needed.

3.  Windows Phone 7 Support Tools.  You can download this from here ([32bit](http:&#x2F;&#x2F;download.microsoft.com&#x2F;download&#x2F;1&#x2F;5&#x2F;4&#x2F;15427EAF-AD42-4E4A-8179-9A3C5483E366&#x2F;WPSupportTool-x86.msi), [64bit](http:&#x2F;&#x2F;download.microsoft.com&#x2F;download&#x2F;1&#x2F;5&#x2F;4&#x2F;15427EAF-AD42-4E4A-8179-9A3C5483E366&#x2F;WPSupportTool-amd64.msi)).  Run the installer, but you don’t need to run the application.

4.  Enough battery power to get you through several updates (when the phone is updating, your device isn’t being charged).  I would avoid trying this with anything less than 50% charge.

5.  The mango update tools.  If you are a registered Windows Phone 7 developer, you can supposedly download these from the Microsoft Connect site.  If you are not (or like me you are, but couldn’t find the tools on Connect), you can find a version of the tools on [this site](http:&#x2F;&#x2F;windowsphonehacker.com&#x2F;articles&#x2F;how_to_get_mango_beta_2_for_nondevelopers-07-31-11).  (Note:  Follow Step 1, and yes, you have to wait for 45 seconds for the download link to work).

With all of the above in place, run the **Update.bat** from the Mango update tool download.  Assuming there are no errors, you should see something similar to the following.

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;08&#x2F;image_thumb2.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;08&#x2F;image2.png)

Firstly, the tool will make a backup of your device to the c:PreMangoState2 directory, and install the updates necessary for your device to receive the pre-release Mango bits.  The time this will take may vary, but on my machine it took 112 seconds to backup, and 70 seconds to update the device.

Once the batch file completes, and the device reboots, the Zune software should automatically launch.  You’ll be shown that an update is available (likely build 7403).

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;08&#x2F;image_thumb3.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;wp-content&#x2F;uploads&#x2F;2011&#x2F;08&#x2F;image3.png)

Choose to install this, which will then download the Zune 4.8 software.  After the Zune software has been updated, the phone will be updated to 7403, which should be a fairly quick update.

As the phone reboots once more, the Zune software will do another check – and this time will pick up the 7712 build, which is Mango RC.  Choose to download and install this one.  This is where the battery power is important, as this install can take quite a bit of time to complete (let’s just say that I’ve been able to pen this blog post, and it’s still not 75% of the way there!).

Be patient though – one final reboot, and you’ll be running the latest Mango RC (Build 7712) bits!  Enjoy!
