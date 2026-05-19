---
title: "Sound not synchronized when creating a DVD using tovid"
date: 2008-03-31
---

When creating a DVD using tovid/todisc, I have found that on one .avi movie I tried to convert, the sound was out of sync by more than a few seconds.

To fix this, I used the -ffmpeg switch when converting using tovid, which uses a different method of encoding. Strange that it's not the default as it was much faster and seemed to produce a better outcome. 