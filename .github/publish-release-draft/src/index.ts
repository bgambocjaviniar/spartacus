import * as github from '@actions/github';
import { publishReleaseDraft } from './functions';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const CHANGELOG = process.env.CHANGELOG;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  if (!CHANGELOG) {
    throw new Error('missing changelog');
  }

  const octoKit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;

  await publishReleaseDraft('5.0.0-test', context, octoKit, CHANGELOG);
}

run();
