#!/bin/bash

# Script details
AUTHOR="Abraham Reines <abraham.reines@gmail.com>"
DATE="$(date '+%Y-%m-%d %H:%M:%S')"

# Halt on errors
set -e

# Initialize git repo if not already
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    git init
    git commit --allow-empty -m "Initial commit"
fi

# Add changes
git add . --all --verbose

# Commit changes
COMMIT_MESSAGE="ContentCurator Commit $DATE"
git commit -m "$COMMIT_MESSAGE" || echo "No changes to commit."

# Remove files starting with ._ and commit if necessary
find . -name '._*' -exec git rm -f {} \;
git diff-index --quiet HEAD || git commit -m "Removing files starting with ._ $DATE"

# Add remote if it doesn't exist
if ! git remote | grep -q origin; then
    git remote add origin https://github.com/reinesaj2/ContentCurator.git
fi

# Sync with remote to get the latest state
git fetch origin

# Check if main branch exists locally
if git branch --list main; then
    echo "Local branch 'main' already exists."
else
    echo "Creating local branch 'main'."
    git checkout -b main
fi

# Check if main exists remotely
if git ls-remote --heads origin main | grep -q main; then
    echo "Main branch exists on remote."
    # Set local main to track remote main
    git branch --set-upstream-to=origin/main main
else
    echo "Main branch does not exist on remote, pushing and setting it to track."
    # Push main to remote and set as upstream
    git push -u origin main
fi

# Push changes
git push
