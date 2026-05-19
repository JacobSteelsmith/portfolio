---
title: "rsync and Ubuntu"
date: 2007-12-15
---

Imagine you have a very important disk you want to mirror, or have a copy of. This could be a remote disk, like on a website, or even a directory.

You could copy and paste the files, at least if they are local disks, or use FTP. Problem solved, right?

Now, imagine you have two disks, both of which have data, but you need them to match. This was the problem I ran into with over 100 GB of data. I solved this in ubuntu using rsync.

To install, use apt-get:

$ sudo apt-get install rsync

As always, help is available by entering rsync --help. I wanted to sync two drives I use for music, both containing files the other didn't and I wanted to keep the newest files. Here are the commands I used:

$ rsync -avuz /media/MUSIC2/ /media/MUSIC/

$ rsync -avuz /media/MUSIC/ /media/MUSIC2/

And that's it! The data was synced on both drives using the command line!