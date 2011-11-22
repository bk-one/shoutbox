require File.dirname(__FILE__) + '/spec_helper'

describe "Shoutbox" do
  include Rack::Test::Methods

  let(:channel){  mock(:channel) }

  before(:each) do
    channel.stub(:trigger!){ true }
  end


  def app
    @app ||= Sinatra::Application
  end

  context 'user management' do
    it 'created the default shoutbox document with default data' do
      expect {
        get '/data', nil, omniauth_env
        last_response.status.should == 200
      }.to change(Shoutbox::ShoutboxDocument, :count).by(1)
    end
  end

  context 'updating status - error handling' do
    before(:each) do
      @auth_token = Shoutbox.auth_token_for( 'my_shoutbox' )
    end

    it 'responds with a 400 status code if bad data transmitted' do
      put '/status', nil, tokenauth_env(@auth_token).update(:input => "this is not json")
      last_response.status.should == 400
    end

    it 'responds with a 400 status code if invalid json data transmitted' do
      put '/status', nil, tokenauth_env(@auth_token).update(:input => invalid_shoutbox_data.to_json)
      last_response.status.should == 400
    end

    it 'responds with a 400 status code if message is missing on red status' do
      put '/status', nil, tokenauth_env(@auth_token).update(:input => valid_shoutbox_data.update(:status => 'red', :message => nil).to_json )
      last_response.status.should == 400
    end

    it 'responds with a 400 status code if message is missing on yellow status' do
      put '/status', nil, tokenauth_env(@auth_token).update(:input => valid_shoutbox_data.update(:status => 'yellow', :message => nil).to_json )
      last_response.status.should == 400
    end
  end

  context 'update status - valid data' do
    before(:each) do
      @auth_token = Shoutbox.auth_token_for( 'my_shoutbox' )
    end

    it "responds with a 200 status code if valid json data transmitted" do
      Pusher.should_receive(:[]).and_return(channel)
      put '/status', nil, tokenauth_env(@auth_token).update(:input => valid_shoutbox_data.to_json)
      last_response.status.should == 200
    end

    it 'includes the auth_key in the data hash' do
      get '/data', nil, omniauth_env
      last_response.headers['X-Shoutbox-Auth-Token'].should == Shoutbox::ShoutboxDocument.find_document_for( 'my_shoutbox' ).auth_token
    end

    it 'sets the expiration time correctly' do
      Pusher.should_receive(:[]).and_return(channel)
      time = Time.now.to_i + 60
      put '/status', nil, tokenauth_env(@auth_token).update(:input => valid_shoutbox_data.update('expires_in' => 60).to_json)
      last_response.status.should == 200
      get '/data', nil, omniauth_env
      JSON.parse(last_response.body)[valid_shoutbox_data['group']][valid_shoutbox_data['slug']]['expires_at'].should == time
    end

  end

  def tokenauth_env( auth_token )
    { 'HTTP_X_SHOUTBOX_AUTH_TOKEN' => auth_token, 'CONTENT_TYPE' => 'application/json' }
  end

  def omniauth_env
    { 'omniauth.auth' => { 'user_info' => { 'nickname' => 'my_shoutbox' } }, 'CONTENT_TYPE' => 'application/json' }
  end

  def valid_shoutbox_data
    { 'name'     => 'Status Name',
      'group'    => 'Default Group',
      'message'  => 'This is the message',
      'status'   => 'green',
      'slug'     => 'default-group-status-name' }
  end

  def invalid_shoutbox_data
    data = valid_shoutbox_data.clone
    data.delete('status')
    data
  end
end
