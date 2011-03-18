require 'lib/shoutbox_document'
require 'digest/sha2'

class Shoutbox
  
  DEFAULT_SALT = 'this is the default shoutbox salt'
  
  def self.initialize
    initialize_mongodb
  end
  
  def self.convert_to_slug( group_name, status_name )
    (group_name + "-" + status_name).to_url
  end
  
  def self.create_auth_token_for( account_name )
    salt  = Digest::SHA2.hexdigest("#{Time.now.utc}#{account_name}#{DEFAULT_SALT}")
    token = Digest::SHA2.hexdigest("#{salt}--#{account_name}")
    return [salt, token]
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