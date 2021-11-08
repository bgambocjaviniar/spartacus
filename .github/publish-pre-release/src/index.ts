import * as github from '@actions/github';
import { createRelease } from './functions';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const TAG = process.env.TAG;
  // const CHANGELOG_DIFFERENCES = process.env.CHANGELOG;
  const octoKit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;
  const relatedPR = context.payload.pull_request;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  if (!TAG) {
    throw new Error('missing new tag version');
  }

  // if (!CHANGELOG_DIFFERENCES) {
  //   throw new Error('missing changelog');
  // }

  if (!relatedPR) {
    throw new Error(
      'Missing pull request context! Make sure to run this action only for pull_requests.'
    );
  }

  const hm = await octoKit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}',
    {
      owner: 'bgambocjaviniar',
      repo: 'spartacus',
      pull_number: 13,
    }
  );

  console.log('wow', typeof hm?.data.labels);
  console.log('ok', typeof JSON.stringify(hm?.data.labels));

  console.log('colio', hm);

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
