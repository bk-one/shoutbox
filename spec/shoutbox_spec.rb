require File.dirname(__FILE__) + '/spec_helper'

describe "Shoutbox" do
  include Rack::Test::Methods

  def app
    @app ||= Sinatra::Application
  end
  
  # context 'authentication' do
  #   it 'should respond with a 401 status code if remote user is not set' do
  #     get '/'
  #     last_response.status.should == 401
  #   end
  #   
  #   it 'should allow acces for authorized users' do
  #     authorize 'admin', 'admin'
  #     get '/'
  #     last_response.should be_redirect
  #   end
  # end
  
  context 'user management' do
    it 'should creating the default shoutbox document shoutbox document with default data' do
      expect {
        get '/data'
        last_response.status.should == 200
      }.to change(Shoutbox::ShoutboxDocument, :count).by(1)
    end
  end
  
  context 'updating status - error handling' do
    it 'should respond with a 400 status code if bad data transmitted' do
      put '/status', "lala", default_env.update(:input => "this is not json")
      last_response.status.should == 400
    end
    
    it 'should respond with a 400 status code if invalid json data transmitted' do
      put '/status', "lala", default_env.update(:input => invalid_shoutbox_data.to_json)
      last_response.status.should == 400
    end

    it 'should respond with a 400 status code if message is missing on red status' do
      put '/status', "lala", default_env.update(:input => valid_shoutbox_data.update(:status => 'red', :message => nil).to_json )
      last_response.status.should == 400
    end

    it 'should respond with a 400 status code if message is missing on yellow status' do
      put '/status', "lala", default_env.update(:input => valid_shoutbox_data.update(:status => 'yellow', :message => nil).to_json )
      last_response.status.should == 400
    end
  end
  
  context 'update status - valid data' do
    it "should respond with a 200 status code if valid json data transmitted" do
      put '/status', "lala", default_env.update(:input => valid_shoutbox_data.to_json)
      last_response.status.should == 200
    end
    
    it 'should include the auth_key in the data hash' do
      get '/data'
      last_response.headers['X-Shoutbox-Auth-Token'].should == Shoutbox::ShoutboxDocument.find_document_for( 'my_shoutbox' ).auth_token
    end
    
    it 'should set the expiration time correctly' do
      time = Time.now.to_i + 60
      put '/status', "lala", default_env.update(:input => valid_shoutbox_data.update('expires_in' => 60).to_json)
      last_response.status.should == 200
      get '/data'
      JSON.parse(last_response.body)[valid_shoutbox_data['group']][valid_shoutbox_data['name']]['expires_at'].should == time
    end
    
  end
  


  def default_env
    { 'rack.auth' => 'shouty', 'CONTENT_TYPE' => 'application/json' }
  end
  
  def valid_shoutbox_data
    { 'name'     => 'Status Name',
      'group'    => 'Default Group',
      'message'  => 'This is the message',
      'status'   => 'green' }
  end
  
  def invalid_shoutbox_data
    data = valid_shoutbox_data.clone
    data.delete('status')
    data
  end
end
