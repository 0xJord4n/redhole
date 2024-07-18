document.onreadystatechange = async () => {
  if (document.readyState != "complete") return;

  const intraAccessToken = getAccessToken();
  if (!intraAccessToken) throw new Error("Cannot get user access token");

  console.log("[REDHOLE] Extension is running");

  const userId = await getUserId(
    intraAccessToken,
    document.location.pathname == "/"
      ? "me"
      : document.location.pathname.split("/")[2]
  );
  if (!userId) throw new Error("Cannot fetch user id");

  console.log("[REDHOLE] User ID:", userId);

  const profile = await getProfile(intraAccessToken, userId);
  if (!profile) throw new Error("Cannot fetch profile");

  console.log("[REDHOLE] Cursus data:", profile);

  const cursusBeginDate = new Date(profile.cursus_begin_date);

  console.log("[REDHOLE] cursusBeginDate:", cursusBeginDate.getDate());

  const blackholeDate = new Date(cursusBeginDate);
  blackholeDate.setDate(
    cursusBeginDate.getDate() +
      BLACKHOLE_PER_MILESTONE_FROM_START[profile.milestone]
  );

  const todayDate = new Date();
  const deadlineDate = new Date(profile.deadline);

  if (todayDate > deadlineDate) {
    if (profile.deadline) {
      console.log("[REDHOLE] the deadline has passed");
      isDeadlineExceeded = true;
    }
  } else {
    console.log("[REDHOLE] the deadline has not passed.");
    isDeadlineExceeded = false;
  }

  const textSelector = document.querySelector(
    "#root > div > div.content.md\\:pl-20.pt-16.content-animation > div:nth-child(1) > header > div > div.border.border-neutral-600.bg-ft-gray\\/50.rounded-xl.relative.flex.flex-col.w-full.sm\\:gap-3.justify-between > div.pl-7.pt-8.flex.flex-col.lg\\:flex-row > div.lg\\:pl-2.overflow-hidden > h2.text-2xl.font-bold.text-center.py-4.lg\\:text-left.lg\\:py-0.drop-shadow-md"
  );

  if (isDeadlineExceeded)
  {
    textSelector.insertAdjacentHTML(
      "afterend",
      `
    <h2 class="text-xl font-bold text-center py-4 lg:text-left lg:py-0 drop-shadow-md text-destructive">Been absorbed by the BlackHole</h2>
    `
    );
  }
  else
  {
    textSelector.insertAdjacentHTML(
      "afterend",
      `
    <h2 class="text-xl font-bold text-center py-4 lg:text-left lg:py-0 drop-shadow-md text-destructive">Blackhole on ${
      blackholeDate.toLocaleString().split(",")[0]
    }</h2>
    `
    );
    console.log("[REDHOLE] Blackhole date:", blackholeDate);
  }
};
