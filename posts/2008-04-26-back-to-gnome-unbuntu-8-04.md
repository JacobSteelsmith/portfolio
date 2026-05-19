---
title: "Back to gnome (Unbuntu 8.04)"
date: 2008-04-26
---

### Gnome vs KDE

I decided to go back to Ubuntu at home. I was having a tough time deciding which version of Ubuntu I wanted to use when I realized I can just use Ubuntu at home and Kubuntu at work. I had originally installed Ubuntu with Windows and have done quite a bit of work on Ubuntu experimenting and installing from source, so I felt like I needed a clean system.
After watching Microsoft bully Yahoo and after reading [an interview with Bill Gates in which he trashes the open source license](http://arstechnica.com/journals/microsoft.ars/2008/04/23/bill-gates-the-gpl-which-we-disagree-with), I feel I need to distance myself from Microsoft as much as possible. So I scrubed the Windows dirtyness off my drives for good and reinstalled.
BTW, this is what bill said:
> "There's free software and then there’s open source," he suggested, noting that Microsoft gives away its software in developing countries. With open source software, on the other hand, "there is this thing called the GPL, which we disagree with." Open source, he said, creates a license "so that nobody can ever improve the software," he claimed, bemoaning the squandered opportunity for jobs and business. [Editor's note: Yes, Linux fans, we're aware of how distorted this definition is.] He went back to the analogy of pharmaceuticals: "I think if you invent drugs, you should be able to charge for them," he said, adding with a shrug: "That may seem radical."

I think what he meant when he said "nobody can ever improve the software," was he can't steal the software, copyright it and profit from it, like he has in the past. You can improve open source...the license just says you can't distribute it without the same rights you have with it. Fair, no?
There really is no competition between Gnome and KDE anymore, although each has it's good points. I believe this will change with KDE 4 (from what I saw, I didn't like it at all).
Ubuntu is much more fun and user friendly in my opinion. This isn't necessarily a good thing in some situations as it restricts the advanced configuration of many different aspects of the operating system. For example, you cannot configure the individual screen savers easily.
But the interface seems more polished. The add remove programs is friendlier than the package manager and when opening a remote share, it's automatically added to your places menu and the desktop. Like I said, more user friendly.
And AWN is really cool.
I'm still working with Gnome and without KDE to try and do everything I can using Kubuntu and I haven't been disappointed.

### A look at 8.04

Ubuntu 8.04 has a couple of downfalls, but overall installs very easy, boots very quickly and is very compatible with my system.
**Firefox 3 Beta 5**
This is the default version of firefox that comes with Ubuntu. I'm not so sure this was a good idea, although the browser is very fast and mostly bug free, it still has it's issues and most add ons aren't compatible.
**NVIDIA restricted drivers**
The restricted driver manager said the nvidia\_new driver was installed but not in use. I checked the check box twice to try to enable it, to no avail. I eventually had to install it myself (it wasn't installed) and edit xorg.conf. I think the developers were trying to avoid the editing of files.
**VMWare server is gone**
The vmware-server package is gone. Apparently it is not compatible with the new kernel. The Ubuntu team is promoting KVM as a replacement and VirtualBox is also available.
Well, KVM won't run with my processor, but VirtualBox does. However, my existing Windows 2000 virtual machine, created with VMWare will not boot.
But overall, a very, very good distro with lots of improvements, both front end and back end. 