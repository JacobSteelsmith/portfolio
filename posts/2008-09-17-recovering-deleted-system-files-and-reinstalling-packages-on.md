---
title: "Recovering deleted system files and reinstalling packages on Ubuntu"
date: 2008-09-17
---

I ran an installation program using sudo that, after asking where the current version was, which was /usr/bin/, completely emptied that directory.
**This should be a reminder that, as secure and stable as Linux is, it is still susceptible to user error and bad software.**

For those that do not know, /usr/bin/ is a very important directory in which many if not most of the important system programs are stored. This is the equivelant of deleting the System32 directory in Windows.
Immediately after that happened, the system became nearly unresponsive, the memory usage spiked to 100% (4 GB) and the swap partition was up to 3 GB before I killed the system. Needless to say, rebooting wasn't pretty.
To fix this, I had to first:
\*boot to the live CD
\*install mdadm (for my software raid)
\*automatically assembled my array
\*mount the array
\*copy the contents of /usr/bin on the virtual file system to the mounted array.
I was able to boot then, but not without errors. It may have been better to run an update from the live CD before copying, but I didn't think of that last night.
It becomes obvious when you are missing binaries and you boot or try to run programs. To make things worse, the package managers seem to have no knowledge of the current state of the system. For example, I did not see an option to go through your packages and verify the binaries and installed files. That would be nice.
In any case, to remedy single packages, use:
**$ sudo apt-get --reinstall install $PACKAGE**
where $PACKAGE is the name of the package you want to reinstall. If you try to use the regular install option, without the --reinstall switch, apt will tell you that the package is installed and at the latest version, even if you are missing files the package installed.
But this still does not solve the version problem. To do that, I followed the instructions here:
<http://ubuntuforums.org/showthread.php?t=735693&highlight=reinstall+all+packages+without+reinstalling+ubuntu>
This will reinstall every package you have installed. I could/should have taken the time to improve the script to only reinstall packages that have files in /usr/bin but I didn't. You can use:
**$ dpkg --listfiles $PACKAGE**
to list the files a package installs. 