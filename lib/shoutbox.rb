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
  
  def self.get_current_status( account_name )
    ShoutboxDocument.find_or_create_for_account( account_name ).current_status.to_json
  end
  
  def self.update_status( account_name, update_data )
    document = ShoutboxDocument.find_or_create_for_account( account_name )
    document.update_status( update_data )
    Shoutbox::Bayeux::Broadcast.message( account_name, document.auth_token, update_data.to_hash )
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
  
  def self.mongodb_config_hash
    file_name = File.join(File.dirname(__FILE__), "..", "config", "mongodb.yml")
    hash = YAML.load_file( file_name )
    hash['production']
  end
end