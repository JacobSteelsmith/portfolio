---
title: "Using smart monitoring for drives on Ubuntu"
date: 2008-08-12
---

SMART (Self-Monitoring, Analysis, and Reporting Technology) is a technology that implemented by most hard drive manufacturers that records pertinent information about the hard drive, to the hard drive, which aids in the prediction of a failure.
Linux has tools available that harvest that data, perform tests and aide in the prediction of drive failure. Normally, the bios will prompt you if SMART detects a problem with a drive, but you have to reboot in order to get that prompt and many Linux users don't reboot often.
To install the packages under (k)ubuntu, use:
**$ sudo apt-get install smartmontools**
This will install two tools; smartctl and smartd. Use smartctl for on-demand tests and smartd for monitoring and reporting.
For on-demand tests, the easiest way to go is to use:
**$ sudo smartctl -a /dev/sda**
replacing /dev/sda with the drive you'd like to test. This will spit out a bunch of information but the most important section is at the top:
**=== START OF READ SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED**
It will also let you know of any errors that have occurred.
To setup the daemon for monitoring, first edit the smartmontools configuration file:
**$ sudo nano /etc/default/smartmontools**
Uncomment the following line, by removing the pound sign at the beginning:
**start\_smartd=yes**
This starts the daemon when the system starts. The daemon will work at this point with no other configuration and it will log the messages to /var/log/syslog (not messages like the tool says).
However, if you'd like to receive email alerts to another email address than root, you'll want to edit /etc/smartd.conf:
**$ sudo nano /etc/smartd.conf**
The first line starting with the word DEVICESCAN is uncommented. The -m root option says send an email to root. You can change this to your username if you'd like, or use a full email address if your provider allows. You can then install the mailx package and use the mail command to read the alerts.