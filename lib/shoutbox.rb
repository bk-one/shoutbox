require 'lib/shoutbox_document'

class Shoutbox
  
  def self.initialize
    initialize_mongodb
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