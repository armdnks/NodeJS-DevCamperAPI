# DevCamper API

> Backend API for DevCamper application, which is a bootcamp directory website
> https://documenter.getpostman.com/view/18750461/VUjPKRap

> https://course-devcamper-api.herokuapp.com/

## Usage

Create "config/config.env" and update the values/settings to your own

```text
NODE_ENV=""
PORT=""

MONGO_URI=""

GEOCODER_PROVIDER=""
GEOCODER_API_KEY=""

FILE_UPLOAD_PATH=""
MAX_FILE_UPLOAD=""

JWT_SECRET=""
JWT_EXPIRE=""
JWT_COOKIE_EXPIRE=""

SMTP_HOST=""
SMTP_PORT=""
SMTP_EMAIL=""
SMTP_PASSWORD=""
FROM_EMAIL=""
FROM_NAME=""
```

## Install Dependencies

```
npm install
```

## Run App

```
# Run in devlopment mode
npm run dev

# Run in production mode
npm start
```
