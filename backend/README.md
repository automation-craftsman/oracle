Code Integration and Docker Container Deploy Workflow

This GitHub Actions workflow automates code integration, quality checks, Docker image building, security scanning, and deployment for the Oracle project. It runs whenever code is pushed to the dev branch.
Workflow File

    Location: .github/workflows/ci.yaml

Trigger

    Event: push
    Branch: dev
    Description: The workflow triggers automatically on every push to the dev branch.

Jobs

The workflow consists of three sequential jobs:

    integration-and-code-quality-check: Runs linting, formatting checks, and a SonarQube scan.
    build-and-check-docker-image: Builds a Docker image and scans it for vulnerabilities.
    deploy-docker-image: Deploys the Docker image to Docker Hub.

Job 1: integration-and-code-quality-check

Purpose: Ensures code quality by running linting, formatting checks, and a SonarQube scan.

Steps:

    Checkout repository:
        Uses actions/checkout@v4 to clone the repository.
    Set up Node.js:
        Uses actions/setup-node@v4 to install Node.js version 18.
    Install backend dependencies:
        Runs npm install in the backend/ directory to install backend dependencies.
    Install frontend dependencies:
        Runs npm install in the frontend/ directory. If no package.json exists, the step continues (|| true).
    Run JavaScript linting:
        Runs npm run lint:js in both backend/ and frontend/ directories. Ignores failures (|| true).
    Run HTML linting:
        Runs npm run lint:html in the frontend/ directory. Ignores failures (|| true).
    Run formatting check:
        Runs npm run format -- --check in both frontend/ and backend/ directories to check code formatting. Ignores failures (|| true).
    SonarQube Scan:
        Uses SonarSource/sonarqube-scan-action@v5 to scan the code for quality issues.
        Requires a SONAR_TOKEN secret to authenticate with SonarQube.

Job 2: build-and-check-docker-image

Purpose: Builds a Docker image for the backend and scans it for security vulnerabilities.

Dependencies:

    Runs only if the integration-and-code-quality-check job succeeds (needs: integration-and-code-quality-check).

Steps:

    Checkout repository:
        Clones the repository using actions/checkout@v4.
    Lint Dockerfile:
        Uses hadolint/hadolint-action@v3.1.0 to lint the backend/Dockerfile for best practices.
    Build Docker image:
        Builds a Docker image tagged as oracle:latest from the backend/ directory using docker build.
        Uses --no-cache to ensure a fresh build.
    Security scan with Trivy:
        Uses aquasecurity/trivy-action@0.28.0 to scan the oracle:latest image for vulnerabilities.
        Scans for os and library vulnerabilities with CRITICAL severity.
        Fails the step if vulnerabilities are found (exit-code: '1'), but ignores unfixed issues (ignore-unfixed: true).

Job 3: deploy-docker-image

Purpose: Builds and pushes the Docker image to Docker Hub with the latest commit hash.

Dependencies:

    Runs only if the build-and-check-docker-image job succeeds (needs: build-and-check-docker-image).

Steps:

    Checkout repository:
        Clones the repository using actions/checkout@v4.
    Log in to Docker Hub:
        Uses docker/login-action@v3 to log in to Docker Hub.
        Requires DOCKERHUB_USERNAME and DOCKERHUB_PASSWORD secrets.
    Capture latest commit hash:
        Captures the short commit hash (first 7 characters) using git rev-parse --short HEAD.
        Stores it as short_commit_hash in the step’s outputs.
    Build and push Docker image:
        Uses docker/build-push-action@v6 to build and push the image from the backend/ directory.
        Tags the image with:
            ${{ secrets.DOCKERHUB_USERNAME }}/oracle-backend:<short_commit_hash> (e.g., username/oracle-backend:a1b2c3d).
            ${{ secrets.DOCKERHUB_USERNAME }}/oracle-backend:latest.
        Pushes the image to Docker Hub if the step succeeds (if: success()).

Usage

    Push code changes to the dev branch.
    The workflow will:
        Run linting and formatting checks.
        Scan the code with SonarQube.
        Build and scan a Docker image for vulnerabilities.
        Deploy the image to Docker Hub with the commit hash and latest tags.
    Check the workflow logs in the Actions tab of your GitHub repository to monitor progress.

Notes

    The Trivy scan fails on critical vulnerabilities but ignores unfixed ones.
    The Docker image is tagged with both the commit hash and latest for traceability and easy access.