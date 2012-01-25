shoutbox
===

Simple status dashboard. Check out
[here](http://moviepilotlabs.tumblr.com/post/12470071570/red-light-green-light-with-shoutbox)
a full description of the project and how we use it internally.

How to run
---

shoutbox will only run with thin in production mode, so please start shoutbox via

    rackup -s thin -E production

If you edit stylesheets, also run:

    compass watch -c config/compass.rb


Configuration
---

Edit mongodb settings in config/mongodb.conf, use rackup for all other
options. Add your twitter and pusher credetentials to
config/shotbox.yml.

Add you pusher application id in public/javascripts/shoutbox.js(line 17).

        var pusher = new Pusher('your-app-id');
