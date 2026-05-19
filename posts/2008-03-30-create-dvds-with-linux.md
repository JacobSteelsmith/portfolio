---
title: "Create DVDs with Linux"
date: 2008-03-30
---

Creating DVDs using mostly any playable file (.avi, .mpg, etc.) is very easy in Linux and, in my opinion, is easiest using the command line.

First, you'll need to install the [tovid suite of tools](http://tovid.wikia.com/wiki/Main_Page). Tovid contains everything you need to convert a video to DVD format and to burn that video.

[Instructions for installing tovid can be found here](http://tovid.wikia.com/wiki/Installing_tovid/Ubuntu) although because tovid is not in the Ubuntu repositories, you'll have to install it manually. This isn't as scary as it sounds because there's a deb package available. Once you download the deb, right click on it and choose open with **Gdebi package installer**, or use the command:

`$ sudo dpkg -i tovid\_0.31\_all.deb`

Instructions for installing under other Linux distributions can be found on the website.

\*UPDATE\*

I guess, as of 8.04, tovid can be installed using the command

`$ sudo apt-get install tovid mencoder dvdauthor imagemagick`

However, there are missing components at this time. See http://jacob.steelsmith.org/content/makedvd-problems-tovid-hardy and follow the installation instructions above for downloading and installing the deb from tovid's site.

\*\*\*\*\*

The first step is to convert the movie to mpg, dvd compliant format. This is done using the tovid command. There are many, many options which are documented in the manual. By the way, the manual for Linux commands and applications can be viewed using the man command. So for tovid:

`$ man tovid`

I have [reproduced the man page for tovid here](/content/tovid-man-page), but it looks much better viewing it in the command prompt.

The basic command looks like this:

`$ tovid -in movie.avi -out movie.encoded`

This will convert the file movie.avi to a compliant movie named movie.encoded.mpg. The default output is dvd format with ntsc compatibility standard at a quality of six out of ten.

The only variations I have really used when using this tool are using the -ntscfilm flag, using the noask flag so it deletes the temporary files without waiting for confirmation, and adjusting the quality to eight or nine. You can specify the aspect ratio, but it's not needed. So the new command would be:

`$ tovid -quality 9 -ntscfilm -noask -in movie.avi -out movie.encoded`

Simple, no? So the next step is to convert the encoded, compliant file into a dvd structure. To do this, you will need to use the command todisc.

Again, there are many, many options for the todisc command. Use the [man command for todisc, or follow this link](/content/todisc-man-page).

The basic command for todisc is:

`$ todisc -files file1.mpg -titles "File one" -out NEW\_DVD`

which will create a DVD file system in the folder NEW\_DVD. I will also create the menu structure and let you preview it. Again, there are many, many options. I use -aspect 16:9 and -widescreen nopanscan if the film is wide screen because the aspect ratio can get skewed every one in a while if not specified. I also use -menu-title to set the main menu title of the disc. If that is not specified, it will read "My music collection."

If you have multiple videos you want to put on one dvd, you do that here, after converting them with tovid of course. Now, I've also read in the manual that if they are not converted, todisc will run them through tovid to convert them, but I haven't tried this.

So a more complex DVD would look like this:

`$ todisc -menu-title "My disc" -aspect 16:9 -widescreen nopanscan -files file1.mpg file2.mpg -titles "File one" "File two" -out NEW\_DVD`

After the file structure is created, you can use makedvd to burn the file system to disc.

`$ makedvd -burn -device /dev/scd1 NEW\_DVD`

The burn command specifies we're burning the disc and the -device flag specifies the device to use. I find the device by hovering over the icon that appears on the desktop in Kubuntu when a blank dvd is inserted.

After that command, you should have a working DVD. 