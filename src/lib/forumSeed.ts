// Starter discussions for the forum. These are inserted once, automatically,
// when the forum is still empty (see seedForumIfEmpty in db.ts) so new visitors
// land on an active board instead of a blank page. Every `slug` is a real model
// in the catalogue; authors are shown as "Anonymous" like all other posts.

export type SeedTopic = {
  slug: string;
  title: string;
  body: string;
  replies?: string[];
};

export const FORUM_SEED: SeedTopic[] = [
  {
    slug: "galaxy-s24-ultra",
    title: "Is the S24 Ultra still worth buying in 2026?",
    body: "Thinking of grabbing a used S24 Ultra now that prices dropped. Is it still a solid daily driver, or should I stretch for the S25 Ultra? Mainly care about camera and battery.",
    replies: [
      "Honestly still a beast. The 200 MP camera and 7 years of updates make it a safe long-term buy.",
      "Got mine used last month, zero regrets. Battery easily lasts a full day.",
    ],
  },
  {
    slug: "galaxy-s25-ultra",
    title: "S25 Ultra battery life — what are you actually getting?",
    body: "Curious what real-world screen-on time people are seeing on the S25 Ultra. I'm getting around 7 hours with mixed use. Is that normal?",
    replies: ["7 hours SOT is about right for heavy use. Turning off always-on display helped me get closer to 8."],
  },
  {
    slug: "galaxy-z-fold-7",
    title: "Fold 7 crease — noticeable in daily use?",
    body: "Everyone talks about the crease on foldables. For those who own the Fold 7, is it actually distracting or do you forget it's there after a day?",
    replies: [
      "You feel it if you go looking for it, but during normal use I genuinely forget it exists.",
      "It's the least noticeable crease of any Fold so far. Huge improvement over the Fold 5.",
    ],
  },
  {
    slug: "galaxy-z-flip-7",
    title: "Flip 7 cover screen — actually useful or just a gimmick?",
    body: "Coming from a normal slab phone. Do you really use the full cover screen on the Flip 7, or does it end up being a novelty you stop touching after a week?",
  },
  {
    slug: "galaxy-s23-ultra",
    title: "S23 Ultra in 2026 — the best value flagship right now?",
    body: "Used S23 Ultra prices are incredible now. Same 200 MP sensor, S Pen, great screen. Am I missing any reason not to just buy this instead of a new mid-ranger?",
    replies: ["This is the move. The S23 Ultra at used prices beats almost every new phone under its price."],
  },
  {
    slug: "galaxy-note-20-ultra",
    title: "Anyone still daily-driving the Note 20 Ultra?",
    body: "My Note 20 Ultra refuses to die. Still fast, S Pen still great. How are yours holding up in 2026? Battery is the only thing that's aged for me.",
    replies: ["Battery is the weak point for sure. A replacement battery brought mine back to life though."],
  },
  {
    slug: "galaxy-s6-edge",
    title: "Nostalgia thread: the S6 Edge was way ahead of its time",
    body: "Just found my old S6 Edge in a drawer. That curved screen and glass design in 2015 was stunning. What's your favourite retro Galaxy?",
  },
  {
    slug: "galaxy-a54-5g",
    title: "A54 vs A55 — is the upgrade actually worth it?",
    body: "Looking at the mid-range. Is there enough difference between the A54 and A55 to justify the price gap, or should I just save money and get the A54?",
  },
  {
    slug: "galaxy-z-fold-6",
    title: "Fold 6 → Fold 7: worth upgrading?",
    body: "I have a Fold 6 and it's great. The Fold 7 is thinner with a better camera, but is it a big enough jump for a one-year upgrade? Trying to justify it to myself.",
    replies: [
      "One-year upgrade almost never worth it. Skip to the Fold 8 unless the thinness really matters to you.",
    ],
  },
  {
    slug: "galaxy-s22-ultra",
    title: "S22 Ultra overheating — did later updates fix it?",
    body: "The S22 Ultra had a rough launch with throttling. For long-term owners: did One UI updates actually improve the thermals over time?",
    replies: ["Updates helped a lot. It's nowhere near as bad now as it was at launch."],
  },
  {
    slug: "galaxy-s21-ultra",
    title: "S21 Ultra — is it still getting updates?",
    body: "Wondering how much software life is left in the S21 Ultra. Anyone know when it drops off the update list?",
  },
  {
    slug: "galaxy-note-9",
    title: "Was the Note 9 the peak of the Note line?",
    body: "Big battery, headphone jack, S Pen, expandable storage. The Note 9 had everything. Hot take: Samsung never made a more complete phone. Agree or disagree?",
    replies: [
      "Hard agree. Headphone jack + microSD + S Pen was the dream combo.",
      "The Note 10+ was more refined but the 9 had that all-in-one charm.",
    ],
  },
  {
    slug: "galaxy-z-trifold",
    title: "Galaxy Z TriFold — genuine game changer or expensive gimmick?",
    body: "A phone that folds into a 10-inch tablet sounds incredible but also fragile and pricey. Would you actually daily-drive a tri-fold, or is this a first-gen 'wait and see'?",
    replies: ["First-gen anything foldable is a 'wait for gen 2' for me, but the concept is genuinely exciting."],
  },
  {
    slug: "galaxy-s10-plus",
    title: "S10+ headphone jack — I miss it every single day",
    body: "The S10+ was the last great Galaxy with a headphone jack. Anyone else refuse to upgrade partly because of this?",
  },
  {
    slug: "galaxy-s25",
    title: "S25 base model — enough for most people?",
    body: "Everyone chases the Ultra, but the base S25 is compact and powerful. For someone who doesn't need the S Pen or periscope zoom, is the small one the smarter buy?",
    replies: ["The compact flagship is underrated. Same chip, fits in your pocket, costs way less."],
  },
  {
    slug: "galaxy-a53-5g",
    title: "A53 long-term review after 3 years",
    body: "Bought the A53 back in the day as a budget pick. Three years and four OS updates later it's still smooth. Best value phone I've owned. Anyone else?",
  },
  {
    slug: "galaxy-s20-fe",
    title: "Was the S20 FE the best value Samsung ever made?",
    body: "Flagship chip, 120 Hz, great camera, half the flagship price. The S20 FE feels like the last time Samsung truly nailed the value formula. Change my mind.",
    replies: ["No notes. The S20 FE is a legend. The FE line never quite hit that high again."],
  },
  {
    slug: "galaxy-z-flip-4",
    title: "Flip 4 hinge durability — how's yours holding up?",
    body: "Two years on my Flip 4. Hinge still feels tight, no screen issues. Curious if others had the same luck or if durability was a lottery.",
  },
  {
    slug: "galaxy-s8-plus",
    title: "The S8+ design still looks modern in 2026",
    body: "Pulled out my old S8+ and honestly the Infinity Display still looks current. Samsung nailed that design language early. What's the best-aging Galaxy design?",
  },
  {
    slug: "galaxy-note-7",
    title: "The Note 7 saga — what really happened?",
    body: "For newer fans: the Note 7 recall is one of the wildest stories in phone history. It was genuinely a brilliant phone before the battery issues. Anyone here actually own one?",
    replies: ["I had one for two weeks before the recall. Genuinely the best phone I'd used at that point. Such a shame."],
  },
  {
    slug: "galaxy-s24",
    title: "S24 vs S24+ — is the Plus worth the extra money?",
    body: "Torn between the S24 and S24+. Bigger screen and battery on the Plus, but the base is more pocketable. What tipped your decision?",
  },
  {
    slug: "galaxy-m51",
    title: "M51 and its 7000 mAh — best battery phone Samsung ever made?",
    body: "The M51 is a battery monster. Two days easy. Why did Samsung stop putting huge batteries in phones like this?",
    replies: ["Two-day battery ruined every other phone for me. Nothing since has matched it."],
  },
  {
    slug: "galaxy-s7-edge",
    title: "The S7 Edge fixed everything the S6 got wrong",
    body: "Water resistance came back, microSD came back, bigger battery. The S7 Edge is still one of the most beloved Galaxy phones ever. Peak curved-screen era?",
  },
  {
    slug: "galaxy-z-fold-3",
    title: "Fold 3 under-display camera — good idea or bad execution?",
    body: "The Fold 3 was the first with an under-display selfie camera. Cool for immersion but the quality took a hit. Did you like the trade-off?",
  },
  {
    slug: "galaxy-s25-ultra",
    title: "S25 Ultra camera vs S24 Ultra — is there a real-world difference?",
    body: "On paper they're similar. For people who've used both, is the S25 Ultra camera a noticeable step up, or is it mostly processing tweaks?",
    replies: ["Mostly processing and the new ultrawide. If you have an S24 Ultra, the camera alone isn't a reason to upgrade."],
  },
  {
    slug: "galaxy-a15",
    title: "Best budget Samsung to buy right now?",
    body: "Need a cheap, reliable Samsung for a family member. Is the A15 the sweet spot, or is there something better under that price? Priorities are battery and updates.",
    replies: ["A15 is solid for the price, but if you can stretch a bit the A25/A35 age better with updates."],
  },
  {
    slug: "galaxy-s23-fe",
    title: "Is the S23 FE underrated?",
    body: "Nobody talks about the S23 FE but it's got a good screen, decent camera and flagship-ish performance for less. Am I missing a hidden flaw?",
  },
  {
    slug: "galaxy-note-10-plus",
    title: "Note 10+ — still the best big phone for one-handed use?",
    body: "The Note 10+ has thin bezels and a balanced shape that somehow feels usable one-handed despite the size. Modern big phones feel chunkier. Anyone else notice this?",
  },
  {
    slug: "galaxy-z-flip-6",
    title: "Flip 6 for someone coming from a normal phone — adjustment period?",
    body: "Tempted by the Flip 6 purely for the compact folded size. For those who switched from a slab phone, how long did it take to get used to flipping it open?",
  },
  {
    slug: "galaxy-s9",
    title: "Can the S9 still be a daily driver in 2026?",
    body: "Have an old S9 lying around. With a fresh battery, is it usable as a basic daily phone, or has it aged out for modern apps?",
    replies: ["With a new battery it's fine for calls, messaging and light browsing. Heavy apps will feel the age though."],
  },
  {
    slug: "galaxy-fold",
    title: "The original Galaxy Fold — how it aged",
    body: "The first Fold had a rough launch with screen issues, but it started the whole category. Looking back, do you give it credit as a pioneer or was it just a beta?",
  },
  {
    slug: "galaxy-a54-5g",
    title: "A54 slow charging — is 25 W normal for this?",
    body: "My A54 seems to charge pretty slowly compared to my old phone. Is 25 W the max, and is that expected? Wondering if something's wrong.",
    replies: ["25 W is the cap on the A54, so that's normal. A good 25 W+ charger and cable makes a difference though."],
  },
  {
    slug: "galaxy-s22",
    title: "Why doesn't Samsung make small flagships like the S22 anymore?",
    body: "The compact S22 was perfect for one hand. Newer base models keep growing. Is there still demand for a truly small flagship, or did that market die?",
    replies: ["There's demand, we're just a loud minority. Small flagships never sell as well sadly."],
  },
  {
    slug: "galaxy-s21-fe",
    title: "S21 FE vs S23 FE — which to buy used?",
    body: "Both are cheap now. Is the S23 FE worth the premium over the S21 FE, or is the older one good enough for the savings?",
  },
  {
    slug: "galaxy-note-20-ultra",
    title: "Note 20 Ultra S Pen — still the best stylus experience?",
    body: "Now that the S Pen lives in the S Ultra line, do you think the Note 20 Ultra still holds up as the best pen phone, or have the newer Ultras surpassed it?",
  },
  {
    slug: "galaxy-s25-edge",
    title: "S25 Edge — is being that thin worth the battery trade-off?",
    body: "The S25 Edge is stunningly thin but the battery is smaller. For real owners: does the thinness win you over, or do you wish you'd bought a normal S25 with more battery?",
    replies: ["It feels amazing in the hand, but I do end up topping up in the evening. Trade-off is real."],
  },

  // ── Common problems & fixes (help + long-tail search) ──
  {
    slug: "galaxy-s21-ultra",
    title: "S21 Ultra battery draining fast — here's what fixed it for me",
    body: "My S21 Ultra was barely lasting half a day. What actually helped: Settings → Battery → Background usage limits to spot the worst apps, turning off Always On Display, and dropping the screen from QHD+ to FHD+ (QHD at 120 Hz is a battery killer). Screen-on time went from ~4h to nearly 7h. What worked for you?",
    replies: [
      "FHD+ instead of QHD was the biggest one for me too. Barely notice the difference in daily use.",
      "Also check for a rogue app in Battery usage — Facebook was eating 20% in the background on mine.",
    ],
  },
  {
    slug: "galaxy-s22-ultra",
    title: "S22 Ultra overheating while gaming — fix that worked",
    body: "The S22 Ultra ran hot and throttled at launch. Two things helped a lot: make sure you're on the latest One UI (the early updates improved thermals a ton), and take the case off while gaming or fast charging. Also turn off background sync for heavy apps. It's night and day compared to launch firmware.",
    replies: ["Can confirm the updates fixed most of it. It was genuinely bad at launch, fine now."],
  },
  {
    slug: "galaxy-s20-ultra",
    title: "Green line appeared on my S20 screen out of nowhere — anyone else?",
    body: "A vertical green line showed up on my S20's AMOLED after an update, no drop or damage. From what I've read this is a known issue on some Samsung OLED panels as they age or after certain updates. Sometimes a software update helps, but usually it's the panel itself — Samsung has repaired some units for free even out of warranty, so it's worth contacting support before paying for a screen.",
    replies: [
      "Mine did the same at ~2 years. Samsung service replaced the panel free once I pushed. Ask them.",
    ],
  },
  {
    slug: "galaxy-note-10-plus",
    title: "Ghost touch / phantom taps on Note 10+ — how I stopped it",
    body: "My Note 10+ started registering taps I never made, especially near the curved edges. Fixes to try in order: remove any cheap screen protector, restart in Safe Mode to rule out an app, then wipe the cache partition from recovery. If it only happens while charging, try a different (better quality) cable/charger — a noisy charger can cause it. If none of that works it's likely the digitizer and needs service.",
  },
  {
    slug: "galaxy-s10-plus",
    title: "S10+ ultrasonic fingerprint scanner got slow/unreliable — fix",
    body: "The under-display fingerprint reader on my S10+ started failing constantly. What helped: delete and re-register your fingerprints (add the same finger twice for better accuracy), and make sure your screen protector is one that's rated for ultrasonic sensors — the wrong film blocks it. A One UI update also improved recognition speed noticeably.",
    replies: ["Re-registering each finger twice was the trick for me. Went from 50% to almost always first try."],
  },
  {
    slug: "galaxy-a54-5g",
    title: "A54 charging slowly — is 25W really the max?",
    body: "Yes, the A54 caps at 25W, but a lot of people never actually hit it. You need a proper 25W USB-PD (PPS) charger and a good cable — the phone doesn't include one in the box. With a real 25W PD charger mine goes 0–50% in about half an hour. A generic 5W/10W brick will charge painfully slowly.",
    replies: ["This. Bought a cheap Samsung 25W PD charger and it was a completely different phone."],
  },
  {
    slug: "galaxy-s21",
    title: "S21 Bluetooth keeps disconnecting from car / earbuds — solved",
    body: "Constant Bluetooth drops on my S21. What fixed it: Settings → Apps → show system apps → Bluetooth → clear cache, then forget the device and re-pair. Also turn OFF battery optimization for Bluetooth and the earbuds app so the system doesn't kill the connection. Rock solid since.",
    replies: ["Clearing the Bluetooth cache is criminally underrated. Fixed my car audio dropouts instantly."],
  },
  {
    slug: "galaxy-note-9",
    title: "Note 9 battery aging in 2026 — is a replacement worth it?",
    body: "Loved my Note 9 but the battery was down to a few hours. Got the battery replaced at a reputable local shop for cheap and it's basically a new phone again — easily a full day now. If everything else about your Note 9 still works, a battery swap is by far the best value upgrade. Just use a quality cell, not the cheapest one.",
    replies: [
      "Did the same. Best money I've spent on an old phone. The Note 9 is still great with a fresh battery.",
    ],
  },
  {
    slug: "galaxy-s9-plus",
    title: "S9+ stuck on the boot logo / won't turn on — fix",
    body: "My S9+ froze on the Samsung logo and wouldn't boot. Steps that usually fix it: force restart by holding Volume Down + Power for ~10 seconds. If it still loops, boot into recovery (Volume Up + Bixby + Power on older models) and 'Wipe cache partition' — this does NOT erase your data. Only factory reset as a last resort. Wiping the cache brought mine back.",
  },
  {
    slug: "galaxy-s20-fe",
    title: "S20 FE notifications arriving late — how to fix delayed alerts",
    body: "Classic One UI issue: aggressive battery saving kills background apps so messages arrive late. Fix: Settings → Battery → Background usage limits → make sure your messaging/email apps are NOT in 'Sleeping' or 'Deep sleeping'. Also turn off 'Adaptive battery' or set the app to 'Unrestricted'. Notifications became instant again.",
    replies: ["Putting WhatsApp and Telegram on 'Unrestricted' fixed months of late notifications for me."],
  },
  {
    slug: "galaxy-z-fold-5",
    title: "Z Fold 5 inner screen protector bubbling/peeling — don't panic",
    body: "The pre-applied protector on the inner foldable screen started lifting at the crease. This is normal wear on the FACTORY protector — do NOT peel it off yourself (the display underneath is delicate). Samsung replaces this inner protector for free (or very cheap) at service centres. Book an appointment rather than picking at it.",
    replies: ["Samsung swapped mine free in 20 minutes. Never remove it yourself, that's how screens die."],
  },
  {
    slug: "galaxy-a53-5g",
    title: "A53 got laggy after a One UI update — how I fixed the stutter",
    body: "After a big update my A53 felt sluggish. What helped, in order: wipe the cache partition from recovery, clear cache on heavy apps, restart, and give it a day to re-optimise in the background. If it's still bad, back up and do a clean factory reset — updates sometimes leave old data that drags performance. Smooth again after the cache wipe for me.",
  },
  {
    slug: "galaxy-s8",
    title: "S8 mobile data stopped working after swapping SIM — fix",
    body: "No mobile data after putting in a new SIM. The fix is almost always the APN: Settings → Connections → Mobile networks → Access Point Names → reset to default, or add your carrier's APN manually (their website lists it). A network settings reset (Settings → General management → Reset → Reset network settings) also does it. Data came back immediately.",
  },
  {
    slug: "galaxy-a12",
    title: "Galaxy A12 storage always full and lagging — what to do",
    body: "The A12 is a budget phone with limited RAM/storage, so it fills up fast. What keeps it usable: add a microSD card and move photos/videos to it, clear app caches regularly, uninstall or disable apps you don't use, and keep at least a few GB free. Don't run 20 apps in the background. It won't be a flagship but these keep it smooth.",
  },
  {
    slug: "galaxy-z-flip-4",
    title: "Z Flip 4 screen protector lifting at the crease — is this normal?",
    body: "The factory screen protector on my Flip 4 started peeling along the fold line after a few months. This is expected and it's the protector, not the screen. Same as the Fold: don't remove it yourself, Samsung re-applies it at service. If you peel it off, the exposed foldable layer scratches and cracks easily.",
    replies: ["Yep, totally normal on clamshells. Free replacement at Samsung service, took them minutes."],
  },
  {
    slug: "galaxy-s23-ultra",
    title: "S23 Ultra slow to focus in low light — camera fix",
    body: "My S23 Ultra hunted for focus in dim rooms. Things that helped: clean the lens (fingerprints wreck autofocus more than you'd think), turn OFF Scene Optimizer if it's over-processing, tap to focus manually, and make sure you're on the latest camera/firmware update — Samsung has shipped several autofocus improvements. Much snappier now.",
  },
];
