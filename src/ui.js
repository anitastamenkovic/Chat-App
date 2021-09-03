export class ChatUI {

  constructor ( ulChatList, chatroom1 ) {
    
    this._ulChatList = ulChatList;
    this.chatroom1 = chatroom1
  }

  set ulChatList(ul) {
    this._ulChatList = ul;
  }

  get ulChatList() {
    return this._ulChatList;
  }

  // Clear
  clear() {
    this.ulChatList.innerHTML = ``;
  }

  // Format date
  formatDate(date) {
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    let h = date.getHours();
    let min = date.getMinutes();

    // Today
    let date2 = new Date();
    let d2 = date2.getDate();
    let m2 = date2.getMonth() + 1;
    let y2 = date2.getFullYear();

    //Add 0
    d = String(d).padStart(2, '0');
    m = String(m).padStart(2, '0');
    h = String(h).padStart(2, '0');
    min = String(min).padStart(2, '0');

    if (d == d2 && m == m2 && y == y2) {
      return `${h}:${min}`;
    } else {
      return `${d}.${m}.${y}. - ${h}:${min}`;
    }
  }

  //Create LI
  //data = object = doc from FB
  templateLI(data, id) {
    let date = data.created_at.toDate();
    let strDate = this.formatDate(date);
    let htmlLi;

    if (localStorage.usernameLS == data.username) {
      htmlLi = `<li id="${id}" class="listMessageMe">
            <span class="username">${data.username}</span>
            <span class="message">: ${data.message}</span>
            <div class="date">${strDate}</div>
            <img class="trashImg" id="${id}" src="./img/trash-alt-regular.svg" alt="delete">
        </li>`;
    } else {
      htmlLi = `<li id="${id}" class="listMessage">
            <span class="username">${data.username}</span>
            <span class="message">: ${data.message}</span>
            <div class="date">${strDate}</div>
            <img class="trashImg" id="${id}" src="./img/trash-alt-regular.svg" alt="delete">
        </li>`;
    }

    this.ulChatList.innerHTML += htmlLi;

    // Return to end
    this.ulChatList.scrollTop = this.ulChatList.scrollHeight;
  }

  // After username is changed
  afterUsernameChanged(oldName, newName) {
    let usernames = document.querySelectorAll('.username');
    usernames.forEach(span => {
      if (span.innerHTML == oldName) {
        span.parentElement.className = 'listMessage';
      }
      if (span.innerHTML == newName) {
        span.parentElement.className = 'listMessageMe';
      }
    });
  }

  removeMyChatMessageFromUI ( elem ) {

    elem.remove();
  }

  removeOtherChatMessageFromUI ( elem ) {

    elem.remove();
  }

  onDeleteUserRequest ( elem, id ) {

    if (elem.classList == 'listMessage') {

      this. removeOtherChatMessageFromUI ( elem )

    } else if (

      confirm('Your message will be permanently deleted. Are you sure?')
      
    ) { 

        this.removeMyChatMessageFromUI ( elem )
        this.chatroom1.deleteChat ( id )
    }
  }
}
