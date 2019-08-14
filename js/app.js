const registration = new Vue({
  el: '#vue-register',

  data: {
    fname: '',
    lname: '',
    affil: '',
    student: false,
    member: false,
    party: false,
  },

  methods: {
    async sendData() {
      if (!this.fname || !this.lname) message.notify('Please enter your name', 'error');
      else {
        // Send data to server
      }
    }
  },
});

const message = new Vue({
  el: '#vue-message',

  data: {
    success: '',
    show: false,
  },

  methods: {
    toggle() {
      this.show = !this.show;
    },
    
    notify(message, status) {
      console.log(message);
      this.show = true;
      this[status] = message;
    },
  }
});
