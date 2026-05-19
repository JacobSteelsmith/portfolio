---
title: "Linux tip: List packages installed on your ubuntu system"
date: 2008-03-26
---

If you're interested in installing KDE4 on [Kubuntu](http://kubuntu.org/) to try it out like their website suggests, don't. It sucks right now.
So when you remove the package they tell you to install, it doesn't remove all of the KDE4 packages. So you'll have two versions of konqueror along with other applications. Don't get me wrong, I love KDE and Linux, it just seems like KDE4 isn't mature enough yet.
A tip from [spiration.co.uk](http://www.spiration.co.uk/post/1303) outlines using a combination of dpkg and grep to find all the packages matching a pattern that are installed on your linux system.
The command is:
**$ dpkg --get-selections | grep -v deinstall | grep kde4**
Which will list all the packages installed that have the string kde4 in the name.
**dpkg --get-selections** will list all packages that are installed and have been installed, except for the purged packages. The pipe command will pipe that output into the next command, **grep -v deinstall**, which will filter out lines of input that have the word deinstall in them. Those packages are not installed, so we don't need them, giving us a list of the installed packages. The output of that command is then piped to the next command **grep kde4**. This will only display the lines that have kde4 in them, giving us all the installed packages that have kde4 in them. 