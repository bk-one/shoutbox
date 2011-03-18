require 'eventmachine'

class Broadcast

  def self.message( message )
    EM.run {
      # client.subscribe('/status') do |message|
      #   puts message.inspect
      # end

      client.publish('/status', message)
    }
  end

  def self.client
    @client ||= Faye::Client.new('http://0.0.0.0:9292/bayeux')
  end
end

