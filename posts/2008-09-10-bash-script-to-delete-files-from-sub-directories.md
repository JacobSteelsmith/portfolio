---
title: "Bash script to delete files from sub directories"
date: 2008-09-10
---

I needed to remove files from quite a few sub-directories in a directory, but couldn't remove the sub-directories. The attached script does just that.
You should run the script as root, or use sudo, but you don't have to. Here is the meat of the script:

```

for i in $BASE/*
do
  echo -e "Now working on $i.\r" | tee -a $OUTLOG
  DSIZE=`du -hs $i 2>> $ERRLOG | cut -f1` 
  echo -e "Preparing to remove $DSIZE.\r\n" | tee -a $OUTLOG
  for j in $i/*
    do
      if [ -d "$j" ]; then
        echo -e "Removing directory $j.\r" | tee -a $OUTLOG
	chmod -R +rw "$j" 2>>ERRLOG
	rm -Rf "$j" 2>> $ERRLOG
      else
	echo -e "Removing file $j." | tee -a $OUTLOG
	chmod +rw "$j" 2>>ERRLOG
	rm -f "$j" 2>> $ERRLOG
      fi
  done
  echo -e "Done with $i.\r\n" | tee -a $OUTLOG
done
```