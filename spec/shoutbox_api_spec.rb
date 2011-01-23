require File.expand_path(File.dirname(__FILE__) + '/spec_helper')

HOST = 'localhost'
PORT = '3000'

describe "ShoutboxClient and " do
  it "should create a status message" do
    ShoutboxClient.shout( :group => "my_group", :statusId => "test_status", :status => :green ).should   == true
    ShoutboxClient.shout( :group => "my_group", :statusId => "test_status", :status => :destroy ).should == true
  end
  
end


