Deploy Frontend to Cloudflare Pages Workflow

This GitHub Actions workflow automates the deployment of the Oracle project's frontend to Cloudflare Pages. It builds the frontend and deploys it whenever code is pushed to the master branch, a pull request to master is merged, or the workflow is manually triggered.
Workflow File

    Location: .github/workflows/deploy-frontend.yaml

Triggers

    Events:
        push: Runs on pushes to the master branch.
        pull_request: Runs when a pull request to the master branch is closed (merged).
        workflow_dispatch: Allows manual triggering from the GitHub Actions tab.
    Condition: The workflow only runs if:
        It’s a manual trigger (workflow_dispatch).
        A pull request to master is merged (github.event.pull_request.merged == true).
        It’s a push to master (github.event_name == 'push').

Jobs

The workflow has one job:

    deploy: Builds and deploys the frontend to Cloudflare Pages.

Job: deploy

Purpose: Builds the frontend and deploys it to Cloudflare Pages.

Steps:

    Checkout repository:
        Uses actions/checkout@v4 to clone the repository.
    Install Node.js:
        Uses actions/setup-node@v4 to install Node.js version 18.
    Install frontend dependencies:
        Runs npm install in the frontend/ directory to install dependencies.
    Set Backend URL in config.json:
        Creates a config.json file with the BACKEND_URL from GitHub secrets.
        Example output: {"BACKEND_URL": "http://<EC2_PUBLIC_IP>"}.
    Build frontend:
        Runs npm run build to build the frontend for deployment.
        Assumes the build output is in a directory like frontend/build.
    Deploy to Cloudflare Pages:
        Uses cloudflare/wrangler-action@v3 to deploy the frontend to Cloudflare Pages.
        Requires secrets: GITHUB_TOKEN, CLOUDFLARE_API_TOKEN, and CLOUDFLARE_ACCOUNT_ID.

Secrets Required

    BACKEND_URL: The backend URL (e.g., http://<EC2_PUBLIC_IP>).
    CLOUDFLARE_API_TOKEN: Cloudflare API token for deployment.
    CLOUDFLARE_ACCOUNT_ID: Your Cloudflare account ID.

Usage

    Push to the master branch, merge a pull request to master, or manually trigger the workflow.
    The workflow will:
        Install dependencies and build the frontend.
        Create a config.json with the backend URL.
        Deploy the frontend to Cloudflare Pages.
    Check the workflow logs in the Actions tab to confirm deployment.
    Access the deployed frontend at your Cloudflare Pages URL (e.g., https://oracle-frontend.pages.dev).

Notes

    The workflow assumes the frontend is in the frontend/ directory and uses npm run build.
    The config.json file provides the BACKEND_URL for the frontend to use at runtime.