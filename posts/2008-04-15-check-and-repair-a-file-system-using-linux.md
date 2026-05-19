---
title: "Check and repair a file system using Linux"
date: 2008-04-15
---

I ran into a situation recently where an external hard drive I have, a USB drive I use for backing up my data, continuously became read only after a period of time.

Any seasoned Linux user can tell you this isn't a good thing. If the kernel detects error in the file system, rather than letting you continue to write to the drive and risk further corruption, Linux will disallow writing to the drive.

Luckily, it's not hard to fix this, but it cannot be done if the partition is mounted. If it's a removable or secondary drive as it was in my case, there is no need for a live cd, but if it's your primary partition or one that otherwise cannot be unmounted, you'll need to boot to a live CD.

Once you're in your environment with the drive unmounted (use **sudo umount /media/mount-point)**, you can run fsck, unless the file system is an NTFS file system. If it is an NTFS file system, read on for possible fixes.

To use fsck on a native Linux partition or FAT, first, find the partition by using:

`$ sudo fdisk -l`

This will output information about all the disks and partitions on the system. You want to make a note of the device node, normally in the form /dev/sdx. My USB drive was /dev/sdc1.

So I used the command:

`$ fsck /dev/sdc1 -- -r`

The "-- -r" passes the repair option to the proper file system checker. fsck is a wrapper that determines the proper tool to use, such as fsck.nfs or fsck.vfat.

You can run the tool without "-- -r" to see the changes the tool will make without making them. I did both and had my disk fixed in no time.

If you are unlucky enough to have an NTFS file system, there are two tools that might help you; **ntfsfix** and **testdisk**, both of which can be installed using apt.