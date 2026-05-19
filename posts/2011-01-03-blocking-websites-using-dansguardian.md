---
title: "Blocking websites using Dansguardian"
date: 2011-01-03
---

**Implementation for kiosk.**

1). Changed the homepage of the kiosk user to an allowed website by editing /home/kiosk/.mozilla/firefox//user.js

2). Installed and configured dansguardian using the directions here:
<http://ubuntuforums.org/showthread.php?t=207008>

a). `sudo apt-get install dansguardian tinyproxy firehol`

b). Change the user's home page in firefox by editing /home/user/.mozilla/firefox//user.js

c). edit /etc/dansguardian/dansguardian.conf and comment the line that starts with UNCONFIGURED

d). run `sudo dpkg-reconfigure dansguardian` at the command line

e). Make the file /etc/firehol/firehol.conf have at least these options (without the four dashes at the top and bottom):

```
iptables -t filter -I OUTPUT -d 127.0.0.1 -p tcp --dport 3128 -m owner ! --uid-owner dansguardian -j DROP
transparent_squid 8080 "root root"
interface any world
policy drop
protection strong
client all accept
server cups accept
```

f). Make the file /etc/tinyproxy/tinyproxy.conf have at least these options:

```
User root
Group root
Port 3128
ViaProxyName "tinyproxy"
```

g). Edit /etc/default/firehol and set `START_FIREHOL=YES`. Run `/etc/init.d/firehol restart` to restart and run `sudo get-iana` (if it fails, ignore it)

h). Restart firehol, tinyproxy, and dansguardian (`sudo /etc/init.d/ restart`)

i). To blanket block, edit /etc/dansguardian/lists/bannedsitelist and uncomment `**` under Blanket Block.

j). Add the accepted sites to /etc/dansguardian/lists/exceptionsitelist

3). Edited /etc/dansguardian/languages/ukenglish/template.html to include nothing but a meta refresh and an empty body.

4). Restart dansguardian `sudo /etc/init.d/dansguardian restart` (sometimes you have to use stop, then start if restart fails)

To view blocked sites:

`$ less /var/log/dansguardian/access.log`

or

`$ grep DENIED /var/log/dansguardian/access.log | less`

---

To change the "Access to web site blocked" page, go to /etc/dansguardian/languages and edit the template.html for your language. Use a meta refresh tag to send people back to a specific website.
