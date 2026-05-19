---
title: "Latest Firefox update is incompatible with the kioskfox plugin (and how to fix it)"
date: 2012-02-22
---

The latest Firefox update broke the kioskfox plugin. Well, not really broke it, but Firefox says it's incompatible and it cannot find an updated version. It's an easy fix that seems to work well.
If you are using the kiosk build from this website, use the command:
> $ sudo nano -w /home/kiosk/.mozilla/firefox/obw0c5n2.default/extensions/{24731AD7-300A-4c5a-A4AC-F8599DA482E2}/install.rdf

Change the line that reads **<em:maxVersion>3.6.\*</em:maxVersion>** to read **<em:maxVersion>10.\*</em:maxVersion>**
This should be safe, and it seems to work well. However, it's possible that future upgrades of Firefox may change features that this plugin depends on, and that could cause unexpected results.
I will look for a permanent solution for this with the next kiosk build.