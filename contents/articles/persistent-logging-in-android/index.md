---
title: Persistent Logging in Android
author: 
date: Wed, 03 Jul 2013 14:39:03 GMT
template: article.jade
---

No code is perfect, but the nasty types of bugs are the ones that happen randomly and infrequently.  On a couple of recent Android projects we've been experiencing such bugs, and as you can guess they can be difficult to track them down.

While Android's logcat can help, using the tool often means that you need the device connected through ADB and a USB cable in order to track the events.  While this is useful in development, this doesn't work so well when debugging applications that are running on devices in the field.

Rather than setting up your own logging application or service, it's possible to setup logcat to persistently log to a file on the device or SD card.  To do this, simply open an ADB Shell and run logcat as a background process with the -f option:

```
adb shell
# logcat -f /mnt/sdcard/extsd/logcat.txt &
```

As you can see in the above statement, this will create a new logcat process to persistently log every event to a file called logcat.txt on the SD card.  To kill logcat, simply find the PID through the ps tool, and kill the process.

In case you are worried about the size of the log files, logcat also has the ability to do log recycling:

```
adb shell
# logcat -r 1024 -n 10 -f /mnt/sdcard/extsd/logcat.txt &
```

This command will create up to 10 logcat.txt files on the SD card (named logcat.txt.1, logcat.txt.2, logcat.txt.3, etc.) up to 1Mb in size.  Once the end of the 10th file is reached, it will overwrite the first.

Finally, this is all great - but if the user reboots the device, the logcat process will be terminated.  To overcome this, simply edit the /init.rc file and add the following:

```
service logcat -r 1024 -n 10 -f /mnt/sdcard/extsd/logcat.txt
    oneshot
```

Hope this helps, and happy logging!
