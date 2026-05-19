---
title: "Clean Ubuntu and find large packages"
date: 2009-01-13
---

While working on a wireless kiosk using Ubuntu, I had the need to shrink the Ubuntu installation. Part of creating a custom install, using remastersys, is creating a live CD iso image.
I did, of course, remove the unnecessary software and programs like the games and cd burning software (see http://www.staldal.nu/tech/2008/12/08/packages-you-might-want-to-remove-from-ubuntu-804-hardy-desktop/) and I ran several commands including localpurge and deborphan (see http://strabes.wordpress.com/2006/10/16/clean-up-unnecessary-packages-on-ubuntu-dapper/ ).
The one thing I wanted to do was to find large packages installed on the system. I then read about dpigs, which is part of the debian-goodies package (see http://manpages.ubuntu.com/manpages/hardy/en/man1/dpigs.1.html). This is a great tool that lists the top 10 largest packages. I was able to clean several hundred megabytes from the system by looking at the packages and removing them.
Using dpigs, I brought the custom installation CD size down to 519 MB from over 700 MB without losing any additional functionality. 