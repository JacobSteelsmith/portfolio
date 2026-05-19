---
title: "Updating grub and automagic in Ubuntu"
date: 2009-11-22
---

Working with grub used to be somewhat of a pain. The biggest complaint being that if you, say, disabled apic using the noapic boot option, and updated the kernel without updating the grub file, you could be stuck with a kernel panic. This was happening to me tonight when working with [jeos](http://www.ubuntu.com/products/whatisubuntu/serveredition/jeos) and VirtualBox.

Automagic has made this a whole lot easier. There are automagic options in /boot/grub/menu.lst that are used when any kernel is installed into the system.

To add a boot option, just find the block that looks something like this:

## ## Start Default Options ##

## default kernel options

## default kernel options for automagic boot options

## If you want special options for specific kernels use kopt\_x\_y\_z

## where x.y.z is kernel version. Minor versions can be omitted.

## e.g. kopt=root=/dev/hda1 ro

## kopt\_2\_6\_8=root=/dev/hdc1 ro

## kopt\_2\_6\_8\_2\_686=root=/dev/hdc2 ro

# kopt=root=UUID=c1625117-581c-4571-b7db-cdb04f5b7622 ro

and add your options after ro. Do **not** uncomment the line. So mine looked like this:

## ## Start Default Options ##

## default kernel options

## default kernel options for automagic boot options

## If you want special options for specific kernels use kopt\_x\_y\_z

## where x.y.z is kernel version. Minor versions can be omitted.

## e.g. kopt=root=/dev/hda1 ro

## kopt\_2\_6\_8=root=/dev/hdc1 ro

## kopt\_2\_6\_8\_2\_686=root=/dev/hdc2 ro

# kopt=root=UUID=c1625117-581c-4571-b7db-cdb04f5b7622 ro noapic nolapic acpi=off

Again, the line **remains** commented.

For security purposes, you can set **#alternative=false** to disable the rescue mode option. Be aware that physical access though is root access unless great pains are taken.

There are many other, well documented options in this file as well. Once you have edited the file to your liking, use:

`$ sudo update-grub`

which will update your menu.lst file. Easy as that.