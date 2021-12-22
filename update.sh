git add -A && git commit --no-edit --amend && git push -f && \
ssh git@142.93.164.184 "cd /home/git/web/vote_web && git stash && git pull --rebase && git stash pop"
