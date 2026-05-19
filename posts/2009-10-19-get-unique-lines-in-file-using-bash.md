---
title: "Get unique lines in file using bash"
date: 2009-10-19
---

I had to take a closer look at a distributed attack on one of our web servers today. The attack only involved around 50 hosts which seemed to be testing our URL parameters for injection susceptibility. Coldfusion has some protection against SQL injection, and we take extra steps, as every programmer should, to guard against it.

After identifying the attack vector, I was able to grep the log file for the signature of the attack which was present in the URL information.

I ended up with around 400 lines of log entries for this attack and wanted to find out how many unique IP addresses were accessing the server.

Using a combination of cat, cut, and sort it was a piece of cake.

$ cat file.log | cut -d ' ' -f7 | sort -u > ips.txt

After running this command, you should have a sorted list of unique ip addresses from the log. Let's break this command down.

cat

---

The cat command is one of the most used commands in the world of the Linux command line. It is used to concatenate files and print on the standard output. Here is cat in it's simplest form.

$ cat file.log

This will output the contents of the file file.log to the screen. We can "pipe" that output to another command, as we did above, or the > character can be used to send the information to a file, again like we did above with the result of the chain of commands we used.

Using the > redirection operator with a file will **overwrite** whatever is in that file. To append the output to the file, use >>.

To concatenate two files, use the command as follows.

$ cat file1.txt file2.txt > combined.txt

Pipe character |

----------------

The pipe character will take the output from the command on the left, and feed it to the input for the command on the right. The pipe command is used to chain commands together, rather than writing and reading files and variables.

cut

---

The cut command is a very versatile command. The [man page for cut](http://linux.die.net/man/1/cut) says it's used to "remove sections from each line of files." In our example above, we used it to get the seventh "column" from the file.

What I mean my column is the way the log file is created by the server. Try to imagine a file in a format similar to the following.

date time method page url ip user-agent response

This is not the exact format of the log I was working with, but it works for this example.

The -d switch for the cut command tells the program what the delimiter is. Sometimes it will be a comma, but in our example, and my log file, it's a space. This can be problematic if there are spaces within the "column." Say if the user agent had a space in it.

The -f switch tells cut which field to print. So -f7 means print the seventh "column." In our example, it's "user-agent" and in my log, it's the IP address.

The catch with this command is, if it's used as above, and a line does not contain the delimiter, it will print the line. So if there was a line that did not have a space, it would print it. This behavior can be suppressed using the -s switch.

sort

----

The sort command is used to write sorted concatenation of all files specified to standard output. Like cat, multiple files can be specified.

The -u switch tells sort to output only unique lines.

man

---

The man command is a superb resource for learning how to use commands in Linux. Most programs have a man page associated with them. The man command should be built into your system and is accessible by using it in combination with the command as in the example below.

$ man sort

This will output a formated help page for the command sort. It describes what the command does, the switches the command has, and what they do, as well as the syntax of the command. Often times, there are examples of the command included.

In fact, while writing this, I learned from the man page that, instead of using the command uniq, I was able to use the -u switch for the sort command. Linux is a very powerful, and free platform and tool for systems administration. An investment of a little patience and time in Linux will pay off greatly for the overburdened administrator. 