---
title: "Mount netware share in Linux using ncpmount"
date: 2008-02-20
---

I had some problems with the "server not found" error and login doesn't exist error. I finally got this to work by using:

$ ncpmount -S SERVER -A server.fqdn.edu -U user.ou.ou.tree mnt/point

I had to use the -A option which had the fully qualified domain name of the server (an IP address might work) as well as my fully qualified username complete with ous and the tree. 