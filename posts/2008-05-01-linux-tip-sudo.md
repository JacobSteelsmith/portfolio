---
title: "Linux tip: sudo"
date: 2008-05-01
---

At work yesterday, I had to solve a problem with a strange error.

Sorry, user <user> is not allowed to execute '/usr/bin/command' as root on <box>

Reading the work order (which did not include the error message, just that the user could not access a file), I thought it had to be a permissions issue, and in a sense I was right, but not a file permissions issue as I suspected.

The command **sudo** is used so people do not have to run as root, or the administrative account in Linux. Whenever a user needs to install something, or otherwise do something that could jeopardize the sanity of the system or security, they must use sudo or do so as the root user. Linux is very stringent when it comes to permissions, which is a good thing and is also very good about not letting people login as an administrator. Other operating systems let their users run as administrators, sometimes by default, which allows any programs they run the same rights, which in turn makes virus infection and system compromise much easier.

So I opened up the /etc/sudoers file and low and behold:

user ALL=NOPASSWD: /usr/bin/command1

This was the sudo entry for the user in question. This means the user "user" can run /usr/bin/command1 on any host without using their password as root.

This adds extra security, giving the user root access to only one command. A typical entry looks like this:

user ALL = (ALL) ALL

which means run any command (the last ALL) on any machine (the first ALL) as any user (the ALL in parentheses).

So to solve this problem, I had to add the command she needed to run.

user ALL=NOPASSWD: /usr/bin/command1, /usr/bin/command2

Perhaps a more secure approach would be forcing the user to authenticate themselves:

user ALL = /usr/bin/command1, /usr/bin/command2

but I know there are some scripts that run as the user, as well as a service.

The command **man sudoers** will tell you everything you never wanted to know about the sudoers file. 