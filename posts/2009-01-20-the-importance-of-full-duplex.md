---
title: "The importance of full duplex"
date: 2009-01-20
---

I am not a network guru by any means, but I do troubleshoot well, or so I've been told.

A perplexing problem involving HP 3000 connectivity has, hopefully, come to a close today as a vendor recognized an unusual number of errors on a port on one of our switches. This port just happened to be where our [netequalizer](http://www.netequalizer.com/) unit plugged into. Because the netequalizer unit uses a custom Debian variant (yay!) I was able to login and look at the interfaces.

Unfortunately, one interface had auto-negotiated to half duplex, causing an enormous number of carrier errors according to ifconfig. Using [ethtool](http://gd.tuwien.ac.at/linuxcommand.org/man_pages/ethtool8.html) I was able to force the connections to full duplex.

This should result in a better connection across the bridge and less dropped packets. Hopefully, this was the issue our users were having with HP 3000 connectivity. 