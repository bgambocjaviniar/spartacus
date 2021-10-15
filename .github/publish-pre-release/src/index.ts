import * as github from '@actions/github';
import { createRelease } from './functions';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const TAG = process.env.TAG;
  const CHANGELOG_DIFFERENCES = process.env.CHANGELOG;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  if (!TAG) {
    throw new Error('missing new tag version');
  }

  if (!CHANGELOG_DIFFERENCES) {
    throw new Error('missing changelog');
  }

  const octoKit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;

  await createRelease(context, octoKit, TAG, CHANGELOG_DIFFERENCES);
}

run();
