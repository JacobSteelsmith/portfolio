---
title: "Mount iso image in Linux"
date: 2008-07-31
---

Using a simple mount command, you can mount an iso image and navigate the file system.

First, create the directory you want to use to access the iso. This can be any directory.

`$ sudo mkdir /mnt/iso`

Then, mount the iso.

`$ sudo mount -o loop ~/isos/test.iso /mnt/iso`

This mounts the iso file to the mount point you just made. The squiqqly line in Linux ~ means is expanded to your home directory.

You can then use the command line or GUI to navigate to /mnt/iso and view the files on the iso image. You can also copy and paste files out of the image.