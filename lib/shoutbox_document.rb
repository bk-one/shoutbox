require 'mongoid'
require 'json'

class ShoutboxDocument
  include Mongoid::Document
  field :account_name
  field :status_data, :type => Hash
  field :auth_token
  field :auth_salt
  
  
  def self.find_or_create_for_account( account_name )
    self.where( :account_name => account_name ).first || create_shoutbox_document_for_account( account_name )
  end
  
  private

  def self.create_shoutbox_document_for_account( account_name )
    salt, token = Shoutbox.create_auth_token_for( account_name )
    self.create( :account_name => account_name, :status_data => default_status, :auth_token => token, :auth_salt => salt )
  end
  
  def self.default_status
    { "Shoutbox Default Group" => { "Use Shoutbox" => { "slug"    => "shoutbox-default-group-use-shoutbox",
                                                        "status"  => "red", 
                                                        "message" => "You can remove me by using your shoutbox client." } } }
  end
end