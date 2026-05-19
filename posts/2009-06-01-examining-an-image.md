---
title: "Examining an image"
date: 2009-06-01
---

You can either copy the image to a hard drive, or mount it in Linux and examine it. To mount an image of an entire drive, first examine the partitions using fdisk:

$ sudo fdisk -u -l /media/2Big/hd.img

In this example, hd.img is an image file created earlier on a USB drive named 2Big.

You should see something similar to this:

Disk /dev/sdc: 250.0 GB, 250059350016 bytes

255 heads, 63 sectors/track, 30401 cylinders

Units = cylinders of 16065 \* 512 = 8225280 bytes

Disk identifier: 0x0004034f

Device Boot Start End Blocks Id System

/dev/sdc1 \* 1 30163 242284266 fd Linux raid autodetect

/dev/sdc2 30164 30401 1911735 fd Linux raid autodetect

Although the size may be reported as zero. We want to focus on the start and end entries of each partition. To mount the partition, first create a temporary folder, not using sudo:

$ mkdir tmpmount

Then, mount the partition using mount, but with the following options:

$ sudo mount -o loop,ro,offset=15443968 -t auto /media/2Big/hd.img tmpmount/

For our options, loop allows us to mount an image as if it was a drive and ro means read only. The offset tells mount to mount at the particular offset, as there is no partition table available, because it's a file and not a real drive. We calculate the offset by multiplying the start of the partition we want to mount from fdisk by 512..so 30164\*512. The -t auto tells mount to auto detect the file system.

Once that command succeeds, you'll be able to cd to tmpmount and see the files on the image in a read only state with the time stamps preserved. 