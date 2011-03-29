$LOAD_PATH.unshift File.expand_path(File.dirname(__FILE__))
require 'sinatra'
require 'faye'
require 'lib/shoutbox'
require 'lib/bayeux'
require 'omniauth'
require 'pp'

enable :sessions

use Faye::RackAdapter, :mount      => '/bayeux',
                       :timeout    => 45,
                      :extensions => [ Shoutbox::Bayeux::ServerAuth.new ]

use OmniAuth::Builder do
  provider :twitter, Shoutbox.twitter_consumer_key, Shoutbox.twitter_consumer_secret
end

set :public, File.dirname(__FILE__) + '/public'


# Lets start that some bitch
Shoutbox.initialize

get '/' do
  redirect to('/index.html')
end

get '/signup' do
  <<-HTML
    <a href='/auth/twitter'>Sign in with Twitter</a>
  HTML
end

get '/auth/:name/callback' do
  auth = request.env['omniauth.auth']
  redirect to('/shoutbox.html')
  # do whatever you want with the information!
end

get '/auth/failure' do
  puts request.env.to_s
  File.read('public/failure.html')
end

get '/data' do
  content_type :json
  Shoutbox.get_current_status( @account_name )
end

put '/status' do
  content_type :json
  @shoutbox_data = Shoutbox::ShoutboxData.from_json_string( request.body.read )
  puts @shoutbox_data.inspect
  Shoutbox.update_status( @account_name, @shoutbox_data )
  "OK"
end

def remote_user
  @account_name = request.env['omniauth.auth']['user_info']['username']
  response.headers['X-Shoutbox-Auth-Token']   = Shoutbox.auth_token_for( @account_name )
  response.headers['X-Shoutbox-Account-Name'] = @account_name
end
