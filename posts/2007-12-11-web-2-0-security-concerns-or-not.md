---
title: "Web 2.0 security concerns or not"
date: 2007-12-11
---

[Jeff](http://lordjester.com/blog) pointed me to [an article, supposedly breaking news, that described a "new" "web 2.0" threat](http://www.itnews.com.au/News/66658,trojan-20-crafted-using-web-20-technology.aspx), trojans using XML feeds as command and control, and using social networking sites, or other "web 2.0" sites like [MySpace](http://myspace.com/) to store stolen information.

Hyped much? When you get down to it, RSS, xml-rpc...they're merely calling a web page using a standard and getting an XML document. And MySpace is NOT a web 2.0 website, if there even is such a thing. I can't stand the buzz word "web 2.0." Just say ajax with standards compliance! =) Both of which, MySpace has not (last I checked anyway). "Web 2.0" (yuck) is clean, bubbly, and fast (ajax)...again, definitely not MySpace.

But I digress. This security company is claiming these are new threats, when really, calling a web page has been around since the beginning of the internet. It is, after all, the nature of the internet. I assume the reason trojan makers have not used this method of receiving commands via the web (if they haven't) is because it's not encrypted.

So, for this to work, and be new, the trojan would have to be able to publish information using xml-rpc on an legitimate site. Is this possible?

Afterall, websites have been compromised for quite a while now. xml-rpc publishing requires authentication (or they'd better), so the trojan would have to hack the site at that point (not new), and the website would have to be widely published. The trojan would also have to either pass the commands/data in clear text, or encrypt it on their side.

If the commands were passed in clear text, the RSS feed being read by the trojan would show the command in clear text. If not, it would be gobbly gook. The only other option I see would be to translate legitimate looking headlines into commands...easily broken and noticeable on most sites.

So what exactly is "new" here? Well, the article claims trojans can bypass security metrics (i.e. port blocking and monitoring) by transmitting information to regularly used ports. So:

![Security model.](/files/from-old-blog/2007/12/sec-model.JPG)

This method would have always worked for receiving commands. What about sending them? Compromised scripts (PHP, ASP) would do the trick..or compromised sites hosting those scripts.

But syndication (think "Web 2.0") and xml-rpc is not open to my knowledge...you can't just call an xml-rpc page and post content without authentication. And if you can...that needs to be fixed. So your trojan would have to have compromised the server...also not new.

If you stop the treat at the server (again, not new), this model doesn't work. I see what they are saying, it is possible for 500 sites to be syndicating an RSS feed from a compromised website, possibly syndicating malicious commands, code etc...but it's pretty far fetched and isn't really an unstoppable, doom and gloom, can't beat it model. If something like this ever took hold, an engine would have to simply look at where the xml feed was hosted, and block communication with that website, notifying the administrator of the website, right? But I don't see a website administrator overlooking strange RSS feeds or weird syndicated content. Or am I missing something?