export async function createRelease(
  tag_name: string,
  context: any,
  octoKit: any,
  body: string
) {
  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;

  await octoKit.repos.createRelease({
    tag_name,
    owner,
    repo,
    body,
    draft: true,
  });
}
