const registration = new Vue({
  el: '#vue-register',

  data: {
    fname: '',
    lname: '',
    affil: '',
    student: false,
    member: false,
    party: false,
    file: '',
  },

  methods: {
    async sendData() {
      if (!this.fname || !this.lname) message.notify('Please enter your name', 'error');
      else {
        let formdata = new FormData();
        formdata.set('fname', this.fname);
        formdata.set('lname', this.lname);
        formdata.set('affil', this.affil);
        formdata.set('student', this.student);
        formdata.set('member', this.member);
        formdata.set('party', this.party);
        
        try {
          this.file = this.$refs.file.files[0];
        } catch (e) {
          console.log(e);
        }
        
        if (this.file) formdata.append('file', this.file);
        message.notify('Processing', 'warning');
        let res = await axios({
          url: 'http://localhost:3000/items',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          data: formdata,
        }).catch(err => message.notify('There was a problem, please try again later', 'error'));
        message.toggle();
        if (res) message.notify('Your registration information successfully sent to conference organizers. You will recieve a confirmation in the coming days.');
      }
    },
  },
});

const message = new Vue({
  el: '#vue-message',

  data: {
    status: '',
    message: '',
    show: false,
  },

  methods: {
    toggle() {
      this.show = !this.show;
    },
    
    notify(message, status) {
      console.log(message);
      this.show = true;
      this.message = message;
      this.status = status;
    },
  }
});
