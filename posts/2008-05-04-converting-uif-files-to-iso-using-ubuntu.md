---
title: "Converting uif files to iso using Ubuntu"
date: 2008-05-04
---

I had the need to convert a .uif file today. Most of the posts I saw mentioned using [wine](http://www.winehq.org/) and a program called [MagicISO](http://www.magiciso.com/). But, I finally found an easier and more \*nix way of accomplishing this.
The [brilliant Luigi Auriemma wrote and made freely available a small tool called uif2iso](http://aluigi.altervista.org/mytoolz.htm#uif2iso) which is a small utility that, as it implies, converts a uif file to a usable iso image.
Start by downloading the zip file from the link above and extracting the archive to a convenient place. Using Ubuntu, you'll need some dependencies as the readme states (uif2iso.txt):
`$ sudo apt-get install zlib1g zlib1g-dev libssl-dev`
Now, move to the src directory and make the executable:
**~/installs/source/uif2iso/src$ make** 

A few blips later and the binary is created. You can either execute the binary directly, or type **make install** to install it to /usr/local/bin/ so it can be referenced anywhere.
To convert the uif:
`$ uif2iso "my file.uif" shiny-new.iso`
And as the author notes:
> I don't like and don't approve the UIF format because it's proprietary
> and doesn't give benefits.
> What you can do with UIF can be done better with ZIP or 7zip without
> the need to be forced to buy a software like MagicISO only for burning
> an image.
> Ok exists my tool which can do the job but this is not a valid reason
> to continue to use this useless format.
> So if you want to create a CD/DVD image, DO NOT USE UIF!