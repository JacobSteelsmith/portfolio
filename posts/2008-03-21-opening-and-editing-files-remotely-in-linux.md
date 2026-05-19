---
title: "Opening and editing files remotely in Linux"
date: 2008-03-21
---

Using KDE, it is very easy to open and edit a remote file using pretty much any application (any application that uses KDE to open files that is). I use this method using [Kate](http://kate-editor.org/) (a sophisticated text editing program), and [Quanta](http://quanta.kdewebdev.org/) .

To open a file using ftp, in the box in the middle at the top that shows the current path you are looking at, type:

ftp://user@site.com:port/

You will be prompted for a password. After authenticating, you can browse the file system, open, and save the files as if they were local. You may have to re-authenticate every once in a while, but if you choose to save the password, you can click the **save password** box and use [kwallet](http://en.wikipedia.org/wiki/KWallet) or a similar password management application.

My favorite way, by far, to work remotely is securely. I value my security across a WAN, so I tend to use SSH if at all possible. This can be done too. Just use the same format, except **sftp**.

sftp://user@site.com:port/

After authenticating, you will be able to use remote file system as if it were your own.

\*update\*

I just ran into a slight problem, mainly opening an FTP connection when the user name has the @ symbol in it, which is common for secondary FTP accounts assigned within CPanel.

To overcome this, instead of using @, use the URL encoded equivelant, or "%40". For example the string **ftp://user@site.com@site.com:port/** will not work. You will need to use **ftp://user%40site.com@site.com:port** if the FTP user name is user@site.com.