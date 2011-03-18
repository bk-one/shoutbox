$LOAD_PATH.unshift File.expand_path(File.dirname(__FILE__))

require 'sinatra'
require 'faye'
require 'lib/shoutbox'
require 'lib/broadcast'


set :public, File.dirname(__FILE__) + '/public'

# use Rack::Auth::Basic, 'Shoutbox' do |username, password|
#   [username, password] == ['admin', 'admin']
# end


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
  
  data = JSON.parse request.body.read
  
  # @shoutbox_document.update_status( )
  Broadcast.message( data.update( :updatedAt => Time.now.to_i, :slug => 'test-slug'))
  "OK"
end


def get_shoutbox_document
  @shoutbox_document = ShoutboxDocument.first
end