---
title: "Secure ftp using Ubuntu"
date: 2007-12-12
---

I recently wanted to setup an automated backup system for a company I purchase hosting through (who promptly shut off full backups), and wanted to do so using FTP to my home computer.
The first thing I did was setup vsftpd. This is an FTP daemon that provides the ftp service. After installing the daemon and creating the system account with /bin/false as a shell, I edited /etc/vsftpd.conf. I didn't run it on a non-standard port, although you can for greater security. I did NOT enable anonymous access and neither should anyone else not requiring them.
The next thing I did was set chown\_uploads=YES and chown\_username=<another user>. This will change the owner of the files uploaded to someone other than the ftp user. This way, if someone gets in, they can't delete what's in there.
Set the nopriv\_user=<nonprivelaged user> and use that account and password to ftp. It's sooo much safer. ftpd\_banner will customize the banner displayed on successful login. I also chroot\_local\_user to keep the user in their own home directory. You can use the options below (chroot\_list\_enable=YES and chroot\_list\_file=<file>) to not jail a list of users. Jailing means they cannot traverse below their home directory.
All was well until someone started trying to hack my ftp service. They were trying lame user accounts like Administrator and Bill (no..it's not Windoze). So I also installed fail2ban. This program monitors your access logs for several services and uses iptables to ban the offender from connecting to the server. It's pretty sweet and very easy to install with Ubuntu!