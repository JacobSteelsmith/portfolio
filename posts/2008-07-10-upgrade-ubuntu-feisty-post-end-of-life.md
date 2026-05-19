---
title: "Upgrade Ubuntu Feisty post end of life"
date: 2008-07-10
---

Last month, Feisty (Ubuntu 6.10) reached end of life. This means that support is no longer offered, updates are no longer being released and, much to my surprise, [the repositories are gone](http://packages.ubuntu.com/). Well, not gone, but moved.

To upgrade a server running Feisty, as I recently had the pleasure of doing, there is an extra step you must take. By the way, it is always good to use LTS releases. For one, [they are supported for five years](http://www.ubuntu.com/getubuntu/download) (three years on the desktop) and the LTS releases always have an upgrade path from the previous LTS release.

Because this server was not running a LTS release, I had to upgrade to each version in sequence. Not too much trouble, just time consuming.

In any case, back to Feisty. Because the repositories are moved, the tool to upgrade the server distribution, found in the package update-manager-core, is not available. To install the tool, edit your sources.list file:

`$ sudo vim /etc/apt/sources.list`

and replace the repositories with:

deb http://old-releases.ubuntu.com/ubuntu/ edgy main restricted

deb-src http://old-releases.ubuntu.com/ubuntu/ edgy main restricted

deb http://old-releases.ubuntu.com/ubuntu/ edgy-updates main restricted

deb-src http://old-releases.ubuntu.com/ubuntu/ edgy-updates main restricted

deb http://old-releases.ubuntu.com/ubuntu/ edgy universe multiverse

deb-src http://old-releases.ubuntu.com/ubuntu/ edgy universe multiverse

deb http://old-releases.ubuntu.com/ubuntu edgy-security main restricted

deb-src http://old-releases.ubuntu.com/ubuntu edgy-security main restricted

Update your sources and install the upgrade tool:

`$ sudo apt-get update && sudo apt-get upgrade && sudo apt-get install update-manager-core`

Now run the upgrade:

`$ sudo do-release-upgrade`

The tool will run for a minute, then give you an error about your repositories saying they are invalid and would you like to update your repositories. You will be prompted with a Continue [y/N]:

You will want to open up another terminal, or in my case ssh in again, and edit your sources.list again, replacing them with:

deb http://us.archive.ubuntu.com/ubuntu/ edgy main restricted

deb-src http://us.archive.ubuntu.com/ubuntu/ edgy main restricted

deb http://us.archive.ubuntu.com/ubuntu/ edgy-updates main restricted

deb-src http://us.archive.ubuntu.com/ubuntu/ edgy-updates main restricted

deb http://us.archive.ubuntu.com/ubuntu/ edgy universe multiverse

deb-src http://us.archive.ubuntu.com/ubuntu/ edgy universe multiverse

deb http://security.ubuntu.com/ubuntu edgy-security main restricted

deb-src http://security.ubuntu.com/ubuntu edgy-security main restricted

Then go back to the original prompt and choose y. The tool will then succeed. After your initial upgrade, simply running do-release-upgrade will suffice.

Thanks to [geckoblue at LiveJournal](http://geckoblue.livejournal.com/222205.html) for the published tip.