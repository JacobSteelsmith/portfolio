---
title: "Online backup for Linux: SpiderOak "
date: 2008-11-06
---

I have been looking for an online backup solution for Linux for quite some time. There are many solutions out there, but as far as I have found, they are all written for Windows or Mac. I had been using duplicity with a remote server, but to purchase my own server for this use would be cost prohibitive compared to the solution I found.

I then read a post on an Ubuntu forum recommending [SpiderOak](http://spideroak.com/) as an online backup solution for Ubuntu.

SpiderOak offers 100 GB for $100 per year, which is more expensive than other solutions, but SpiderOak offers much more than the other services.

SpiderOak offers a graphical client for Ubuntu Linux, installable and manageable through their repository, as well as clients for Windows and Mac. The client installed without a hitch on both of my Kubuntu 8.04 machines and is very stable and very easy to use. You can also run the client in "headless" mode, or from a CLI without a GUI.

The client runs very smoothly and automatically backs up the files to your encrypted online repository on an ongoing basis. The client is very bandwidth conservative and uploads several files at once, automatically. The data in encrypted before leaving your machine and decrypted once arriving at your machine in the case of a download.

This online backup service allows you to connect as many clients as you wish from any of the supported operating systems. This differs with many other services that charge per client. The GUI organizes the files by client and you can download the files between clients.

You can access your files from any client installed on any machine. The selected files are downloaded, decrypted and placed in SpiderOak's download folder. You can also access your files from any web browser on any computer by logging into their website.

An upcoming feature, according to their website, is the ability to synchronize files between multiple computers. Even without this feature, the efficient, easy to use client, and the Linux support, makes this the online backup choice for me, even if it does cost more. 