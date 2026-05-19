---
title: "Better web development with Ubuntu 8.04"
date: 2008-04-26
---

Ubuntu 8.04 provides many free tools that makes a web developer's job very easy and the tools we use better and moe secure.

First, BlueFish is a very good source editor. It has all the expected features and is very fast. Quanta is a good KDE equivalent, but so far, I believe BlueFish is faster and a bit better.

Second, virtualization is highly supported. Why is this important??

I decided to start over with my home computer. I backed up my home drive, then wiped my system drive and reinstalled. Oops...I forgot to backup mysql.

There wasn't anything really important in there, so I got lucky.

Using VirtualBox, and [Ubuntu's JeOS "juice," or just enough operating system](http://www.ubuntu.com/products/whatisubuntu/serveredition/jeos), I now have a secure, backed up virtual server I do my development all, that exists completely on my home drive.

JeOS is a release of Ubuntu that has an installed footprint of 300 MB and comes in a 100 MB iso image. It is optimized for virtualization and runs very, very nicely. With one Drupal installation, php, mysql, apache2 and the like, the server is using about 672 MB.

Running a LAMP stack (Linux, Apache, MySQL, PHP) increases the attack surface of a box. However unlikely, the chances of someone hacking a box running these technologies increases.

Running the development server in a virtual machine mitigates much of that risk. You can shut it off and still use the host, back it up easily and I have the virtual machine tunneled and firewalled so if someone manages to get past the router and Ubuntu's fantastic security, they will have little to attack internally.