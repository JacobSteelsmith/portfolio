---
title: "Copy DVD in Kubuntu (Ubuntu)"
date: 2007-12-02
---

I have been struggling with copying a DVD in Linux. I like to copy the ones I purchase in case they get damaged.

In any case, copying a dvd in kubuntu (or ubuntu) requires the installation of libdvdcss2, which isn't easily found.

I finally found the answer here:

<https://help.ubuntu.com/community/DVD::Rip>

Using the following lines, the library is installed and K3b (and other applications) can read an encrypted DVD.

sudo apt-get install libdvdread3 debhelper fakeroot

sudo /usr/share/doc/libdvdread3/examples/install-css.sh

# or if that last line didn't work

sudo /usr/share/doc/libdvdread3/install-css.sh

As you can see, libdvdcss2 is downloaded and compiled using a script. It's not available in the repositories due to legal issues. It's illegal to copy an encrypted DVD because of widespread piracy. I believe I've read that it's ok to make a backup copy of DVDs you've purchased.

\*\*update\*\*

I still cannot copy some DVDs with k9copy as it seems to fail in constructing the menus for the DVD.