---
title: "Operating on a subset of files"
date: 2008-04-02
---

One of the many powerful features of the GNU/Linux command line is the pipe character. The pipe character, or **|** is used to pipe the output of one command to the input of another command. For example, if you wanted to view all of the lines in a log file that have the number 500 in them (as I did on today on an Windows box), you could use this:
`$ grep ' 500 ' file.log | less`
Which pipes the lines you want to the less command, which displays them in the command line using less, which is used to read large text files in the command line. The less command allows you to move forward and back in the text, search, bookmark and much, much more. Use the command **man less** for more information.
Incidently, to save the output to a file, you can use something like this.
`$ grep ' 500 ' file.log > out.txt`
That will save the output to the file out.txt. Using **>>** will append the file (rather than clobber, or overwrite it).
Now for the title of this blog post, operating on a subset of files. I wanted to get rid of all the files on a share that ended with a ~ (the infamous backup files from some editors).
Using one command, I was able to accomplish this. Have I mentioned I love Linux?
`$ find /mnt/share/ -name '\*.\*~' -exec mv '{}' ~/Desktop/temp/ \;`
Don't forget the backslash and semi-colon, or the command won't work. But this command will execute the specified command **mv** all of the files from the share and the share's sub folders and move them into a folder on my desktop. I suggest moving rather than deleting as this can be a pretty powerful command. The '{}' is interpreted by the command as the file.
So the move command is applied to every file found matching the pattern.