---
title: "Fortune and xscreensavers"
date: 2008-04-21
---

One of the coolest commands in Linux is fortune. =)
**$ fortune**
If you don't have fortune installed:
**$ sudo apt-get install fortune-mod fortunes**
The above command will output a random fortune, quote or saying. This command has been around forever and it's one of my favourites. The better email clients will allow you to use the command to append a random quote at the end of your emails.
In the old days of Linux, it would output offensive fortunes as well as the funny or inspirational. Ubuntu has seperated the offensive fortunes into a package called fortunes-off (warning..these are sometimes very offensive).
XScreensavers has many, many older screen savers that ship with X, but which I think are very cool like the matrix screen saver, the BSOD (Blue screen of death, but features crashes for quite a few operating systems) and a few more.
To install the xscreensavers:
**$ sudo apt-get install kscreensaver-xsavers kscreensaver-xsavers-extra xscreensaver-data xscreensaver-data-extra**
You don't need xscreensaver because we're installing the kde manager (kscreensaver-xsavers), which allows management and configuration from the system settings, just like the default screen savers.
You can also install xscreensaver-gl xscreensaver-gl-extra if you like the extra, GL screen savers.
You can configure the screen savers by using the kmenu->System Settings->Desktop, or by right clicking on the desktop and clicking on configure desktop.
There are several screen savers that can use fortune; Apple ][, FontGlide. I use Phosphor. For any of these, just click Setup... and in the Text Program box, type fortune.