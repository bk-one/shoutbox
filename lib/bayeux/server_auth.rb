class Shoutbox
  module Bayeux
    class ServerAuth
      include Util
      
      def incoming(message, callback)
        if subscription?(message) or publication?(message)
          authenticated?( account_name(message), auth_token(message) ) || message['error'] = 'Invalid subscription auth token'
        elsif not meta_request?(message)
          message['error'] = 'Invalid request'
        end
        callback.call(message)
      end
    
    
      private 
    
      def account_name( message )
        message['subscription'].split('/')[2] if subscription?( message )
        message['channel'].split('/')[2]      if publication?( message )
      end
    
      def auth_token( message )
        message['ext'] && message['ext']['authToken']
      end
    
      def authenticated?( account_name, auth_token )
        Shoutbox::Authentication.authenticate?( account_name, auth_token )
      end
    end
  end
end