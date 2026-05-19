---
title: "Ubuntu kiosk based on 10.04.1"
date: 2011-05-24
---

**\*\*The latest update broke the kioskfox plugin\*\***
See [here for instructions on fixing it](http://jacob.steelsmith.org/content/latest-firefox-update-incompatible-with-kioskfox-plugin-and-how-fix-it).
The links for the new build based on Ubuntu 10.04.1 are below, along with the zip file containing the scripts. Contributions are welcome and please [contact me](/contact) or comment below with questions and complaints.
This is live CD that can be installed to disk that is tailored for use as a public internet kiosk. There are 19 scripts included that perform various actions. This started several years ago after a need arose for secure and stable web kiosks around our college campus.
Once setup and locked, the kiosk will boot straight to a full screen Firefox that has a logout button thanks to [kioskfox](https://addons.mozilla.org/en-us/firefox/addon/kioskfox/). It boots very fast and is very stable.
Thanks to Alex Zimmerman and [Everett Community College](http://www.everettcc.edu/) for facilitating the time needed for production and testing of this project.
Features and changes
--------
\* One click setup with prompts instead of running multiple scripts.
\* Better networking out of the box.
\* WPA setup and support via setup script wpa\_supplicant.
\* Dansguardian setup script for blocking websites.
Setup
------
Boot to the CD (or USB). Select the defaults for everything.
At the login screen, choose itadmin and use the password **changeme**.
To install the ubuntu kiosk:
Double click the install release icon on the desktop and follow the instructions. The user and password do not matter but should be filled in. Use the itadmin:changeme combo after install.
Reboot.
Run the setup-kiosk script. The individual scripts are in the scripts folder.
Be aware that, once locked, management access to the kiosk will only be available via SSH or by booting the machine to a kiosk CD and running unlock-host.
[ubuntu-kiosk-10.04.1-b4-v6.iso](/files/ubuntu-kiosk-10.04.1-b4-v6.iso)
[ubuntu-kiosk-10.04.1-b4-v6.md5](/files/ubuntu-kiosk-10.04.1-b4-v6.md5)
[scripts.tar.gz](/files/scripts.tar.gz)