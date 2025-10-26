#!/usr/bin/env sh
# shellcheck shell=sh

if [ -z "${husky_skip_init-}" ]; then
  husky_skip_init=1
  hookname="$(basename "$0")"
  husky_dir="$(dirname "$0")"
  if [ -f "$husky_dir/husky.sh" ]; then
    . "$husky_dir/husky.sh"
  fi
fi
