export class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection('chats');
    this.unsub;
  }

  // Seters
  set room(r) {
    this._room = r;
  }

  set username(un) {
    if (un.length < 2 && un.length > 10) {
      alert('Nevalidan unos!');
    }
    const res = /^[A-Za-z0-9_\.]+$/.exec(un);
    const valid = !!res;
    if (valid) {
      this._username = un;
    } else {
      alert('Nevalidan unos!');
    }
  }

  // Geters
  get room() {
    return this._room;
  }

  get username() {
    return this._username;
  }

  // Update username
  updateUsername(un) {
    this.username = un;
    localStorage.setItem('usernameLS', un);
  }

  // Update room
  updateRoom(ur) {
    this.room = ur;
    localStorage.setItem('roomLS', ur);
    if (this.unsub) {
      this.unsub();
    }
  }

  //Add new message
  async addChat(mess) {
    //Today - needed for timestamp
    let date = new Date();

    // Create object/doc for FB
    let docChat = {
      message: mess,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(date),
    };

    //Add doc to FB
    let response = await this.chats.add(docChat);
    return response; // Promise
  }

  // Doc added to FB
  getChats(callback) {
    this.unsub = this.chats
      .where('room', '==', this.room)
      .orderBy('created_at')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type == 'added') {
            //update chat - add new message to screen
            callback(change.doc.data(), change.doc.id);
          }
        });
      });
  }

  deleteChat ( id ) {

    this.chats
        .doc(id)
        .delete()
        .then(() => {
          console.log( 'Message is deleted form firebase' )          
        })
        .catch(err => {
          console.log('Error', err);
        });
  }
}
