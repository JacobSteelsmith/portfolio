---
title: "Internet kiosk using Ubuntu part 1 "
date: 2008-10-10
---

A work order had come through at my work several weeks ago stating that one of our public kiosks was prompting for credit card information via the browser whenever a user attempted to use it. This was supposed to be an "internet only" kiosk, which turned out not to be, but was definitely supposed to be a locked down machine.
After speaking with the technicians I was surprised to find that our kiosks have had many issues with malware. I would think an operating system as popular and widely used as Windows would be capable of running secure as a non-privileged user. I have the utmost respect for our technicians and don't doubt their skills, so I had to blame the operating system itself. I then recalled my days using Windows and the malware I would get doing something as innocuous as browsing with Internet Explorer or daring to connect XP service pack 1 to the internet without a hardware firewall.
I then decided to design and configure an internet kiosk scheme using Ubuntu 8.04 LTS. An internet kiosk using Firefox running on Ubuntu Linux had to be more secure and stable then those running Windows and Internet Explorer.
This was a two part deployment.

* A DHCP server that serves Ubuntu images via PXE booting using [LTSP](http://www.ltsp.org/).
* An installable live CD used for our wireless clients.

This projected netted a new DHCP server, four clients PXE booting with Ubuntu images and a distributable "live CD" for setting up kiosks, which I will post here soon.
Next, I will cover the setup and deployment of our DHCP server.