---
title: "Gmail as the KDE default email client"
date: 2009-10-23
---

I just got GMail working as the default email client for KDE. To do this, go to KDE Menu -> Computer -> System Settings and click on Default Applications.

There are plenty of notes on getting this working out there, but getting the subject and body working can be tricky. Select the radio button next to **Use a different email client:** and enter the following:

/opt/google/chrome/chrome https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=%t&su=%s&%u

replacing /opt/google/chrome/chrome with the command for your browser.

This is somewhat of a hack because percent t (%t) is the to part of the mailto URL and percent s (%s) is the subject, but I don't think KDE properly extracts and sends the body. So using an ampersand and percent u (%u) at the end will send the entire mailto URL.

So the final URL might look like:

https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=test@test.com&su=Test%20subject&mailto:test@test.com?subject=Test%20subject&body=Test%20body

GMail will ignore mailto:test@test.com?subject=Test%20subject but uses the body URL parameter. I used a script to echo percent a (%a) through percent z (%z) and it seems only percent s, t, and u are implemented.