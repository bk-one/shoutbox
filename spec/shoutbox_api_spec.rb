require 'JSON'
require 'shoutbox-client'

HOST = 'localhost'
PORT = '3000'

describe "Shoutbox API" do
  it "should create a status message" do
    response = Net::HTTP.start(HOST, PORT) do
      req = Net::HTTP::Put.new(  )
      req['Content-Type'] = 'application/json'
      req.body = { :status => options[:status].to_s }.to_json
      http.request(req)
    end
    response.body.should == "OK"
  end
end


