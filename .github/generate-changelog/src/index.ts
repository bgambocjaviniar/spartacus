import * as github from '@actions/github';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  //   const octoKit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;

  if (!context.payload.pull_request) {
    throw new Error('Not triggered by a pull request');
  }

  console.log(context.payload.pull_request.base.ref);
}

run();
