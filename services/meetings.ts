import api from './api';
import { MeetingType, MeetingStatus, RecurrenceType, Meeting } from '@/app/(main)/(admin)/meetings';

// Interface matching the server's CreateMeetingDto
export interface CreateMeetingDto {
  title: string;
  description?: string;
  type: MeetingType;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  location: string;
  groupId: string;
  recurrence?: RecurrenceType;
}

// Interface for server response
export interface MeetingResponse {
  _id: string;
  title: string;
  description?: string;
  type: MeetingType;
  startTime: string;
  endTime: string;
  location: string;
  group: {
    _id: string;
    name: string;
  };
  attendees: any[];
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  recurrence?: RecurrenceType;
}

// Convert client meeting format to server format
export const convertToServerFormat = (meeting: any, groupId: string): CreateMeetingDto => {
  console.log("Converting meeting data:", meeting);
  
  if (!meeting.date) {
    throw new Error("Meeting date is required");
  }
  
  if (!meeting.time) {
    throw new Error("Meeting time is required");
  }
  
  // Parse the date string to create proper ISO dates
  let dateObj: Date;
  
  try {
    // First try to use isoDate if available (most reliable format)
    if (meeting.isoDate) {
      console.log("Using provided ISO date:", meeting.isoDate);
      dateObj = new Date(meeting.isoDate);
      
      // Validate the date is valid
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid ISO date: ${meeting.isoDate}`);
      }
    }
    // Handle formatted dates like "Tuesday, August 19, 2025"
    else if (typeof meeting.date === 'string' && meeting.date.includes(',')) {
      console.log("Parsing formatted date:", meeting.date);
      
      // Extract parts from the formatted date string
      const parts = meeting.date.split(',').map((part: string) => part.trim());
      
      // Format should be: "Weekday, Month Day, Year"
      if (parts.length >= 2) {
        const datePart = parts[1]; // "August 19, 2025"
        const dateParts = datePart.split(' ');
        
        if (dateParts.length >= 3) {
          const month = dateParts[0]; // "August"
          const day = parseInt(dateParts[1].replace(',', ''), 10); // "19"
          const year = parseInt(parts[2] || dateParts[2], 10); // "2025"
          
          console.log(`Parsed date parts: month=${month}, day=${day}, year=${year}`);
          
          // Convert month name to month index (0-11)
          const months = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
          const monthIndex = months.findIndex(m => m === month);
          
          if (monthIndex !== -1 && !isNaN(day) && !isNaN(year)) {
            dateObj = new Date(year, monthIndex, day);
            console.log("Successfully parsed date:", dateObj.toISOString());
          } else {
            throw new Error(`Could not parse date parts: month=${month}, day=${day}, year=${year}`);
          }
        } else {
          throw new Error(`Invalid date format: ${datePart}`);
        }
      } else {
        throw new Error(`Invalid date format: ${meeting.date}`);
      }
    } else {
      // Try direct parsing as fallback
      dateObj = new Date(meeting.date);
    }
    
    // Validate the date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date: ${meeting.date}`);
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    // Fallback to current date
    dateObj = new Date();
    console.log("Using fallback date:", dateObj.toISOString());
  }
  
  // Default values in case parsing fails
  let startTime: Date;
  let endTime: Date;
  
  try {
    // Parse time strings like "10:00 AM - 12:00 PM"
    const timeRange = meeting.time.split(' - ');
    if (timeRange.length !== 2) {
      throw new Error("Invalid time format. Expected format: '10:00 AM - 12:00 PM'");
    }
    
    const startTimeStr = timeRange[0];
    const endTimeStr = timeRange[1];
    
    // Function to parse time string and set on date object
    const parseTimeToDate = (timeStr: string, dateObj: Date) => {
      const parts = timeStr.split(' ');
      if (parts.length !== 2) {
        throw new Error(`Invalid time format: ${timeStr}. Expected format: '10:00 AM'`);
      }
      
      const [time, period] = parts;
      const [hoursStr, minutesStr] = time.split(':');
      
      if (!hoursStr || !minutesStr) {
        throw new Error(`Invalid time format: ${time}. Expected format: '10:00'`);
      }
      
      let hours = parseInt(hoursStr, 10);
      let minutes = parseInt(minutesStr, 10);
      
      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error(`Invalid time values: hours=${hoursStr}, minutes=${minutesStr}`);
      }
      
      // Convert to 24-hour format
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      const result = new Date(dateObj);
      result.setHours(hours, minutes, 0, 0);
      return result;
    };
    
    startTime = parseTimeToDate(startTimeStr, dateObj);
    endTime = parseTimeToDate(endTimeStr, dateObj);
  } catch (error) {
    console.error("Error parsing time:", error);
    
    // Use default values (current time + 1 hour for end time)
    startTime = new Date(dateObj);
    startTime.setHours(9, 0, 0, 0); // Default to 9:00 AM
    
    endTime = new Date(dateObj);
    endTime.setHours(10, 0, 0, 0); // Default to 10:00 AM
  }
  
  return {
    title: meeting.title,
    description: meeting.description,
    type: meeting.type,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    location: meeting.location,
    groupId,
    recurrence: meeting.recurrence,
  };
};

