require 'digest/sha2'

class Shoutbox
  module Authentication
    DEFAULT_SALT = 'this is the default shoutbox salt'
  
    def self.authenticate?( account_name, auth_token )
      auth_token == ShoutboxDocument.find_document_for( account_name ).auth_token
    end
    
    def self.create_auth_token_for( account_name )
      salt  = Digest::SHA2.hexdigest("#{Time.now.utc}#{account_name}#{DEFAULT_SALT}")
      token = Digest::SHA2.hexdigest("#{salt}--#{account_name}")
      return [salt, token]
    end
  end
end