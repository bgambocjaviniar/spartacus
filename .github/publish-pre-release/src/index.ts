import * as github from '@actions/github';
import { createRelease } from './functions';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const TAG = process.env.TAG;
  // const CHANGELOG_DIFFERENCES = process.env.CHANGELOG;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  if (!TAG) {
    throw new Error('missing new tag version');
  }

  // if (!CHANGELOG_DIFFERENCES) {
  //   throw new Error('missing changelog');
  // }

  const octoKit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;

  const whoamlol = await octoKit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}',
    {
      owner: 'bgambocjaviniar',
      repo: 'spartacus',
      pull_number: 13,
    }
  );

  console.log('wow', typeof whoamlol?.data.labels);
  console.log('ok', typeof JSON.stringify(whoamlol?.data.labels));

  console.log('colio', whoamlol);

  await createRelease(
    context,
    octoKit,
    TAG,
    `#### coolio bug
  * [#11](https://github.com/bgambocjaviniar/spartacus/pull/11) Bug/abc ([@bgambocjaviniar](https://github.com/bgambocjaviniar))
  
  #### Committers: 1
  - Brian Gamboc-Javiniar ([@bgambocjaviniar](https://github.com/bgambocjaviniar))
  
  
  ## 10.0.0-test (2021-10-15)
  
  #### coolio bug
  * [#11](https://github.com/bgambocjaviniar/spartacus/pull/11) Bug/abc ([@bgambocjaviniar](https://github.com/bgambocjaviniar))
  
  #### Committers: 1
  - Brian Gamboc-Javiniar ([@bgambocjaviniar](https://github.com/bgambocjaviniar))`
  );
}

run();
