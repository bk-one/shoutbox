class Shoutbox
  class ShoutboxData

    attr_accessor :name, :status, :message, :group, :slug, :updated_at, :expires_at

    def initialize( hash )
      self.name       = hash['display_name'] || hash['name']
      self.status     = hash['status']
      self.message    = truncate_message(hash['message'])
      self.group      = hash['group']
      self.slug       = Shoutbox::Util.convert_to_slug( hash['group'], hash['name'] )
      self.expires_at = expiration_time(hash['expires_in'])
      self.updated_at = Time.now.to_i
      self
    end

    def valid?
      valid_shoutbox_status? and valid_shoutbox_message?
    end

    def to_hash
      { :name       => self.name,
        :status     => self.status,
        :message    => self.message,
        :slug       => self.slug,
        :updated_at => self.updated_at,
        :expires_at => self.expires_at,
        :group      => self.group }
    end

    def self.from_json_string( json_string )
      begin
        ShoutboxData.new( JSON.parse( json_string ) )
      rescue JSON::ParserError
        throw(:halt, [400, "invalid json data\n"])
      end
    end


    private

    def expiration_time( expires_in )
      Time.now.to_i + (expires_in ? expires_in : (60*60*24 + 15))
    end

    def valid_shoutbox_message?
      ((status == 'red' or status == 'yellow') and (message.nil? or message == '')) ? false : true
    end

    def valid_shoutbox_status?
      ['red','green','yellow','remove'].include?(self.status)
    end

    def truncate_message(message)
      return "" if message.nil?
      message.size > 100 ? "#{message[0..99]}..." : message
    end
  end
end
