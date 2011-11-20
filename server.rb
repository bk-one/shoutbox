$LOAD_PATH.unshift File.expand_path(File.dirname(__FILE__))
require 'sinatra'
require 'pusher'
require 'faye'
require 'lib/shoutbox'
require 'lib/bayeux'
require 'rack-flash'
require 'omniauth'
require 'pp'

enable :sessions

use Rack::Flash, :accessorize => [:notice, :error]

use Faye::RackAdapter, :mount      => '/bayeux',
                       :timeout    => 45,
                      :extensions => [ Shoutbox::Bayeux::ServerAuth.new ]


Pusher.app_id = '11143'
Pusher.key = '1a048af8db3c5517af72'
Pusher.secret = '626f02ff0cc9c8065cc6'

use OmniAuth::Builder do
  provider :twitter, Shoutbox.twitter_consumer_key, Shoutbox.twitter_consumer_secret
end

OmniAuth.config.full_host = Shoutbox.full_host if Shoutbox.full_host

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

get '/logout' do
  logout
  redirect to('/index.html?flash_notice=Successfully%20logged%20out.')
end

get '/auth/:name/callback' do
  session[:user_name] = account_name_from_omniauth
  redirect to('/shoutbox.html')
end

get '/auth/failure' do
  File.read('public/failure.html')
end

get '/data' do
  content_type :json
  Shoutbox.get_current_status( current_user )
end

put '/status' do
  content_type :json
  @shoutbox_data = Shoutbox::ShoutboxData.from_json_string( request.body.read )
  Shoutbox.update_status( current_user, @shoutbox_data )
  "OK"
end

delete '/status' do
  content_type :json
  @shoutbox_data = Shoutbox::ShoutboxData.from_json_string( request.body.read )
  Shoutbox.delete_status( current_user, @shoutbox_data )
  "OK"
end

post '/pusher/auth' do
  content_type :json
  if current_user && "private-#{current_user}" == params[:channel_name]
    Pusher[params[:channel_name]].authenticate(params[:socket_id]).to_json
  end
end

private

def current_user
  @current_user ||= session[:user_name] || account_name_from_auth_token || account_name_from_omniauth
  throw(:halt, [401, "Unable to identify you\n"]) unless @current_user
  response.headers['X-Shoutbox-Auth-Token']   = Shoutbox.auth_token_for( @current_user )
  response.headers['X-Shoutbox-Account-Name'] = @current_user
end

def logout
  @current_user = nil
  session[:user_name] = nil
end

def account_name_from_omniauth
  auth_hash = request.env['omniauth.auth']
  auth_hash['user_info']['nickname'] if auth_hash and auth_hash['user_info']
end

def account_name_from_auth_token
  if auth_token = request.env['HTTP_X_SHOUTBOX_AUTH_TOKEN']
    return Shoutbox.get_account_name_from_auth_token( auth_token )
  end
  nil
end
