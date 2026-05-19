---
title: "Ubuntu kiosk based on 9.10"
date: 2010-04-08
---

**Updated 05/24/2011: [Click here for the newest kiosk build based on Ubuntu 10.04.1](/content/ubuntu-kiosk-based-10041).**

Below is a the link for a kiosk build of Ubuntu based on 9.10. This build is a specific configuration of Ubuntu that will automatically login as a kiosk user. The kiosk user's xsession consists only of a single Firefox Window.
Be sure to see the FAQ at the bottom.
It has been designed so that the kiosk user can only use this Firefox window. I have taken every measure I could think of to disable the opening of other windows and closing of others. If the Firefox window is closed, the session ends and restarts gdm.
Instructions
-----------
1). Boot to CD room. Press enter to boot to the live CD.
2). At the automatic login prompt, click cancel until a list of users appears. Click on itadmin and enter the following password:
changeme
3). Double click on prep-kiosk. This generates the SSH keys (lost during the remastersys process) and disables vt switching. At this point, it will restart gdm, so get ready to login again.
4). If you are using a wireless environment, double click on setup-wireless-network and follow the prompts. Network manager is not installed.
5). If you would like, install acrobat reader using the script install-acrobat, but be warned, it's not been tested.
6). Change the password for itadmin by double clicking on change-password.
At this point you are done. To have a seamless experience, double click lock-kiosk (but READ the following warning).
The script lock-kiosk will disable the login prompt. The machine will boot straight into the kiosk user's account to a full screen Firefox. The only way to manage the kiosk without "unlocking" it at this point is through ssh to port 22022 of the kiosk.
To unlock the kiosk, boot to the live CD, login as itadmin with the default password, and double click the unlock-host script (not unlock-kiosk). Boot to the disk, and you should again get the login prompt.
[ubuntu-9.10-kiosk-public-r1.iso](/files/ubuntu-9.10-kiosk-public-r1.iso)
MD5 hash: 6d86af9f0fd449013f3a31b3f2a60180
Thank you to my employer (Everett Community College) for allowing me to develop this, and thanks Alex for hacking it.
FAQ
----
**How do I change the home page for the kiosk user?**

To change the home page, change the associated settings in /home/kiosk/.mozilla/firefox/obw0c5n2.default/user.js. The three settings are towards the top and are browser.startup.homepage, browser.startup.homepage\_override\_url, and browser.startup.homepage\_welcome\_url. I have made note to create a script that does this.
**Can the wallpaper be changed?**

For the itadmin account, yes. Not for the kiosk user. The kiosk user's xsession only loads metacity and firefox, not gnome.
**How do I restrict web browsing to only one or a few websites?**

See http://jacob.steelsmith.org/content/blocking-websites-using-dansguardian