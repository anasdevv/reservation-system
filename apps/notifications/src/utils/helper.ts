import { google } from 'googleapis';
const { OAuth2 } = google.auth;
export const getAccessToken = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
    return new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log('this error ', err);
          reject();
        }
        resolve(token);
      });
    });
  } catch (error) {
    console.log('error 22', error);
    throw new Error(error.message);
  }
};
