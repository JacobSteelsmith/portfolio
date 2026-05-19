---
title: "Recovering deleted files from NTFS image"
date: 2009-06-01
---

Sometimes, it becomes necessary to recover deleted files from an NTFS image. Using linux, a free utility called ntfsundelete can be used.
If the image is still mounted, you will need to unmount it:
$ sudo umount tmpmount
Then, you will want to use the losetup utility to associate a loop with a regular file (our image):
$ sudo losetup -o 15443968 /dev/loop0 /media/2Big/hd.img
The -o is the offset calculated from the last post (the start of the partition listed in fdisk \* 512). The ntfsundelete utility can then be used:
$ ntfsundelete -s /dev/loop0
This will scan the image for all files that can be undeleted. You can then use a command such as:
$ ntfsundelete -u -m '\*.jpg' -d /home/jacob/recovered-files/
which will recover all the files with .jpg in the name. NTFS can recover inode ranges (listed in the scan) also.
When you're done, use:
$ sudo losetup -d /dev/loop0