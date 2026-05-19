---
title: "Podcast ordering in Amarok"
date: 2008-08-14
---

In Amarok, under KDE 3.5, podcasts seem to be in a scrambled order. They definitely aren't in the order the author of the podcast put them in. This is a known bug and is going to be fixed in the next version of Amarok due out very soon.
As a temporary work around, I am using Firefox's ability to subscribe to XML feeds and have associated MP3 files with Amarok inside Firefox.
Going to an XML feed will produce a clean page in Firefox. At the top of the page, you will have an option to subscribe to the feed using Live Bookmarks. The feed will then appear towards the top of the browser underneath the address bar.
You can then click on an entry in the feed and your browser should prompt you to download the MP3 file if you don't have an association. Clicking on open this file with another application, click browse and navigate to /usr/bin/amarok and check the box that says "Do this automatically for files like this from now on."
Now, when you click on an entry in an XML feed in Firefox, and it's an MP3 file, as in a podcast, it will download the file to the temporary directory (/tmp) and play it using Amarok.