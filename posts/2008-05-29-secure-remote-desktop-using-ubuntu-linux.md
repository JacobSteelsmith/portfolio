---
title: "Secure remote desktop using Ubuntu Linux"
date: 2008-05-29
---

Remote desktop, or using a remote session, is a very important part of advanced computing. The ability to do this securely is important as well.
Using ssh, Xephyr and a light weight desktop manager, an encrypted, secure, fairly fast remote desktop setup is fairly easy to implement.
First, you'll need to install SSH on the remote machine:
`$ sudo apt-get install openssh-server`
To make your SSH installation more secure, [you should use the public key authentication method of authentication](https://help.ubuntu.com/community/SSHHowto#head-1ff9e61cfd81e9f741920b6920af8a85f7bddb30).
Then you'll need to configure SSH to forward X. Make sure the x11Forwarding is set to yes (it is by default) in /etc/ssh/sshd\_config.
Next, install a light weight window manager on the remote machine. I used xfce (**sudo apt-get install xfce4**), but you can also use blackbox or several others.
On the local machine, you'll need to install Xephyr, which creates a new X server inside your existing, running X session.
sudo apt-get install xserver-xephyr
Then, [use these instructions](http://ubuntuforums.org/showthread.php?t=620003) to start Xephyr and start an SSH session that forwards the X session to the embedded X session.