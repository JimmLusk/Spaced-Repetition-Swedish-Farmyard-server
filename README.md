# Swedish Farm Yard Server  

The back end of a full stack learning app for Swedish words for animals. Uses a spaced repetition algorithm to order questions with progressively longer gaps between apperances so long as the user gets them correct.

## Users

### Create a User
Users can be created with a POST to /api/users/. Each User has a structure shown below. The order array and position key contain information about the questions the user will be asked, the order in which they will be presented, and the user's history with that question.
```js
{
 displayName: 'Mr. Bar',
  username: 'foobar',
  password:********,
  order:[{qId: mongoose.Schema.Types.ObjectId, nextIndex: Number, weight: Number, timesAnswered: Number, timesCorrect: Number}, ...],
  position: 0
}
```
### Login
A user can log in with a POST to /api/auth/login. A JSON web token will be returned. The token must be in the header of any requests to protected endpoints.

## Questions

### Getting Next
To get the questions at the front of the user's queue of questions make a GET to /api/q/next. This will return information about the question and information about the requesting user's history with that question.

### Sending Answer
To respond with if the user was correct or incorrect make a POST to /api/q/answer/. This will reorder the queue based on if the user was right or wrong, record the user's accuracy to track progress, and increment the question returned with the /api/q/next endpoint.  

## Endpoints

### api/user
#### POST api/user

### api/auth
#### POST api/auth/login

### api/q
#### GET api/q/next
#### POST api/q/answer




#### Setting Up Another Instance
To deploy you'll need a JWT_SECRET and a MONGODB_URI in your enviorment variables. We stored ours in a .env file.


