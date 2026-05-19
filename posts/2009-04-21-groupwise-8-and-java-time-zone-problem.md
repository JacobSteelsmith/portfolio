---
title: "Groupwise 8 and java time zone problem"
date: 2009-04-21
---

The GroupWise 8 client runs great under Ubuntu, but there is a slight problem with the time zone. Because the GroupWise client is a Java based client, a slight adjustment may need to be made.

Java, for some reason, [expects a symbolic link at /etc/localtime](https://bugs.launchpad.net/ubuntu/+source/sun-java6/+bug/49068/comments/13). When it doesn't get it, it defaults to, usually, the wrong time zone. This caused issues like the calendar in GroupWise to be off.

To fix this:

sudo cp /etc/localtime /etc/localtime.bak

sudo ln -s -f sudo ln -s -f /usr/share/zoneinfo/Your/Timezone /etc/localtime