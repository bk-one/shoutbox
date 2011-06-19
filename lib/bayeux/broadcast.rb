require 'eventmachine'

class Shoutbox
  module Bayeux
    class Broadcast
      @clients = {}

      def self.message( account_name, auth_token, message )
        client(auth_token).publish('/status/' + account_name, message)
      end

      def self.client(auth_token)
        @clients[auth_token] ||= create_client(auth_token) 
      end
      
      def self.create_client(auth_token)
        client = Faye::Client.new(Shoutbox.full_host + "/bayeux")
        client.add_extension(Shoutbox::Bayeux::ClientAuth.new(auth_token))
        client
      end
    end
  end
end
