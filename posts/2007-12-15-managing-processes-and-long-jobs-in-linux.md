---
title: "Managing processes and long jobs in Linux"
date: 2007-12-15
---

If you have a long job using the command line in Linux, here are some tips.
Some jobs, such as compiling a program or using vacuumdb in postgres require a long time. Normally, you cannot use the same command line when running these jobs. If you are using ssh remotely, you're stuck (unless you login again).
Now you can add a space and ampersand at the end of the command and this \*should\* send this to the background. But I've found this doesn't always work. But even if it does, the following does still apply.
Once the command is started, you can press CTRL+Z to stop the command (not kill the command but pause it). You can then type bg to send the command to the background and resume the task.
If you type ps -a, you will see the command you typed running in the background. You can switch back to that command anytime by typing fg at the command prompt to bring the command back to the foreground.