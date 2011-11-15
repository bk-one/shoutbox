#!/bin/bash
source "/usr/local/rvm/scripts/rvm"

cd /home/moviepilot/apps/shoutbox/
. .rvmrc

DESC=shoutbox
NAME=$DESC

case "$1" in
  start)
	echo -n "Starting $DESC: "
	thin start -C myapp.yml
	echo "$NAME."
	;;
  stop)
	echo -n "Stopping $DESC: "
	thin stop -C myapp.yml
	echo "$NAME."
	;;
  restart|force-reload)
	echo -n "Restarting $DESC: "
	thin restart -C myapp.yml
	echo "$NAME."
	;;
  *)
	echo "Usage: $NAME {start|stop|restart}" >&2
	exit 1
	;;
esac

exit 0

