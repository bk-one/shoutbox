require File.dirname(__FILE__) + '/spec_helper'

describe "Shoutbox" do
  include Rack::Test::Methods

  def app
    @app ||= Sinatra::Application
  end
  
  context 'authentication' do
    it 'should respond with a 401 status code if remote user is not set' do
      get '/'
      last_response.status.should == 401
    end
    
    it 'should allow acces for authorized users' do
      authorize 'admin', 'admin'
      get '/'
      last_response.should be_redirect
    end
  end
  
  context 'user management' do
    it 'should creating the default shoutbox document shoutbox document with default data' do
      ShoutboxDocument.delete_all
      expect {
        authorize 'admin', 'admin'
        get '/data'
        last_response.body.should == ShoutboxDocument.default_status.to_json
      }.to change(ShoutboxDocument, :count).by(1)
    end
  end
  
  context 'updating status' do    
    it 'should respond with a 400 status code if bad data transmitted' do
      authorize 'admin', 'admin'
      put '/status', "lala", default_env.update(:input => "this is not json")
      last_response.status.should == 400
    end
    
    def default_env
      { 'REMOTE_USER' => 'shouty', 'CONTENT_TYPE' => 'application/json' }
    end
  end
end
