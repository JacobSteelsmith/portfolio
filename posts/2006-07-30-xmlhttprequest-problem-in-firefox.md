---
title: "XMLHttpRequest Problem In Firefox"
date: 2006-07-30
---

The latest version of Firefox seems to have broken the XMLHttpRequest object. Specifically, if the asynchronous flag is set to false, the object will no longer function. I haven't done much research into this. I just wanted to jot a quick note. Set the asynchronous flag to true and everything should be fine.