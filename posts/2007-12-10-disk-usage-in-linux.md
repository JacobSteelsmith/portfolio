---
title: "Disk usage in Linux"
date: 2007-12-10
---

Here are some simple commands to use to get the disk usage in Linux.

$ df

will give you the disk usage for all mounted drives, including available and percentage of use.

Filesystem 1K-blocks Used Available Use% Mounted on

/dev/sda2 17077684 7868596 8341580 49% /

varrun 1038144 272 1037872 1% /var/run

varlock 1038144 0 1038144 0% /var/lock

udev 1038144 84 1038060 1% /dev

devshm 1038144 0 1038144 0% /dev/shm

lrm 1038144 35324 1002820 4% /lib/modules/2.6.22-14-386/volatile

/dev/sdb2 64982632 23791484 37890196 39% /home/BigMama

/dev/sdb1 51199120 7619456 43579664 15% /home/windows

Use with the -h option for friendlier output.

Filesystem Size Used Avail Use% Mounted on

/dev/sda2 17G 7.6G 8.0G 49% /

varrun 1014M 272K 1014M 1% /var/run

varlock 1014M 0 1014M 0% /var/lock

udev 1014M 84K 1014M 1% /dev

devshm 1014M 0 1014M 0% /dev/shm

lrm 1014M 35M 980M 4% /lib/modules/2.6.22-14-386/volatile

/dev/sdb2 62G 23G 37G 39% /home/BigMama

/dev/sdb1 49G 7.3G 42G 15% /home/windows

If you're trying to track down a large file or folder, use the du command (again, you can use the -h option). This will list all files in the directory you're in. If you just want the first level of folders (handy when you're walking a file system), use --max-depth=1.

$du -h

616K ./cooper/orig

3.5M ./cooper/cropped

14M ./cooper

148K ./Photos/2006/11/24

3.3M ./Photos/2006/11/11

152K ./Photos/2006/11/26

448K ./Photos/2006/11/20

1.7M ./Photos/2006/11/12

812K ./Photos/2006/11/25

6.4M ./Photos/2006/11

3.5M ./Photos/2006/8/13

28K ./Photos/2006/8/6

6.5M ./Photos/2006/8/19

1.7M ./Photos/2006/8/14

964K ./Photos/2006/8/27

13M ./Photos/2006/8

6.0M ./Photos/2006/9/4

68M ./Photos/2006/9/23

2.7M ./Photos/2006/9/18

17M ./Photos/2006/9/8

30M ./Photos/2006/9/9

123M ./Photos/2006/9

784K ./Photos/2006/7/22

788K ./Photos/2006/7

156K ./Photos/2006/12/20

300K ./Photos/2006/12/12

460K ./Photos/2006/12

143M ./Photos/2006

143M ./Photos

166M .

$ du -h --max-depth=1

14M ./cooper

143M ./Photos

166M .

The . means your current folder, wherever you are in the directory structure. Remember to use sudo if you're looking at system files.

The -h option can also be used with ls -l which will give you the directory listing, with other information including the size in human readable format. So:

$ ls -lh

total 9.4M

drwxr-xr-x 4 jsteel jsteel 4.0K 2007-12-06 22:22 cooper

-rw-r--r-- 1 jsteel jsteel 1.6M 2007-11-01 20:13 cooper-png-jpg.zip

-rw-r--r-- 1 jsteel jsteel 7.8M 2007-11-01 20:09 cooper.tar.gz

-rw-r--r-- 1 jsteel jsteel 48K 2007-01-15 07:09 digikam3.db

drwxr-xr-x 3 jsteel jsteel 4.0K 2007-01-12 19:55 Photos