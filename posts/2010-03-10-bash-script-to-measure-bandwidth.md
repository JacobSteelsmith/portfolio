---
title: "Bash script to measure bandwidth"
date: 2010-03-10
---

I wrote a bash script to measure the amount of bandwidth, and to count the number of connections to the server, and used cron to run it once an hour. The results are written to a log. It works nicely, although I'm guessing my math is off a bit in calculating the bandwidth.
This was made to keep an eye on our web cam at my place of employment. It measures the bandwidth over 30 seconds during the run.
`` #!/bin/bash
CONN=`netstat -nt | awk '{ print $5}' | cut -d: -f1 | sed -e '/^$/d' | sort -n | uniq | wc -l`
DATE=`date '+%D | %r'`
BR1=`cat /sys/class/net/eth0/statistics/rx_bytes`
BT1=`cat /sys/class/net/eth0/statistics/tx_bytes`
sleep 30
BR2=`cat /sys/class/net/eth0/statistics/rx_bytes`
BT2=`cat /sys/class/net/eth0/statistics/tx_bytes`
INKB=$(((($BR2-$BR1) /30) /1024))
OUTKB=$(((($BT2-$BT1) /30) /1024))
echo "$DATE | $CONN | $INKB KB/s In (eth0) | $OUTKB KB/s Out (eth0)" >> /var/log/camstatlog
exit 0 ``