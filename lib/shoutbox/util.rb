require 'stringex'

class Shoutbox
  module Util
    def self.convert_to_slug(group_name, status_name)
      (group_name + "-" + status_name).to_url
    end
  end
end
