---
title: "Script to create bridged networking for VirtualBox"
date: 2008-04-30
---

Attached is a script that I've created to create and configure a network bridge and TAP interface.
Because VirtualBox requires these steps every boot, I figured I'd make it easy. Plus, using a static IP requires slightly more work. This script should make it easier.
Run the script as root (or with sudo) and it will ask you some questions, defaulting with some auto detected answers.
There are still some deficiencies, but it should be relatively bug free. It's my first complicated bash script and I had a blast putting it together. If anyone improves it or likes it, let me know, and I'll post the improved version.
From the readme:
> Jacob Steelsmith
> 2008/04/30
> This is the readme to accompany bridge-network.sh. This software is released under the gpl version 3. There should be a copy of the license included. If not, let me know, or visit gnu.org/licenses.
> About the script
> This script is used to create a TAP interface with a bridge automatically. It uses several utilities to do so. The script will prompt with some information, but can be setup to run virtually automatically. The script can configure the interface for DHCP or static values, and will detect the current values if static is selected. This was created using information from https://help.ubuntu.com/community/VirtualBox.
> Options
> Editing the file, you'll see some variables at the top.
> DEBUG="0" #debug output
> RTO=10 #read timeout
> DINT="eth0" #default interface to bridge
> DHCPD="N" #default dhcp answer
> RTO is the default timeout for the read command (makes the script default faster). This is in seconds. DINT is the default interface. Most people use eth0.
> DHCPD is the default answer for DHCP configuration of the bridge. The setting N means the script will default to static values for the bridge. If your interface uses DHCP, set this to Y.
> Prerequisites
> This software requires the commands tunctl, brctl, ifconfig, dhclient and route to be installed and in the user's path. Under Ubuntu 8.04, these can be met by installing the packages bridge-utils and uml-utilites.
> !!!!!
> Also, if you are using this script for VirtualBox, you'll need to change the ownership of the tunnel interface the first time:
> sudo chown root.vboxusers /dev/net/tun
> sudo chmod g+rw /dev/net/tun
> Also, you'll need to edit (only once) as root /etc/udev/rules.d/20-names.rules and change:
> KERNEL=="tun", NAME="net/%k"
> to:
> KERNEL=="tun", NAME="net/%k", GROUP="vboxusers", MODE="0660"
> Editing this file has the same effect as running the two commands above, but does so on every boot.
> After a reboot, you won't need to complete these steps.
> !!!!
> WARNING!!
> ----------
> The current version of this script may leave your network unaccessible if it errors out! Please do not use unless you know how to reset your networking!