// Convert server format to client format
export const convertToClientFormat = (serverMeeting: MeetingResponse): Meeting => {
  // Parse ISO date strings
  const startDate = new Date(serverMeeting.startTime);
  const endDate = new Date(serverMeeting.endTime);
  
  // Format date
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format time range
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutesStr} ${ampm}`;
  };
  
  const timeRange = `${formatTime(startDate)} - ${formatTime(endDate)}`;
  
  // Calculate status based on current time
  const now = new Date();
  let status: MeetingStatus;
  
  if (now < startDate) {
    status = 'upcoming';
  } else if (now > endDate) {
    status = 'past';
  } else {
    status = 'current';
  }
  
  return {
    id: serverMeeting._id,
    title: serverMeeting.title,
    type: serverMeeting.type,
    status,
    date: formattedDate,
    time: timeRange,
    location: serverMeeting.location,
    description: serverMeeting.description,
    attendees: serverMeeting.attendees?.length || 0,
    recurrence: serverMeeting.recurrence || 'none',
    groupId: serverMeeting.group?._id
  };
};

// API functions
export const fetchMeetings = async () => {
  try {
    try {
      const response = await api.get('/meetings');
      console.log('API response for meetings:', response.data);
      return response.data.map(convertToClientFormat);
    } catch (apiError: any) {
      console.error('API error when fetching meetings:', apiError.response?.data || apiError.message);
      
      // If the API is not available yet, return empty array in development mode
      if (process.env.NODE_ENV === 'development') {
        console.warn('API not available, returning empty array in development mode');
        return [];
      } else {
        // In production, rethrow the error
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};

export const createMeeting = async (meetingData: any, groupId: string) => {
  try {
    console.log('Creating meeting with data:', meetingData);
    
    // Validate required fields
    if (!meetingData.title) throw new Error('Meeting title is required');
    if (!meetingData.date) throw new Error('Meeting date is required');
    if (!meetingData.time) throw new Error('Meeting time is required');
    if (!meetingData.location) throw new Error('Meeting location is required');
    if (!meetingData.type) throw new Error('Meeting type is required');
    
    const serverData = convertToServerFormat(meetingData, groupId);
    console.log('Converted to server format:', serverData);
    
    // Make the actual API call to create the meeting
    try {
      const response = await api.post('/meetings', serverData);
      console.log('API response:', response.data);
      return convertToClientFormat(response.data);
    } catch (apiError: any) {
      console.error('API error:', apiError.response?.data || apiError.message);
      
      // If the API is not available yet, use a simulated response for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using simulated response in development mode');
        const simulatedResponse = {
          _id: `dev-${Date.now()}`,
          title: meetingData.title,
          description: meetingData.description,
          type: meetingData.type,
          startTime: serverData.startTime,
          endTime: serverData.endTime,
          location: meetingData.location,
          group: {
            _id: groupId,
            name: 'Development Group'
          },
          attendees: [],
          createdBy: {
            _id: 'dev-user',
            name: 'Developer'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          recurrence: meetingData.recurrence
        };
        
        return convertToClientFormat(simulatedResponse);
      } else {
        // In production, rethrow the error
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

export const getMeetingById = async (id: string) => {
  try {
    const response = await api.get(`/meetings/${id}`);
    return convertToClientFormat(response.data);
  } catch (error) {
    console.error(`Error fetching meeting with id ${id}:`, error);
    throw error;
  }
};