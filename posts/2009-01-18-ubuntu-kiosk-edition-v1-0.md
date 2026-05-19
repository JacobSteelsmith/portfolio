---
title: "Ubuntu kiosk edition v1.0"
date: 2009-01-18
---

**Updated 05/24/2011: [Click here for the newest kiosk build based on Ubuntu 10.04.1](/content/ubuntu-kiosk-based-10041).**
**Updated 04/08/2010: I have posted the new version of a [kiosk build based on Ubuntu 9.10 here](http://jacob.steelsmith.org/content/ubuntu-kiosk-based-910).**
**Updated 03/16/2010: I am working on a kiosk build using 9.10. This should be posted soon.**
One of my projects at my current employer was to use Ubuntu as a public kiosk after our Windows kiosks started prompting users for credit card information. After building the image up on a test machine, I used the excellent [remastersys](http://www.remastersys.klikit-linux.com/) project to build an image to use for future maintenance. I am making this image available here.
This is a live CD that is currently built on Ubuntu 8.04.1 LTS and has most of the extra software removed, such as the games and unnecessary utilities, and is suitable for both wired and wireless kiosks. Please read on for notes and implementation.

### Introduction

This kiosk implementation is very simple. This configuration of Ubuntu has a non-privileged user that automatically logs in on startup. This user's X session is limited to the metacity window manager and one instance of Firefox. The instance of Firefox uses the [rkiosk extension](https://addons.mozilla.org/en-US/firefox/addon/1659) for [Firefox](http://www.mozilla.com/en-US/firefox/) to limit the functionality of the browser.
The image has the latest Windows wireless network card drivers installed for the popular Linksys WMP54G wireless network card using [ndiswrapper](http://sourceforge.net/projects/ndiswrapper/). I found this setup performs better with this network card, especially with a hidden or non-broadcasting ESSID.
The image also has ctrl-alt-delete disabled.

### Wired network

This CD works with no configuration on wired networks. In fact, it can be used in a disk-less system using the live CD function, although depending on the amount of memory needed, it may not perform well.
Although I prefer the LTSP project for wired kiosks, especially more than a couple, this live CD is a great fit. It should simply boot up and "just work" for most hardware used for public kiosks.

### Wireless network

I originally implemented this CD for the wireless kiosks on our campus and used LTSP for the wired kiosks. This CD works great for wireless implementations, although some slight manual configuration will be necessary.

### Installation

Upon booting, you will be presented with a plain screen with options for booting to the live CD or for installation. The installation CD will timeout to booting to the live CD.
Once the live CD is booted, close the browser and let the X session restart. You will be presented with the normal Ubuntu login. Login using the credentials for the administrator's account referenced below. After logging in, you will see an icon on the desktop labeled "install." Click that icon, and enter the administrator's password again to begin the installation.
No more installation or configuration is required for wired machines.
Installation is exactly the same as the [normal Ubuntu installation CD using the graphical install](https://help.ubuntu.com/community/GraphicalInstall), except for the user setup. The initial user and password specified during installation will be ignored.
The admin account is:
User: itadmin
Pass: ubuntu1
**This password will not work on the newer 9.10 version.**  See <http://jacob.steelsmith.org/content/ubuntu-kiosk-based-910>
It should go without saying that this password should be changed soon after installation. You can also change the password, then create your own iso. See "Using remastersys" below.

Post-installation
-----------------

### Changing the home page

Currently, the home page for the kiosk user is set to http://start.ubuntu.com/8.04/ . To change this, login as itadmin and edit /home/kiosk/.mozilla/firefox/6642hmfk.default/user.js and set URL specified in the third, fourth, and fifth line.

### Optional configuration

There are three items both wired and wireless implementations may want to change. Changing /etc/default/rcS and /etc/X11/xorg.conf can be done automatically using the setup script in itadmin's home directory. Just login as itadmin and run the command **sudo ./setup** . This will replace the two files /etc/default/rcS and /etc/X11/xorg.conf so it should only be run once during initial setup.
**/etc/default/rcS**
Changing the line that reads:
UTC=yes
to:
UTC=no
will keep Ubuntu from updating your hardware clock to UTC time. This is handy if you want the kiosks to turn on automatically using a RTC interrupt in the bios.
**root's crontab**
Using the command **sudo crontab -e** you can specify an automatic shutdown time for the machine. If you remove the pound sign from the beginning of the line, it will shutdown at 6:00 PM on weekdays.
**/etc/X11/xorg.conf**
It might be desirable to shut off virtual terminal switching. To do this, add this to the end of /etc/X11/xorg.conf.
Section "ServerFlags"
Option "DontVTSwitch" "true"
EndSection

### Wireless Configuration

There are a few files that need to be edited.
**/etc/network/if-pre-up.d/wireless-tools**
This file is handy for setting some default settings for handling wireless networks. Just remove the pound sign from the beginning of the line and fill in the missing information.
**/etc/network/interfaces**
This file is used to setup the network. [Use this for specifying a static network configuration](http://www.cyberciti.biz/faq/setting-up-an-network-interfaces-file/). The wireless essid can be specified here too:
wireless essid my-essid

### Using remastersys

Remastersys is an very useful utility that is used to create a backup of an installed system. This is what I used to create the iso image, which is used to make the live CD of the kiosk system. If you have made quite a few changes to your kiosk system, or just want a backup, you can use remastersys to backup your system to a live CD.
To use remastersys, use the command **sudo remastersys backup my-backup.iso** . This will create the iso my-backup.iso in /home/remastersys/remastersys/ . After you copy and test the iso, you will want to run the command **sudo remastersys clean** .
The iso is 513.8 MB and the tar file is 507.7 MB. Attached is the torrent file and the md5 hash for the iso. I am distributing this via torrent for now but will probably attach it to this post shortly. Please seed this torrent after downloading.
Please contact me with any comments or issues. Thank you!
\*\*UPDATE\*\*
The latest version can be downloaded using this link:
[2009-01-18-v1.0.tar.gz](/files/2009-01-18-v1.0.tar.gz)