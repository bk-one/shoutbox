class Shoutbox
  class ShoutboxDocument
    module Status
      
      def current_status
        self.status_data
      end
      
      def update_status( status_data )
        validate_status_data( status_data )
        self.status_data[status_data.group] ||= {}
        self.status_data[status_data.group][status_data.name] = status_data.to_hash
        self.save!
      end

      private
      
      def validate_status_data( status_data )
        throw(:halt, [400, "invalid json data\n"]) unless status_data.valid?
      end

    end
  end
end
