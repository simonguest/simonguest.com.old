---
title: Bluetooth Issues on Mavericks
author: Simon Guest
date: Fri, 28 Mar 2014 23:32:02 GMT
template: article.jade
---

I've been having some issues recently with the Bluetooth stack on my Mac acting strangely - causing Bluetooth devices to drop at random times and on occasions, the default mouse and keyboard will stop working even though the machine is running fine. One of the symptoms of this has been the bluetooth preferences pane showing “do not localize” when things become corrupt.

I think (well, I hope) I've solved it by performing an SMC and NVRAM reset on the Mac. In case other are seeing similar symptoms, I wanted to share how you do these resets:

**SMC Reset:** Power down the Mac. Hold down Shift-Control-Option and the power button for a few seconds. Not much will happen. Release all of the keys, and power on normally.

**NVRAM Reset:** Power down the Mac. Hold Command, P and R down and power on the Mac. The Mac will boot for a few seconds and then reboot. Release all of the keys at this point, and boot normally.

After doing these resets, the Bluetooth stack seems a lot more stable.
