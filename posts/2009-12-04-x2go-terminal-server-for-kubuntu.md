---
title: "x2go terminal server for Kubuntu"
date: 2009-12-04
---

[Linux Magazine](http://www.linux-magazine.com/Issues/2009/98/Staying-Thin) ran an article highlighting x2go, a free, open source terminal server project that includes clients that run on any Linux distribution, and Windows as well.
In short, you can easily install the server on your Ubuntu or Kubuntu desktop, install the client on another Linux, Maemo, Mac, or Windows client, and connect and login to your Ubuntu or Kubuntu box at home. X2go uses SSH and compression for secure, full, and fast access to your desktop, just as if you were logging in at the host itself.
As frequently is the case in the Linux world, there are multiple ways to achieve a goal, and remote desktop is no exception. Two methods that come to mind are desktop sharing and tunneling X over ssh. But x2go offers many more features, is much easier to setup, and seems more secure than the fore-mentioned methods.
However, x2go is more than remote desktop software. Terminal server software provides a separate desktop session and x2go takes terminal server a step further, adding the ability to pause your session and resume it at a later time from any client, among other features such as adding shared folders on the client.
I installed x2go server on Kubuntu 9.10 and it seems to work great aside from the lack of sound. The installation was the one of the easiest I have experienced, and the server requires no configuration. In fact, there are only two sets of settings in /etc/x2go/x2goserver.conf, one set for restricting users and another for restricting groups. As usual, rebooting was not required on either the server or client side.
To [install](http://x2go.org/index.php?id=26), you'll need to add the repository, so use the following command
to add the gpg keys for the repository.
`$ gpg --keyserver wwwkeys.eu.pgp.net --recv-keys C509840B96F89133 && gpg -a --export C509840B96F89133 | sudo apt-key add -`
Then you'll need to add the repository
`$ echo 'deb http://x2go.obviously-nice.de/deb/ lenny main' >> x2go.list && sudo mv x2go.list /etc/apt/sources.list.d/ && sudo apt-get update`
Next, you'll need to install the x2go server and client.
`$ sudo apt-get install x2goserver-home x2goclient`
To keep things clean, I disabled the repository by using
`$ sudo nano -w /etc/apt/sources.list.d/x2go.list && sudo apt-get update`
and adding a # in front of the deb line. Hit ctrl+o then enter to save then ctrl+x to exit. This is optional, but if you do this, remember to enable it to get updates for these packages.
**Note:** The documentation states that if you're using KDE, you must install x2gokdebindings. I did not do this and it seems to work fine, although I may be missing additional functionality.
You will then be able to install the client program on your client by adding the repository and just installing the x2go client. To connect using a Windows host, just download the Windows client.
Once you start x2goclient (it's in your menu), you're faced with setting up a new connection.
![x2go-setup1](/files/imagepicker/j/jacob/setup.png)
You'll want to fill in the host, or IP of the server, the user name, if any, and the ssh port. You might want to rename the session at the top, and even change the icon. The RSA/DSA key for ssh connection is for specifying your private key if you are using [public key authentication for ssh](http://sial.org/howto/openssh/publickey-auth/). If you use this with a user name, you will not be prompted to authenticate.
![x2go-setup2](/files/imagepicker/j/jacob/setup2.png)
On the connection tab, specify your connection speed and, if you'd like, your compression method and image quality. I didn't adjust the last two settings.
![x2go-setup3](/files/imagepicker/j/jacob/setup3.png)
On the settings tab, specify the display size, and if you'd like the DPI. I tried all the sound specifications here, but didn't get sound on the client. I didn't adjust the DPI setting.
![x2go-setup4](/files/imagepicker/j/jacob/setup4.png)
The shared folder feature is extremely useful. You specify a folder on the client, choose automount, and the folder will be mounted in /tmp. You can easily transfer files between the client and server this way.
![x2go sign in](/files/imagepicker/j/jacob/sign-in.png)
After the session is setup, just click on it to start the session. Again, I didn't get prompted to login due to public key authentication, but if you're not using it, you will be prompted.
![x2go login screen saver](/files/imagepicker/j/jacob/screen-saver.png)
After the session starts, you will be presented with a re-sizable, fully functional, windowed desktop that is running from your server. If you choose full screen mode, your entire display will be taken up by the client display. I am not sure how this works on dual displays, but I know the display is resized for smaller displays. I choose to let applications cover my KDE task bar and just use the maximize function of the window.
I will pause here to highlight one of the features. Normally, you would see the normal KDE startup. But I had suspended the session to take screen shots, then resumed it. I was taken to the screen saver for the session, where I entered my password to unlock it. I am not aware of the ability to pause a session, then resuming from any client on the other two, fore-mentioned methods of remote desktop using Linux.
![x2go desktop](/files/imagepicker/j/jacob/desktop.png)
After logging in I have my fully functional desktop, well, minus the sound and shutdown and restart options. I haven't played around too much with it, but have found it to be extremely useful when working on my laptop at my home. There are many more features like printing and running a single application that I have yet to explore.
I have used it for many hours already with only one disconnection issue. I simply reconnected and resumed the same session I was using previously.
With the ease of installation and no configuration on the server, x2go is definetly worth a look, and is by far the best remote access or terminal server solution I have seen yet. I will certainly use x2go as my sole means of remote access. I have implemented LTSP in an enterprise environment, but that was for anonymous kiosks and, if logging into a central server was a requirement, I would definitely choose x2go for it's ease of setup and use. 