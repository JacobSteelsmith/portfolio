---
title: "Linux Tip: Get Hardware Information"
date: 2007-04-26
---

Here's a good way to get hardware information on a linux system. The proc directory holds the files which store the hardware and system state information.
The command **ls /proc/** gives me the directory listing. Most of these are files that you can look at.

jsteel@jsteel-desktop:~$ ls /proc/
1 4446 4751 5287 5720 5843 6017 driver mounts
106 4447 4755 5295 5721 5848 6019 execdomains mtrr
132 4450 4768 5306 5735 5849 6042 fb net
133 4452 4792 5308 5736 5857 6207 filesystems partitions
134 4453 4816 5318 5739 5858 6661 fs scsi
1978 4454 4836 5330 5740 5859 6842 ide self
1979 4570 4848 5346 5775 5864 6851 interrupts slabinfo
2 4619 4931 5411 5776 5865 6951 iomem stat
2132 4621 4973 5454 5779 5866 6952 ioports swaps
2133 4642 4975 5472 5782 5869 6977 irq sys
2365 4660 5 5506 5784 5876 acpi kallsyms sysrq-trigger
2556 4661 5111 5520 5789 5877 asound kcore sysvipc
29 4667 5112 5576 5791 5887 buddyinfo key-users tty
3 4677 5124 5590 5795 5888 bus kmsg uptime
30 4682 5125 5594 5805 5889 cmdline loadavg version
31 4685 5126 5619 5817 5899 cpuinfo locks version\_signature
3545 4703 5127 5627 5818 5907 crypto mdstat vmcore
4 4705 5128 5717 5820 5970 devices meminfo vmnet
4114 4718 5131 5718 5822 5979 diskstats misc vmstat
4119 4733 5184 5719 5840 6 dma modules zoneinfo

To view the cpu (processor) info in Linux, use the command **cat /proc/cpuinfo**.

jsteel@jsteel-desktop:~$ cat /proc/cpuinfo
processor : 0
vendor\_id : AuthenticAMD
cpu family : 6
model : 10
model name : AMD Athlon(tm) XP 3200+
stepping : 0
cpu MHz : 2199.503
cache size : 512 KB
fdiv\_bug : no
hlt\_bug : no
f00f\_bug : no
coma\_bug : no
fpu : yes
fpu\_exception : yes
cpuid level : 1
wp : yes
flags : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 mmx fxsr sse syscall mmxext 3dnowext 3dnow ts
bogomips : 4400.85
clflush size : 32

Let's try viewing the amount of memory the system has, as well as associated information using **cat /proc/meminfo**.

jsteel@jsteel-desktop:~$ cat /proc/meminfo
MemTotal: 2076320 kB
MemFree: 1160504 kB
Buffers: 174812 kB
Cached: 380728 kB
SwapCached: 0 kB
Active: 516756 kB
Inactive: 326364 kB
HighTotal: 1179584 kB
HighFree: 497856 kB
LowTotal: 896736 kB
LowFree: 662648 kB
SwapTotal: 0 kB
SwapFree: 0 kB
Dirty: 112 kB
Writeback: 0 kB
AnonPages: 287608 kB
Mapped: 96532 kB
Slab: 49596 kB
SReclaimable: 36504 kB
SUnreclaim: 13092 kB
PageTables: 2784 kB
NFS\_Unstable: 0 kB
Bounce: 0 kB
CommitLimit: 1038160 kB
Committed\_AS: 731440 kB
VmallocTotal: 114680 kB
VmallocUsed: 44364 kB
VmallocChunk: 63988 kB

The first entry **MemTotal** shows the total amount of memory the system has. 2076320 kb is 2 GB. My computer has 1160504 kb free, or about 1 GB.