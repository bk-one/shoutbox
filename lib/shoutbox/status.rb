class Shoutbox
  class ShoutboxDocument
    module Status

      def current_status
        self.status_data
      end

      def status_data
        @status_data ||= JSON.parse(self.status_data_json)
      end

      def status_data=(data_hash)
        self.status_data_json = data_hash.to_json
      end

      def update_status(status_data)
        validate_status_data(status_data)
        status_hash = self.status_data
        status_hash[status_data.group] ||= {}
        status_hash[status_data.group][status_data.slug] = status_data
        self.status_data = status_hash
        self.safely.save!
      end

      def delete_status(status_data)
        status_hash = self.status_data
        if status_hash[status_data.group]
          status_hash[status_data.group].delete(status_data.slug)
        end
        status_hash.delete(status_data.group) if status_hash[status_data.group].keys.empty?
        self.status_data = status_hash
        self.safely.save!
      end

      private

      def validate_status_data(status_data)
        throw(:halt, [400, "invalid json data\n"]) unless status_data.valid?
      end

    end
  end
end
