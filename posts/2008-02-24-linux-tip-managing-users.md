---
title: "Linux tip: Managing users"
date: 2008-02-24
---

Managing users is easily done via the command line in Linux. For example, to get a list of users currently logged on, you can use the **who** or **w** command.
jsteel@jsteel-desktop:~$ w
17:08:34 up 10 min, 1 user, load average: 0.44, 0.63, 0.46
USER TTY FROM LOGIN@ IDLE JCPU PCPU WHAT
jsteel :0 - 16:58 ?xdm? 60.26s 0.04s /bin/sh /usr/bi
jsteel@jsteel-desktop:~$ who
jsteel :0 2008-02-24 16:58
jsteel@jsteel-desktop:~$
The output of both commands is similar but the **w** command shows much more information. It shows you output similar to the beginning of [the top command](/content/linux-tip-get-real-time-system-information) which includes the up time, the number of users an the average load.
It also lists the users logged into the computer, the terminal they are logged in to, where they are logged in from, the login time and what commands they are running among other information.
If there were users logged into this machine via ssh, they would show up in the output of this command and their IP address would be listed under FROM. Also, the TTY entry would look similar to pts/x where x is the terminal number. I believe pts stands for pseudo-terminal slave. The pseudo-terminal is a virtual terminal, meaning the user is not sitting at the keyboard.
Linux was designed to be a multi-user operating system. It is feasible to have multiple users using the same computer using multiple monitors and keyboards. I saw this at pizza hut as they use a unix based system with multiple terminals connected to one machine.

### Killing a user's session

You can end a user's session by using the skill command. You can do this using a few different methods:
jsteel@jsteel-desktop:~$ skill
Usage: skill [signal to send] [options] process selection criteria
Example: skill -KILL -v pts/\*
The default signal is TERM. Use -l or -L to list available signals.
Particularly useful signals include HUP, INT, KILL, STOP, CONT, and 0.
Alternate signals may be specified in three ways: -SIGKILL -KILL -9
General options:
-f fast mode This is not currently useful.
-i interactive use You will be asked to approve each action.
-v verbose output Display information about selected processes.
-w warnings enabled This is not currently useful.
-n no action This only displays the process ID.
Selection criteria can be: terminal, user, pid, command.
The options below may be used to ensure correct interpretation.
-t The next argument is a terminal (tty or pty).
-u The next argument is a username.
-p The next argument is a process ID number.
-c The next argument is a command name.
jsteel@jsteel-desktop:~$
As you can see, you can use skill -KILL -u  to log the user off. You will need to use sudo. You can also use skill -KILL -t tty/x where x is the number of the terminal. This terminal can be virtual or a physical terminal.

### User history

Using the **last** command, you can see a history of logins from users as well as reboots issued from the kernel (which is all reboots):
jsteel@jsteel-desktop:~$ last
jsteel :0 Sun Feb 24 16:58 still logged in
reboot system boot 2.6.22-14-386 Sun Feb 24 16:58 - 17:24 (00:26)
jsteel :0 Sun Feb 24 08:22 - 08:24 (00:02)
reboot system boot 2.6.22-14-386 Sun Feb 24 08:01 - 08:24 (00:23)
jsteel :0 Thu Feb 21 22:05 - 19:36 (1+21:31)
jsteel pts/1 xxx.xx.xx.xx Thu Feb 21 15:11 - 15:12 (00:00)
...
...
wtmp begins Fri Feb 1 10:20:13 2008
jsteel@jsteel-desktop:~$