#!/bin/bash

echo "--- Debugging Yarn Install SSH Issues ---"
echo ""

echo "--- System Information ---"
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo "User: $(whoami)"
echo "Operating System: $(uname -a)"
echo ""

echo "--- Git Information ---"
git --version
echo "Git Remote URL: $(git config --get remote.origin.url || echo 'Not a git repository or no remote named origin')"
echo ""

echo "--- Node.js and Yarn Information ---"
if command -v node &> /dev/null; then
    echo "Node.js Version: $(node --version)"
else
    echo "Node.js is not installed or not in PATH."
fi
if command -v yarn &> /dev/null; then
    echo "Yarn Version: $(yarn --version)"
else
    echo "Yarn is not installed or not in PATH."
fi
echo ""

echo "--- SSH Agent Information ---"
echo "Checking for SSH_AUTH_SOCK: '${SSH_AUTH_SOCK}'"
if [ -z "$SSH_AUTH_SOCK" ]; then
    echo "SSH_AUTH_SOCK is not set. ssh-agent might not be running or configured correctly."
    echo "Consider using a setup action like 'webfactory/ssh-agent' or ensure your SSH key is added manually."
else
    echo "ssh-agent is likely running."
    echo "Listing identities known to the agent:"
    ssh-add -L
    if [ $? -ne 0 ]; then
        echo "Failed to list SSH keys. This could mean the agent is running but no keys are added, or there's an issue with the agent."
    fi
fi
echo ""

echo "--- Testing SSH Connection to GitHub ---"
echo "Attempting: ssh -T git@github.com"
# The article uses "ssh -T git@github.com" to test the connection. [cite: 20]
# We will use ssh -vT for more verbose output directly here.
ssh -vT git@github.com
SSH_CONNECTION_EXIT_CODE=$?
if [ $SSH_CONNECTION_EXIT_CODE -eq 1 ]; then
    echo "SSH connection test to git@github.com finished with exit code 1."
    echo "This is often expected for a successful authentication without shell access. [cite: 21]"
    echo "Look for a message like 'Hi username! You've successfully authenticated, but GitHub does not provide shell access.'"
elif [ $SSH_CONNECTION_EXIT_CODE -eq 255 ]; then
    echo "SSH connection test to git@github.com failed with exit code 255."
    echo "This usually indicates a more severe connection issue (e.g., network problem, permission denied before authentication, host key verification failure)."
else
    echo "SSH connection test to git@github.com finished with exit code $SSH_CONNECTION_EXIT_CODE."
fi
echo ""

echo "--- Attempting Yarn Install with Verbose SSH Logging ---"
echo "Setting GIT_SSH_COMMAND='ssh -vvv' to get maximum verbosity for SSH commands."
# The article uses "ssh -v"[cite: 25], we use -vvv for even more detail.
export GIT_SSH_COMMAND='ssh -vvv'

echo "Running: yarn install"
yarn install
YARN_EXIT_CODE=$?

echo ""
echo "--- Yarn Install Debugging Finished ---"
if [ $YARN_EXIT_CODE -eq 0 ]; then
    echo "Yarn install completed successfully with verbose SSH logging."
else
    echo "Yarn install failed with exit code $YARN_EXIT_CODE."
    echo "Review the verbose SSH output above (especially lines related to key exchange and authentication)."
    echo "The article highlighted that errors like 'read_passphrase: can't open /dev/tty: No such device or address' indicate issues with SSH key passphrases in non-interactive environments. [cite: 26]"
    echo "If you see such an error, your SSH key likely has a passphrase. GitHub Actions generally requires SSH keys without passphrases or for the passphrase to be handled by ssh-agent, which can be tricky for yarn's subprocess."
    echo "The resolution in the article was to remove the passphrase from the key[cite: 29, 35], or consider using a deploy key configured without a passphrase."
fi

echo "GIT_SSH_COMMAND has been unset."
unset GIT_SSH_COMMAND

exit $YARN_EXIT_CODE
