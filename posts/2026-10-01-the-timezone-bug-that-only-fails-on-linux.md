---
title: "The Timezone Bug That Only Fails on Linux (and the pandas 3.0 Trap Waiting for You)"
date: 2026-10-01
---

A test passed on my Mac and failed in CI. That sentence is a cliché for a reason — it's usually a path separator, a locale, or a race condition. This time it was none of those. It was a timezone string, `US/CENTRAL`, written in all caps, and the reason it worked on my laptop but not on the Linux build agent comes down to a detail most engineers never have to think about: whether the filesystem underneath their timezone database cares about letter case.

I hit this on a data-processing module in a professional project — the kind of code where timezone strings live in a database, flow through [pandas](https://pandas.pydata.org/), and nobody thinks twice about them because they've worked for years. The fix was trivial. The *lesson* was not, and it comes with a much larger trap scheduled to arrive with pandas 3.0. This post is about both: the immediate "works on my machine" failure, and why the same latent bug is about to get a lot more dangerous.

## The Symptom

The code and the database both stored timezones in uppercase — `US/CENTRAL`, `US/EASTERN`, `AMERICA/CHICAGO`. Historically that was fine. A test that localized some timestamps to `US/CENTRAL` passed cleanly on my macOS development machine. The exact same test, same Python, same pinned dependencies, failed in the GitLab CI/CD pipeline running on a Linux container with something along the lines of:

```
pytz.exceptions.UnknownTimeZoneError: 'US/CENTRAL'
```

Same code. Same `requirements.txt`. Same pandas version (2.3.0). Different result. That asymmetry — green locally, red in CI, with no code difference — is the fingerprint of an *environmental* dependency leaking into your logic. The interesting question is never "how do I make the test pass," it's "what is different about these two environments, and which one is lying to me?"

Spoiler: my Mac was lying to me.

## Why It Passed on macOS

pandas 2.x resolves timezone strings through [pytz](https://pythonhosted.org/pytz/). When you hand pytz a zone name, it does something quietly helpful: it normalizes the case before looking the zone up. pytz carries its own in-memory catalog of zone names and does a case-corrected match, so `US/CENTRAL`, `us/central`, and `US/Central` all land on the same canonical `US/Central` entry. On pytz, the uppercase string was never *really* valid — pytz was just being forgiving and fixing it for me on the way in.

So if pytz corrects the case, why did CI fail at all? Because the real timezone lookup — whether in pytz's data loading or, as we'll see, in `zoneinfo` — ultimately resolves a zone name against the IANA timezone database, and on most systems that database is **a tree of files on disk**. The canonical zone `America/Chicago` is literally the file `/usr/share/zoneinfo/America/Chicago`. Resolving a zone is, under the hood, opening a path.

And here's the pivot the whole bug turns on: **filesystems disagree about whether `US/CENTRAL` and `US/Central` are the same path.**

- **macOS** (default APFS/HFS+) is *case-insensitive but case-preserving*. Asking for `US/CENTRAL` happily opens the file named `US/Central`.
- **Windows** (NTFS, by default) is likewise case-insensitive for these purposes.
- **Linux** (ext4, xfs, and friends) is **case-sensitive**. `US/CENTRAL` and `US/Central` are two different names, and only one of them exists.

My Mac's case-insensitive filesystem was silently covering for a bug: even in the places where case correction didn't happen in code, the filesystem itself was papering over the mismatch. On the case-sensitive Linux build agent, there was no safety net. The uppercase string that my database had been feeding the code for ages was simply *wrong*, and only the operating system under my laptop had been hiding it.

This is a textbook case of an implicit dependency on an environment-specific behavior. The code "worked" not because it was correct, but because two layers of forgiveness — pytz's case correction and the filesystem's case insensitivity — were conspiring to mask bad data. Remove either layer and it breaks.

## The Immediate Fix

The narrow fix is boring, which is good: normalize the data. Timezone identifiers in the IANA database have a canonical casing, and that casing is the only one you should ever store or pass around. `America/Chicago`, not `AMERICA/CHICAGO`. `US/Central`, not `US/CENTRAL`.

Concretely, the options, roughly in order of how much I'd trust them long-term:

1. **Fix the data at the source.** The database should store canonical IANA names. If it stores `US/CENTRAL`, that's a data-quality bug, not a code bug. Correct it with a migration and add a constraint or validation so it can't drift back.
2. **Normalize at the boundary.** Where timezone strings enter the system, map them to canonical form once, explicitly, rather than relying on a downstream library's goodwill. Keep a small lookup, or validate against the known IANA set, and reject anything that doesn't resolve.
3. **Stop using the `US/*` aliases at all.** `US/Central`, `US/Eastern`, and friends are *legacy aliases* kept in the IANA database for backward compatibility. The modern canonical names are `America/Chicago`, `America/New_York`, and so on. New data should use the `Area/Location` form.

Whatever you pick, the principle is the same: **make the correct behavior independent of the environment.** Don't let a case-insensitive filesystem or a lenient library decide whether your code is correct. Decide it yourself, at a boundary you control, and make it fail loudly and identically everywhere.

## The Bigger Trap: pandas 3.0 and zoneinfo

Here's the part that turns a one-line fix into something worth writing about. The forgiveness I was leaning on is going away.

pandas 2.x uses pytz, and pytz corrects case. **pandas 3.0 switches its default timezone implementation to the standard library's [`zoneinfo`](https://docs.python.org/3/library/zoneinfo.html)** (PEP 615), moving off pytz entirely. This isn't speculation — it's tracked in the pandas issue [*Default to stdlib timezone objects instead of pytz* (#34916)](https://github.com/pandas-dev/pandas/issues/34916), and the migration has been landing across the 3.0 line, including the pyarrow-backed I/O readers moving to zoneinfo as well ([what's new in 3.0.3](https://pandas.pydata.org/pandas-docs/version/3.0/whatsnew/v3.0.3.html)). The pandas team made the switch deliberately: `zoneinfo` has saner semantics than pytz (no more `localize()` footgun) and supports newer TZif data for correct offsets far into the future.

The relevant behavioral change for *this* bug: **`zoneinfo` does not correct case.** It takes the key you give it and resolves it as a path against `TZPATH` — the IANA data directories, defaulting to things like `/usr/share/zoneinfo`, falling back to the [`tzdata`](https://tzdata.python.org/) PyPI package. There is no in-memory case-normalization step. The key *is* the path.

Put those two facts together and the trap snaps shut:

| | Case correction? | On macOS (case-insensitive FS) | On Linux (case-sensitive FS) |
|---|---|---|---|
| **pandas 2.x (pytz)** | Yes, in library | ✅ passes | ✅ passes (library corrects case) |
| **pandas 3.0 (zoneinfo)** | **No** | ✅ passes (FS covers for it) | ❌ **fails** |

Today, with pandas 2.x, pytz's case correction saves you on Linux even when the filesystem wouldn't. After the pandas 3.0 upgrade, that library-level safety net disappears. The *only* thing standing between `US/CENTRAL` and a `ZoneInfoNotFoundError` is the filesystem — which means your Mac and your Windows box keep passing while every Linux environment (your CI, your containers, your production servers) starts failing.

And this is not merely theoretical cross-platform hand-waving. The CPython project has an open issue, [*ZoneInfo inconsistent case sensitivity on OS-freebsd vs OS-mac* (#115022)](https://github.com/python/cpython/issues/115022), documenting that `ZoneInfo` is case-sensitive on FreeBSD and case-insensitive on macOS — the exact same filesystem-dependent divergence, confirmed inside the standard library's own test matrix.

Think about the shape of this failure as a delivery risk. A pandas major-version bump looks like a dependency chore. You read the changelog for the headline items — the new default string dtype, Copy-on-Write — you run your suite locally on your Mac, everything's green, you ship. The timezone regression is invisible until it reaches a case-sensitive host, and by then it's not a failing unit test, it's a production incident on data that's been "fine" for years. The gap between where the bug is *detectable* (Linux CI) and where it's *typically authored and first run* (a developer's Mac) is precisely the gap that lets latent environmental bugs survive to production.

## The Staff-Level Takeaway: Correctness Shouldn't Depend on Your Filesystem

The one-line fix is to canonicalize the timezone strings. But if you stop there, you've treated the symptom. The actual lesson — the one worth carrying between projects and codebases — is about where correctness is allowed to live.

A few principles I'd defend in a design review:

**Don't let the environment adjudicate correctness.** Any time your code behaves differently on macOS vs. Linux, on a case-insensitive vs. case-sensitive filesystem, with one library version vs. another, you have a latent bug — even while the tests are green. "It passes" and "it's correct" are different claims. The green test on my Mac was *evidence of correctness*, and it was wrong evidence. Treat environmental divergence as a defect in its own right, not a quirk to route around.

**Normalize at boundaries, explicitly.** Data crossing a boundary — out of a database, off an API, in from a file — is where you canonicalize, validate, and reject. Relying on a downstream library to be forgiving (pytz correcting your case) is borrowing against a loan that can be called. It was called the day the pandas team chose `zoneinfo`. Explicit normalization at the edge is version-independent; implicit tolerance deep in a dependency is not.

**Make CI resemble production, and trust it over your laptop.** The whole reason this surfaced *before* production is that CI ran on Linux while I developed on macOS. That divergence is usually a liability, but here it was the hero — it caught something my dev environment structurally could not. The lesson isn't "make CI match my Mac," it's the opposite: your laptop is the lenient environment, so when it disagrees with CI, assume CI is right until proven otherwise. If anything, developing on a case-sensitive filesystem (or at least testing on one) would have caught this at the source.

**Read major-version upgrades for behavioral changes, not just features.** The pandas 3.0 notes lead with the exciting stuff. The dangerous changes are the quiet semantic ones — pytz to zoneinfo, the removal of a case-correction behavior nobody documented as a *feature* because nobody was supposed to depend on it. When you own a system, a dependency's major bump is a change to *your* behavior. Audit it like one: grep your codebase and your *data* for the patterns the new version will no longer tolerate, before the upgrade, not after the incident.

**Fail loudly and identically, everywhere.** The worst version of this bug is the one where macOS and Windows keep passing after the pandas 3.0 upgrade. Silent divergence across platforms is how a bug reaches production wearing a green badge. If uppercase zone names are invalid, I'd rather they be invalid *on every machine*, including mine, so the failure shows up on the laptop of whoever wrote it — not in a 2 a.m. page from the one environment that happened to be honest.

## If You Want to Get Ahead of This Today

Even if you're still on pandas 2.x, you can neutralize the trap now:

- Grep your codebase and your stored data for timezone strings that aren't in canonical IANA form — anything all-uppercase, or using the legacy `US/*` aliases, is a candidate. The canonical zone list is published by [IANA](https://www.iana.org/time-zones) and surfaced in Python via `zoneinfo.available_timezones()`.
- Add a validation step that resolves every timezone string through `zoneinfo.ZoneInfo(name)` and fails fast on anything that doesn't exist. Run it on Linux. Running it on a case-sensitive filesystem is the whole point — it reproduces production's strictness.
- Consider pinning `tzdata` as an explicit dependency so your timezone data is sourced from a package you control rather than whatever the host OS happens to ship, which also removes "the base image's `/usr/share/zoneinfo` is different" from your list of variables.
- When you do upgrade to pandas 3.0, you'll have already paid down the debt, and the migration becomes the non-event it should be.

The bug was one uppercase string. The lesson is that "works on my machine" is sometimes the machine quietly doing you a disservice — and the professional move is to find the layer that's covering for you and take the correctness back into code you own, before a dependency upgrade decides to stop being so polite.
