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
    presents: '',
    email: '',
  },

  methods: {
    async sendData() {
      if (!this.fname || !this.lname || !this.email) message.notify('Please enter your name and email', 'error');
      else {
        let formdata = new FormData();
        formdata.set('fname', this.fname);
        formdata.set('lname', this.lname);
        formdata.set('affil', this.affil);
        formdata.set('student', this.student);
        formdata.set('member', this.member);
        formdata.set('party', this.party);
        formdata.set('presents', this.presents);
        formdata.set('email', this.email);
        
        try {
          this.file = this.$refs.file.files[0];
        } catch (e) {
          console.log(e);
        }
        
        if (this.file) formdata.append('file', this.file);
        message.notify('Processing', 'warning');
        let res = await axios({
          url: 'https://litrev.org/atps/items',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          data: formdata,
        }).catch(err => message.notify('There was a problem, please try again later', 'error'));

        if (res) message.notify('Your registration information successfully sent to conference organizers. You will recieve a confirmation in the coming days.', 'success');
      }
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
  },
});

const message = new Vue({
  el: '#vue-message',

  data: {
    status: '',
    message: '',
    hide: true,
    payment: false,
  },

  methods: {
    toggle() {
      this.hide = !this.hide;
    },
    
    notify(message, status) {
      console.log('notify', message);
      this.hide = false;
      this.message = message;
      this.status = status;
      if (status == 'error') setTimeout(() => this.toggle(), 1500);
      if (status == 'success') this.payment = true;
      else this.payment = false;
    },
  }
});

const admin = new Vue({
  el: '#vue-admin',

  data: {
    items: [],
    username: '',
    password: '',
    showlogin: true,
    showitems: false,
    csvfile: '',
  },

  methods: {
    async login() {
      let res = await axios({
        method: 'post',
        url: 'https://litrev.org/atps/signin',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          username: this.username,
          password: btoa(this.password)
        },
      }).catch(err => message.notify('Wrong username or password', 'error'));
      if (res) {
        this.items = res.data.items;
        this.processItems();
      }
    },

    processItems() {
      if (this.items) {
        const attends = [];
        this.items.forEach(item => {
          if (item.attend || item.attend === undefined) attends.push(item);
        });
        this.items = attends;
        this.showlogin = false;
        this.showitems = true;
        if (this.items && this.items.length) {
          let row = Object.keys(this.items[0]).join(',');
          this.csvfile += row + '\r\n';
          this.items.forEach((item) => {
            let vals = [];
            Object.keys(item).forEach(key => vals.push(item[key]));
            row = vals.join(',');
            if (row.indexOf('\r\n') !== -1) row = row.replace('\r\n', ' ');
            this.csvfile += row + '\r\n';
          });
        }
      }
    },

    async markPayment(itemId) {
      let res = await axios({
        method: 'put',
        url: 'https://litrev.org/atps/items',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { itemId }
      }).catch(err => console.log(err));;
      if (res) this.items = res.data.items;
      this.processItems();
    },

    async deleteItem(itemid) {
      let res = await axios({
        method: 'delete',
        url: 'https://litrev.org/atps/items/' + itemid,
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(err => console.log(err));;
      if (res) this.items = res.data.items;
      this.processItems();
    },

    downLoadCsv() {
      const a = document.createElement('a');
      let mimeType = 'text/csv;encoding:utf-8';
      const content = this.csvfile;
      const fileName = 'atps2019.csv';
      mimeType = mimeType || 'application/octet-stream';

      if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([content], {
          type: mimeType
        }), fileName);
      } else if (URL && 'download' in a) { //html5 A[download]
        a.href = URL.createObjectURL(new Blob([content], {
          type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
      }
    }
  },
});
