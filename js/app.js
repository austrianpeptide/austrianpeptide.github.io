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
      if (!this.data.fname || !this.data.lname) message.error = 'Please enter your name';
      else {
        let res = await axios({
          method: 'post',
          url: '',
          headers: {
            'Content-Type': 'application/json',
          },
          data: this.data,
        }).catch(err => message.error = err);

        if (res) message.success = "Thank you for your registration!";
      }
    }
  },
});

const message = new Vue({
  el: '#vue-message',

  data: {
    error: '',
    success: '',
    show: false,
  },

  methods: {
    toggle() {
      this.show = !this.show;
    }
  }
});
