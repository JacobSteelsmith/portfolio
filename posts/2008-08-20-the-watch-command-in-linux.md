---
title: "The watch command in Linux"
date: 2008-08-20
---

A very neat command I learned about today is the watch command. This command line program executes a command periodically and shows the output in full screen. If you've ever used the top command, it's the same concept, but you can use any command.
For example, the command **sudo watch cat /proc/meminfo** will display the current memory information, updating it every two seconds by default, until the ctrl + c combination is pressed.
I learned about this command while setting up software raid in Linux (more on that later) as it was used to watch the progress of the creation of the raid volume. 