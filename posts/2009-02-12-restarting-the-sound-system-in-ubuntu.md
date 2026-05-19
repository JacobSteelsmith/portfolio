---
title: "Restarting the sound system in Ubuntu"
date: 2009-02-12
---

There is a really annoying bug that crops up sometimes in which you will get an error message similar to "xine was unable to initialize any audio drivers" or in KDE 4.2 "The audio playback device HDA Intel (AD198x Analog) does not work. Falling back to ."

To fix this, I would normally reboot, but I found [a page that specified how to restart the sound system](http://ubuntuforums.org/showthread.php?t=452448&page=2). The instructions, unfortunately did not work for me, and I could not post a follow up.

First run:

$ lsof | grep pcm

And you may see a couple of lines pop up. The first word will be the process and the number following should be the PID. In my case it was npviewer. (which should be followed by bin but was cutoff) and then 1364.

Then:

$ kill -9 1364

You can also use sudo if the process doesn't die.

The page I found says you then use:

$ sudo /etc/init.d/alsa-utils restart

to restart the sound. However, this did not work for me until I first restarted hal:

$ sudo /etc/init.d/hal restart

I was then able to play music using Amarok 2 again. When you restart hal, you may find that your USB devices are unmounted, so you may have to plug them in again.