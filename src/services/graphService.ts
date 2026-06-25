export interface GraphCalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  body?: { content: string };
  organizer?: { emailAddress: { name: string } };
}

export async function getCalendarEvents(
  _accessToken: string,
  _startDate: Date,
  _endDate: Date
): Promise<GraphCalendarEvent[]> {
  // In production: use @microsoft/microsoft-graph-client
  // const client = Client.init({ authProvider: ... })
  // return client.api('/me/calendarView').query({ startDateTime, endDateTime }).get()
  return [];
}
