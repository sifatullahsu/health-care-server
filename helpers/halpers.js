const mongoose = require('mongoose');

const response = (status, data, pagination) => {
  const results = { status }

  if (status) {
    results.data = data;

    if (pagination) {
      results.pagination = pagination;
    }
  }
  else {
    results.message = data;
  }

  return results;
}

const isID = (id) => {
  return mongoose.isValidObjectId(id);
}

const getZoomToken = async () => {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_SECRET_KEY;

  const apiEndpoint = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;

  const result = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    }
  });
  const data = await result.json();

  return data;
}

const createZoomMeeting = async (meetingInfo) => {
  const token = await getZoomToken();

  const meeting = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify(meetingInfo)
  });
  const data = meeting.json();

  return data;
}

module.exports = { response, isID, getZoomToken, createZoomMeeting };