---
title: "Linux tip: Getting disk information"
date: 2008-04-07
---

A good way to get local disk information is using the fdisk command. Under Ubuntu, it goes a little something like this.
$ sudo fdisk -l
Don't forget the sudo, or you will only get the devices you plugged in (like USB hard drives).
The output of the command looks like this:

```

Disk /dev/sda: 80.0 GB, 80000000000 bytes
255 heads, 63 sectors/track, 9726 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Disk identifier: 0xf216f216

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *           1        9324    74894998+  83  Linux
/dev/sda2            9325        9726     3229065    5  Extended
/dev/sda5            9325        9726     3229033+  82  Linux swap / Solaris

Disk /dev/sdb: 250.0 GB, 250000000000 bytes
255 heads, 63 sectors/track, 30394 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Disk identifier: 0xca3fb8d3

   Device Boot      Start         End      Blocks   Id  System
/dev/sdb1               1       15197   122069871   83  Linux
/dev/sdb2           15198       30394   122069902+  83  Linux

Disk /dev/sdc: 160.0 GB, 160041885696 bytes
255 heads, 63 sectors/track, 19457 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Disk identifier: 0x000055c9

   Device Boot      Start         End      Blocks   Id  System
/dev/sdc1               1       19457   156288321    c  W95 FAT32 (LBA)
```

This is a good way to view available mount points or to examine the partitions on the disk.