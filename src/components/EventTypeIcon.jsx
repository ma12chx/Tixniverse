import { Ticket } from "lucide-react";

function EventTypeIcon({ icon: Icon = Ticket, ...props }) {
  return <Icon {...props} />;
}

export default EventTypeIcon;
