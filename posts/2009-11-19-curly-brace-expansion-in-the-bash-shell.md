---
title: "Curly brace expansion in the Bash shell"
date: 2009-11-19
---

A very handy trick using the Bash shell in Linux involves the curly braces. The [Bash manual at gnu.org](http://www.gnu.org/software/bash/manual/bashref.html#Brace-Expansion) defines brace expansion as "a mechanism by which arbitrary strings may be generated."

I use this mostly when working with files, especially making back ups of configuration files. For example, to copy /etc/X11/xorg.conf to /etc/X11/xorg.conf.backup, you could do this:

`$ cp /etc/X11/xorg.conf /etc/X11/xorg.conf.backup`

or you could use brace expansion

`$ cp /etc/X11/xorg.{conf,conf.backup}`

which produces the same result. An easy way to visualize this is using the following example:

**jacob@jakes-laptop:~$ echo a{r,l,cm}e

are ale acme**