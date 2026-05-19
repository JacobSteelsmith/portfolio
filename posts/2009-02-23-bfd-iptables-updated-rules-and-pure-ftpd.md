---
title: "BFD, iptables, updated rules, and pure-ftpd"
date: 2009-02-23
---

I had to setup and secure the new server I am using for my business over the last week. In doing so, I setup [BFD](http://www.rfxnetworks.com/) to protect the server from automated attacks. It's important to have some sort of automated system to block "brute force," or automated attacks.

Script kiddies (no..not hackers) like to use tools they didn't write with shiny GUIs to try and guess the user name and password of an account on the system. They do this by running programs that guess different passwords for a user name rapidly.

BFD runs as a cron job, or scheduled task, every few minutes. It looks at your log files and, after recognizing an attack, uses a specific command to ban the ip address from accessing the computer.

Well, I quickly figured out that the BFD rule for the pure-ftpd service was not working. It looks like a copy-paste of the proftpd rule, with a couple of modifications. It doesn't ban hackers trying to hack the pure-ftpd service.

After some trial and error, I got it working by changing the following argument ARG\_VAL in /usr/local/bfd/rules/pure-ftpd to:

ARG\_VAL=`$TLOG\_PATH $LP $TLOG\_TF | sed -e 's/::ffff://' | grep -E '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | tr -d ':' | sed -n -e '/pure-ftpd/s/?@\(.\*\)\[WARNING\] Authentication failed for user \([^ ]\*\).\*/\1:\2/p' | awk '{print $6 $7}' | tr -d '()[]'`

I'm not a bash expert, or a regex guru, but this does work. If someone has a more elegant way to do this, let me know and I will test it. I have a tough time wrapping my brain around sed...

Also, in order to use iptables and actually have it work, I had to change the argument BAN\_COMMAND in /usr/local/bfd/conf.bfd to

BAN\_COMMAND="/sbin/iptables -I INPUT -s $ATTACK\_HOST -j DROP"

Some posts out there say just iptables is necessary, but I had to specify the full path.

WARNING! There [is a wiki out there](http://wiki.networkredux.com/index.php/How_to_Secure_and_Optimize_your_VPS) suggesting the addition of the flush command for iptables at the end of the daily cron job for bfd. If the following command:

# iptables -L INPUT

has anything in it before you did anything, especially rules such as:

VZ\_INPUT all -- anywhere anywhere

acctboth all -- anywhere anywhere

do NOT do this or flush iptables. This may cause your server to be inaccessible, forcing a reboot (like I just did).