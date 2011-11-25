require 'lib/shoutbox/authentication'
require 'lib/shoutbox/data'
require 'lib/shoutbox/document'
require 'lib/shoutbox/util'

class Shoutbox
  include Authentication
  include Util

  def self.initialize
    initialize_mongodb
  end

  def self.full_host
    configuration['full_host']
  end

  def self.twitter_consumer_key
    configuration['twitter']['key']
  end

  def self.twitter_consumer_secret
    configuration['twitter']['secret']
  end

  def self.pusher_app_id
    configuration['pusher']['app_id']
  end

  def self.pusher_key
    configuration['pusher']['key']
  end

  def self.pusher_secret
    configuration['pusher']['secret']
  end

  def self.configuration
    @configuration ||= configuration_hash
  end

  def self.get_current_status( account_name )
    throw(:halt, [400, "empty account_name\n"]) if account_name.nil?
    ShoutboxDocument.find_or_create_for_account( account_name ).current_status.to_json
  end

  def self.get_account_name_from_auth_token( auth_token )
    ShoutboxDocument.find_for_auth_token( auth_token ).account_name
  end

  def self.update_status( account_name, update_data )
    document = ShoutboxDocument.find_or_create_for_account( account_name )
    document.update_status( update_data )
    broadcast("private-#{account_name}", "shout", update_data.to_hash)
  end

  def self.delete_status( account_name, update_data )
    document = ShoutboxDocument.find_or_create_for_account( account_name )
    document.delete_status( update_data )
    broadcast("private-#{account_name}", "shout", update_data.to_hash)
  end

  def self.auth_token_for( account_name )
    ShoutboxDocument.find_or_create_for_account( account_name ).auth_token
  end

  private

  def self.initialize_mongodb
    Mongoid.configure do |config|
      config.from_hash(mongodb_config_hash)
    end
  end

  def self.configuration_hash
    file_name = File.join(File.dirname(__FILE__), "..", "config", "shoutbox.yml")
    hash = YAML.load_file( file_name )
  end

  def self.broadcast(channel, event, data)
    Pusher[channel].trigger_async(event, data)
  end

  def self.mongodb_config_hash
    file_name = File.join(File.dirname(__FILE__), "..", "config", "mongodb.yml")
    hash = YAML.load_file( file_name )
    hash['production']
  end
end
