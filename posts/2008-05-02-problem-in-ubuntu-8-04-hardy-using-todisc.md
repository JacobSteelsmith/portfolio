---
title: "Problem in Ubuntu 8.04 Hardy using todisc"
date: 2008-05-02
---

After using tovid to create a video, I would normally use todisc to create the DVD file structure, but ever since my installation of Ubuntu 8.04 Hardy, I kept getting this error:
sox soxio: Failed reading `-': unknown file type `raw'
[Sox](http://sox.sourceforge.net/) is a utility used to process audio. The default Hardy installation of tovid [doesn't install some necessary libraries and dependencies by default](https://bugs.launchpad.net/ubuntu/+source/tovid/+bug/207471). Use the command:
**sudo apt-get install libsox-fmt-all**
to correct this problem by installing the necessary libraries the sox utility needs to work with different audio formats. The libraries can be installed separately if you'd like, but all of the libraries use only 1,044 kb, so why not. The separate libraries are:
libsox-fmt-alsa libsox-fmt-ao libsox-fmt-base libsox-fmt-ffmpeg libsox-fmt-flac libsox-fmt-gsm libsox-fmt-mp3 libsox-fmt-ogg libsox-fmt-oss libsox-fmt-sndfile