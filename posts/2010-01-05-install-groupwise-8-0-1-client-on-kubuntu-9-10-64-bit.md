---
title: "Install Groupwise 8.0.1 client on Kubuntu 9.10 64 bit"
date: 2010-01-05
---

While Novell supports Linux, it mostly supports SuSE, which uses rpm and not deb packages. But it's still fairly easy to install the Groupwise client on an Ubuntu based system.
First, you'll need some software to do this.
**$ sudo apt-get install ia32-libs ia32-sun-java6-bin alien** 
Then download the client. After you download it, use alien to extract the contents
**$ alien -t --veryverbose novell-groupwise-client-8.0.1-88138.i586.rpm**
This is scary, but it's really ok. Move to the root and extract the result of the command above. You can test it first to see what it will do. It will add files to /opt and /usr.
**$ cd /**
**$ sudo tar -xzvf /path/to/extract/gw8.0.1-88138\_client\_linux\_en/novell-groupwise-client-8.0.1.tgz**
You'll need to replace the included java install with the one installed by the prerequisites above.
**$ cd /opt/novell/groupwise/client**
**$ mv java java.org**
**$ sudo ln-s /usr/lib/jvm/ia32-java-6-sun/jre ./java**
You should be able to run the Groupwise client using the included script.
**$ /opt/novell/groupwise/client/bin/groupwise**
To add the menu item, copy the desktop file to your local applications folder.
**$ cp /opt/novell/groupwise/client/gwclient.desktop ~/.local/share/applications/**