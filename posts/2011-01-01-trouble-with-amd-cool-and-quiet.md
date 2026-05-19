---
title: "Trouble with AMD Cool and Quiet"
date: 2011-01-01
---

I've had an ongoing problem with my computer ever since I purchased it in 2008. Every once in a while, mostly under high load, the computer would freeze. I couldn't find anything in the logs regarding the lock up, and the problem persisted through multiple versions of Ubuntu, so I assumed it was a hardware and not a software problem.

The processor is an AMD Phenom 9850 and the motherboard an Asus M3N-HD HDMI.

I have been compiling the Chromium OS image, or trying to, for the last few weeks. I have been successful a few times, but nearly every time the machine would freeze.

After experimenting tonight under controlled conditions, I watched the sensors command and observed the CPU temperature climb above 62 degrees before freezing. If I tried to use the computer at 61 degrees, the machine would freeze. The CPU fan did not exceed 2800 RPMs during this time.

After a little research, I noticed some other people online reporting that the Cool and Quiet feature of the processor was causing their machines to freeze. I disabled this option in the bios and now the computer is running great at high loads. The CPU does not get over 61 degrees, and the fan is now at 3500 RPMs during the high load periods, and remains quiet at lower RPMs during low loads and idle.

From what I understand, this feature controls the voltage to the cores of the CPU to save power and to keep the CPU running cool. However, perhaps in conjunction with the variable speed CPU fan, it was causing a low RPM setting on the fan when a higher RPM setting was needed for system stability. 