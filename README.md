shoutbox
===

A simple status dashboard. This is a complete Rewrite of the node.js
implementation that you can still find in the nodejs_version branch.

How to run
---

shoutbox will only run with thin in production mode, so please start shoutbox via

    rackup -s thin -E production

If you edit stylesheets, also run:

    compass watch -c config/compass.rb


Configuration
---

Edit mongodb settings in config/mongodb.conf, use rackup for all other options

Add you pusher application id in public/javascripts/shoutbox.js line 52.

        var pusher = new Pusher('your-app-id');
