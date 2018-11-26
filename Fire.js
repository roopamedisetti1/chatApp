import firebase from 'firebase';

class Fire {

    constructor() {
        this.init();

        this.observeAuth();
    }

    init = () => firebase.initializeApp({
        apiKey: "AIzaSyDKVYm0gtQmI3StBPARacC0UFk4XrktR6o",
        authDomain: "chatappandroid-a77cf.firebaseapp.com",
        databaseURL: "https://chatappandroid-a77cf.firebaseio.com",
        projectId: "chatappandroid-a77cf",
        storageBucket: "chatappandroid-a77cf.appspot.com",
        messagingSenderId: "193643178933"
    });

    observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        if (!user) {
          try {
            // 4.
            firebase.auth().signInAnonymously();
          } catch ({ message }) {
            alert(message);
          }
        }
      };

      get uid() {
        return (firebase.auth().currentUser || {}).uid;
      }

      get ref() {
        return firebase.database().ref('messages');
      }

      parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
          _id,
          timestamp,
          text,
          user,
        };
        return message;
      };

      on = callback =>
       this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

    get timestamp() {
     return firebase.database.ServerValue.TIMESTAMP;
     }
     // send the message to the Backend
     send = messages => {
      for (let i = 0; i < messages.length; i++) {
         const { text, user } = messages[i];
         const message = {
           text,
          user,
          timestamp: this.timestamp,
         };
        this.append(message);
         }
     };

    append = message => this.ref.push(message);

  // close the connection to the Backend
     off() {
     this.ref.off();
     }
      

}

Fire.shared = new Fire();
export default Fire;