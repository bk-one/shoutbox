require 'eventmachine'

class Shoutbox
  module Bayeux
    class Broadcast

      def self.message( account_name, auth_token, message )
        EM.run {
          client.publish('/status/' + account_name, message)
        }
      end

      def self.client
        @client ||= create_client
      end
      
      def self.create_client  
        client = Faye::Client.new(Shoutbox.full_host + "/bayeux")
        client.add_extension(Shoutbox::Bayeux::ClientAuth.new(auth_token))
        client
      end
    end
  end
end
