class Shoutbox
  module Bayeux
    module Util
      def meta_request?( message )
        message['channel'] =~ /^\/meta\//
      end

      def subscription?( message )
        message['channel'] == '/meta/subscription'
      end

      def publication?( message )
        !!message['channel'].match(/^\/status\//)
      end
    end
  end
end