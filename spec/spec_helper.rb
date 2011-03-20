require File.join(File.dirname(__FILE__), '..', 'server.rb')

require 'rubygems'
require 'sinatra'
require 'rspec'
require 'rack/test'
require 'json'
require 'database_cleaner'

# set test environment
set :environment, :test
set :run, false
set :raise_errors, true
set :logging, false

DatabaseCleaner.strategy = :truncation

RSpec.configure do |config|
  config.after(:each) do
    DatabaseCleaner.clean
  end
end
