---
title: "Securing Linux: process limits"
date: 2008-03-16
---

This tip was found at http://aymanh.com/tips-to-secure-linux-workstation.

An old school attack on Linux systems is called a fork bomb. There is demonstration code at the fore-mentioned website, but essentially, it is a command that will spawn an unending number of processes, eventually killing the system.

Windows fan boys, please don't think Windows is better because of this. Bugs in Windows add on software, add on software you can't get rid of like Internet Explorer, has and will take down a Windows system on a regular basis. So please...just save the comments. Besides, there is an easy fix and at the very least, we can modify the settings to mitigate the attack.

Anyway, to fix this, edit /etc/security/limits.conf and add two lines, or edit the existing lines that look like this:

@users soft nproc 200

@users hard nproc 250

@users should be the primary group that every user is assigned to. There are two limits. One is a soft limit that will produce warnings and one is a hard limit that will halt the process.