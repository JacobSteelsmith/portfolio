---
title: "Bash: variables"
date: 2008-04-29
---

First in a series of notes in reference to shell scripting as I am just learning it myself. I have started on a script that will configure a bridged network interface for VirtualBox.
Working with variables in the shell is very easy.
`#set a variable
VAR="Hello World"
#output the same variable
echo $VAR
#assign a new variable
#the value of our old variable
VAR2="$VAR"
echo $VAR2`
Nothing too spectacular here. Notice the dollar sign when referencing the variable or outputting it. It is also advisable, except in the case of using echo, to quote your variables when referencing them. This prevents interpretation of any special characters or strings in the variable's value.
[More on quoting variables can be found in the ever popular Advanced Bash-Scripting Guide](http://tldp.org/LDP/abs/html/quotingvar.html).