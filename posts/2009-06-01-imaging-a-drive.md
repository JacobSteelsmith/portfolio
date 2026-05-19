---
title: "Imaging a drive"
date: 2009-06-01
---

It is very important when investigating a security incident to work with a copy of the hard drive, and not the original. It is equally important to work with an unaltered copy of the drive. All that is needed is a place to store the image, a USB or system drive, and a working Linux setup. This can be an Ubuntu live CD.

First, you must see where your drives are:

$ sudo fdisk -l

Disk /dev/sda: 250.0 GB, 250059350016 bytes

255 heads, 63 sectors/track, 30401 cylinders

Units = cylinders of 16065 \* 512 = 8225280 bytes

Disk identifier: 0x0008558e

Device Boot Start End Blocks Id System

/dev/sda1 \* 1 30163 242284266 fd Linux raid autodetect

/dev/sda2 30164 30401 1911735 fd Linux raid autodetect

Disk /dev/sdd: 160.0 GB, 160041885696 bytes

255 heads, 63 sectors/track, 19457 cylinders

Units = cylinders of 16065 \* 512 = 8225280 bytes

Disk identifier: 0x000055c9

Device Boot Start End Blocks Id System

/dev/sdd1 1 19457 156288321 c W95 FAT32 (LBA)

In this example, /dev/sda is a SATA drive and has two partitions. Normally, this could be your source disk you want to copy, in which case "Linux raid autodetect" would read something similar to NTFS. The second drive listed, /dev/sdd, is actually a USB hard drive. You can see the partition type is different, FAT 32.

When you plugin the drive in Ubuntu, it is automatically mounted. If it isn't, use the commands:

$ sudo mkdir /mnt/usb

$ sudo mount /dev/sdd /mnt/usb

If it is automatically mounted, your mount point will be similar to /media/. Use the following command to find out:

$ sudo mount -l

/dev/md0 on / type ext3 (rw,relatime,errors=remount-ro) []

proc on /proc type proc (rw,noexec,nosuid,nodev)

sysfs on /sys type sysfs (rw,noexec,nosuid,nodev)

varrun on /var/run type tmpfs (rw,nosuid,mode=0755)

udev on /dev type tmpfs (rw,mode=0755)

tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)

devpts on /dev/pts type devpts (rw,noexec,nosuid,gid=5,mode=620)

/dev/sdd1 on /media/MUSIC2 type vfat (rw,nosuid,nodev,uhelper=hal,uid=29831,utf8,shortname=mixed) [MUSIC2]

You can see the last entry is /media/MUSIC2, my USB drive.

The command to image the drive, for our example, would be:

$ sudo dd if=/dev/sda of=/media/MUSIC2/hd.img

This will image the entire hard drive, which is what we want, and save it as a file on the USB drive. Obviously, this won't work in our example because the source drive is bigger than the space available on the target drive.

You will end up with a exact copy of the drive for future use. You can then copy it onto another drive if you'd like:

$ sudo dd if=/media/MUSIC2/hd.img of=/dev/sda

Where /dev/sda is a blank hard drive. The entire drive will be copied, including the partition table, any boot loaders, and the master boot record. The target drive can be larger than the image.