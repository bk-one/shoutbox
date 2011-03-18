require File.dirname(__FILE__) + '/spec_helper'

describe "Shoutbox" do
  include Rack::Test::Methods

  def app
    @app ||= Sinatra::Application
  end

  context 'authentication' do
    it "should require basic authentication" do
      get '/'
      last_response.status.should == 401
      last_response.headers['WWW-Authenticate'].should == %(Basic realm="Shoutbox")
    end

    it "should respond to /" do
      basic_authorize 'admin', 'admin'
      get '/'
      last_response.should be_ok
    end
  end
  
  context 'dashboard' do
    
  end
end
