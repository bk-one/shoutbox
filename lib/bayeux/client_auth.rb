class Shoutbox
  module Bayeux
    class ClientAuth
      include Util
      
      attr_accessor :auth_token
      
      def initialize( auth_token )
        self.auth_token = auth_token
      end
      
      def outgoing(message, callback)
        if publication?( message )
          message['ext'] ||= {}
          message['ext']['authToken'] = self.auth_token
        end
        
        callback.call(message)
      end
    end
  end
end