---
title: "Groupwise 8 and Linux"
date: 2009-02-12
---

Installing the GroupWise 8 client on Ubuntu Linux 64 bit works great [using these instructions](http://www.novell.com/coolsolutions/tip/19592.html). Did I mention that the GroupWise 8 Linux client has Notify built in..and it works? =)
> CAVEAT: This has not been thoroughly tested, but "It works for me."
> The solution involves converting the Groupwise client RPM to tar.gz as other how-tos suggest, but it goes a step further by adding the prerequisite 32-bit libraries and a 32-bit Java, and modifying the client install to use a different JDK.
> I'm currently using this on Debian/AMD64, and it should work on IA32 as well, without having to add the extra libraries.
> If you have trouble with Java 6, you may try using any other JVM you like.
> 1. Install prerequisites - run the following commands ...
> On amd64:
> # apt-get install ia32-libs
> # apt-get install ia32-sun-java6-bin
> On ia32:
> # apt-get install sun-java6-bin
> On both:
> # apt-get install alien
> 2. Download the GroupWise client (http://download.novell.com).
> 3. Convert the groupwise client RPM to tar.gz:
> # alien -t --veryverbose novell-groupwise-gwclient-7.0.1-20060627.i386.rpm
> 4. As root, untar the newly created tarball. Make sure you untar this from "/".
> # cd /
> # sudo tar xzvf /path/to/novell-groupwise-gwclient-7.0.1.tgz
> 5. Identify your JVM. Debian puts JVMs under /usr/lib/jvm.
> # ls -l /usr/lib/jvm
> ia32-java-6-sun
> ia32-java-6-sun-1.6.0.02
> java-6-sun
> java-6-sun-1.6.0.02
> We'll be using the "ia32-java-6-sun" that we installed previously.
> 6. Change the JRE that the groupwise client uses. I rename the original JRE directory rather than delete it.
> # cd /opt/novell/groupwise/client
> # sudo mv jre jre.orig
> # sudo ln -s /usr/lib/jvm/ia32-java-6-sun/jre ./jre
> 7. Try it out:
> # /opt/novell/groupwise/client/bin/groupwise
> Enjoy the Novelly goodness.