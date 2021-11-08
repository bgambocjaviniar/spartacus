export async function publishReleaseDraft(
  tag_name: string,
  context: any,
  octoKit: any,
  body: string
) {
  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;

  const releases = await octoKit.repos.listReleases({
    owner,
    repo,
  });
  console.log(releases);
  console.log(`${releases.length} o-o ${releases}`);

  // const releaseDrafts = releases.filter((release: any) => release.draft);

  // if (releaseDrafts && releaseDrafts.length) {
  //   console.log([releaseDrafts.length, releaseDrafts]);
  // }

  await octoKit.repos.createRelease({
    tag_name,
    owner,
    repo,
    body,
    draft: true,
  });
}
