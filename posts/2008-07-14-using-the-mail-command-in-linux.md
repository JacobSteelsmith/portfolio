---
title: "Using the mail command in Linux"
date: 2008-07-14
---

The mail command is a powerful command used to manage your local mail on a \*nix box. I use the mail command in (k)ubuntu frequently and have root's mail forwarded to my account on my boxes.

To use mail, you'll have to install the mailx package in (k)ubuntu.

`$ sudo apt-get install mailx`

When you login to your linux box via the command line you might see a message such as this:

jsteelsmith@localhost-10:~$ ssh user@example.com

Linux jacob-desktop 2.6.24-19-generic #1 SMP Wed Jun 18 14:43:41 UTC 2008 i686

The programs included with the Ubuntu system are free software;

the exact distribution terms for each program are described in the

individual files in /usr/share/doc/\*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by

applicable law.

To access official Ubuntu documentation, please visit:

http://help.ubuntu.com/

**You have new mail.**

Last login: Wed Jul 9 08:41:48 2008 from xxx.xxx.xxx.xxx

To access your mail, type:

**jacob@jacob-desktop:~$ mail**

Mail is a very powerful command and can be confusing to use at first. You can type help at the mail command line, which is the ampersand symbol: &. Also, see the man page for mail:

`$ man mail`

You will get a screen full of messages if you have a bunch, or just a few, but in any case if you have mail, you'll have a list of messages.

On each line that represents the message, you'll see a U for unread (or unopened), a number indicating the order, to, when, size?, from, subject.

To type the message the caret (>) is on, use t. To type another message, use tx, where x is the number of the email. To delete the email use dx, where x is the number of the email. You can also delete the email the caret is on using just d.

Do see the list again, use f1-x, which prints the headers of the messages 1-x, where x is a number. You can also use \*.

In fact any of the commands that have a [message list] after them in the help section can use the 1-x or \* format.

To quit the mail program, type quit on the command line. For some reason, typing exit to quit the program quits, but doesn't change your email box, saving the email you deleted. 