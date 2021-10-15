import * as core from '@actions/core';
import * as github from '@actions/github';
import { createRelease } from './functions';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  const octoKit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;
  const tag = core.getInput('tag', { required: true });
  const changelogDifferences = core.getInput('changelog', { required: true });

  await createRelease(context, octoKit, tag, changelogDifferences);
}

run();
