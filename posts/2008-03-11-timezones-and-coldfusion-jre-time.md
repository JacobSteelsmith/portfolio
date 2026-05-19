---
title: "Timezones and Coldfusion / JRE Time"
date: 2008-03-11
---

I get into work today and have a help desk ticket stating that the time on our servers is off. Well, not quite.

The issue is the time in ColdFusion does not match the time the servers have. We "sprang forward" on Sunday, March 9th, but any time functions reported the time one hour behind. ColdFusion, it seems, forgot to spring.

After testing the fix, it seems that the JRE needed to be upgraded to 1.4.2\_11 from 1.4.2\_9. [Instructions for upgrading the ColdFusion Java runtime environment can be found here, at stillnetstudios.com.](http://www.stillnetstudios.com/2007/02/24/upgrading-the-coldfusion-jvm-on-linux-and-windows/)

This upgrade probably should have happened previous to the DST update, last year. 