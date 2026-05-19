---
title: "AWStats On IIS 6.0"
date: 2007-08-01
---

After setting up AWStats On IIS, I wanted to use awstats.pl instead of the static pages. I configured it according to what I found on the internet, but there was a problem. I would go to the awstats.pl and I would get the html on the page rather than the rendered html. I found the problem, but it requires editing awstats.pl.
On line 550, there is a function called http\_head. In line 553, the following line:
else { print "Content-type: text/html; charset=$PageCode\n"; }
should be changed to:
else { print "HTTP/1.0 200 OK Content-type: text/html"}
I then got rendered html instead of plain text.