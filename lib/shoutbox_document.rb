require 'mongoid'
require 'json'

class ShoutboxDocument
  include Mongoid::Document
  field :account_name
  field :status_data, :type => Hash
  
end