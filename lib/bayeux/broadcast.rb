require 'eventmachine'

class Shoutbox
  module Bayeux
    class Broadcast

      def self.message( account_name, auth_token, message )
        EM.run {
          client.add_extension(Shoutbox::Bayeux::ClientAuth.new(auth_token))
          client.publish('/status/' + account_name, message)
        }
      end

      def self.client
        @client ||= Faye::Client.new(Shoutbox.full_host)
      end
    end
  end
end
