---
title: "Vista, IE 7 And Secure Certificates"
date: 2007-06-27
---

I ran into a strange problem at work today. We have a web server on which is installed a self-generated SSL certificate. This page has worked fine as far as I know for several years. The certificate, however, was not generated for the URL and is therefore not valid. This is something we were going to get around to fix, but it looks like we'll have to do it sooner than later.

Normally, in Windows XP with Internet Explorer 7 and 6, Firefox on Windows and Linux and many other browsers and platforms I assume, a prompt is shown to the user asking if they want to connect to the website anyway.

In this situation, using Vista with IE 7, I couldn't even load the page. It just sat there loading for several minutes while FireFox loaded it right away. After a quick Google search, it turns out IE 7 has problems with certificates in more than one situation.

Looks like M$ still hasn't got it right. If it was up to me, instead of "fixing" something just for IE once again, I'm tempted to put a link on the page to download FireFox.