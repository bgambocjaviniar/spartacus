import * as core from '@actions/core';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const FROM_TAG = process.env.FROM_TAG;
  const TO_TAG = process.env.TO_TAG;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  if (!FROM_TAG) {
    throw new Error('From tag is missing');
  }

  if (!TO_TAG) {
    throw new Error('To tag is missing');
  }

  //   const octoKit = github.getOctokit(GITHUB_TOKEN);
  // const context = github.context;

  core.setOutput('changelog', 'coolio');
}

run();
