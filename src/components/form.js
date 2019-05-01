import firebase from 'firebase/app';
import 'firebase/database';
import * as d3 from 'd3';
import responseFunction from '../components/responses';

const config = {
  apiKey: "AIzaSyCYVGCqyTx2fFh_Ntj_2Wtg_MQV_oOOKbE",
  authDomain: "killing-the-penny-230200.firebaseapp.com",
  databaseURL: "https://killing-the-penny-230200.firebaseio.com",
  projectId: "killing-the-penny-230200",
  storageBucket: "killing-the-penny-230200.appspot.com",
  messagingSenderId: "195799161355"
};

firebase.initializeApp(config);

const database = firebase.database();

let formData = {
  before : null,
  after : null
}
 
d3.selectAll('.button_before')
  .on('click', function() {
    formData.before = d3.select(this).attr('data-value');
  });

d3.selectAll('.button_after')
  .on('click', function() {
    formData.after = d3.select(this).attr('data-value');
    console.log(formData);
    database.ref('responses').push(formData);
  });



// $('#before_form').submit((e) => {
//   e.preventDefault(); //prevent default form action
//   formData.before = $('input[name=before]:checked').val()
//   console.log(formData);
// })

// $('#after_form').submit((e) => {
//   e.preventDefault(); //prevent default form action
//   formData.before = $('input[name=before]:checked').val() || formData.before
//   formData.after = $('input[name=after]:checked').val() || formData.after
//   console.log(formData);

//   database.ref('responses').push(formData);
// })

// console.log(formData);

// database.ref('responses')
//   .once('value')
//   .then((snapshot) => {
//     const responses = [];

//     snapshot.forEach((childSnapshot) => {
//       responses.push({
//         id: childSnapshot.key,
//         ...childSnapshot.val()
//       });
//     });

//     responseFunction(responses);

//   });