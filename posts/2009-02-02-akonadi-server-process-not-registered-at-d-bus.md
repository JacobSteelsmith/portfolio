---
title: "Akonadi server process not registered at D-Bus"
date: 2009-02-02
---

If you're using Kubuntu with KDE 4.2 and keep getting an error when akonadi starts up, which lists "Akonadi server process not registered at D-Bus" as the first error, try the following:
$ sudo aa-complain mysqld-akonadi
$ sudo /etc/init.d/apparmor reload
Kubuntu uses apparmor to block certain actions on the system. The new akonadi system KDE uses attempts one of these actions. The commands above simply tells apparmor to log the action rather than block it.
Then, use:
$ akonadictl stop
to stop the service, then
$ akonadictl start
to start it. Do NOT use sudo for these last two commands.