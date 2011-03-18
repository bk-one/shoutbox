$LOAD_PATH.unshift File.expand_path(File.dirname(__FILE__))

require 'sinatra'
require 'faye'
require 'lib/shoutbox'
require 'lib/broadcast'


set :public, File.dirname(__FILE__) + '/public'

# you might want to use Rack::Auth for local testing
use Rack::Auth::Basic, 'Shoutbox' do |username, password|
  [username, password] == ['admin', 'admin']
  @account_name = username
end


use Faye::RackAdapter, :mount      => '/bayeux',
                       :timeout    => 45

# Lets start that some bitch
Shoutbox.initialize

get '/' do
  redirect to('/index.html')
end

get '/data' do
  get_shoutbox_document
  content_type :json
  @shoutbox_document.status_data.to_json
end

put '/status' do
  content_type :json
  validate_remote_user
  get_shoutbox_document

  data = JSON.parse request.body.read rescue throw(:halt, [400, "invalid data\n"])
  
  # @shoutbox_document.update_status( )
  Broadcast.message( data.update( :updatedAt => Time.now.to_i, :slug => Shoutbox.convert_to_slug(data['group'], data['status'])))
  "OK"
end

def validate_remote_user
  @account_name = request.env['REMOTE_USER']
end

def get_shoutbox_document
  @shoutbox_document = ShoutboxDocument.find_or_create_for_account( @account_name )
end