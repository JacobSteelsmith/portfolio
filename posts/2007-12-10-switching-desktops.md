---
title: "Switching desktops"
date: 2007-12-10
---

I switched my desktop back to gnome (think Ubuntu not Kubutnu), mostly because of [AWN](http://awn.wetpaint.com/?t=anon) which is a cool menu with nice applets that extend the functionality (I have a system monitor, a weather applet, desktop switcher, file stacker, etc) (many examples can be seen on [YouTube](http://youtube.com/results?search_query=awn&search=Search). AWN is still in heavy development so a few of the applets don't work and there are some minor bugs, but very cool.
The gnome desktop manager seems to work better with the ubuntu base than the KDE desktop, although I miss a couple of features in KDE (like the popup with the file preview...although that may be a gnome setting).
This is one area where Linux shines..it gives you freedom. This is something few other usable operating systems (perhaps no other operating systems) can do. If you don't like the desktop, change it or remove it, and do so with two commands at the (I know, scary..gulp) command line. Heck, if you really don't like it and you know what you're doing, you can edit and compile the source, creating something completely unique. If you're a g33k and not using Linux, you're...well...not a g33k.
Switching from kde to gnome entailed:
install gnome
$ sudo apt-get install ubuntu-desktop
During the setup, it may ask if you want this as the default. You can say yes, or no. You will be able to choose your session when you reboot, so you can actually have, and use both, but some things may be weird.
Now, either reboot, or stop, then start x
$ sudo /etc/init.d/x11-common restart
For the sake of completeness, I removed KDE
$ sudo apt-get remove kubuntu-desktop
And I'm done. New look, new tools. I can still use the tools found in KDE (ktorrent, k3b), even when I'm running gnome.