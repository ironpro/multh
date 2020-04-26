import React from "react";
import classnames from "classnames";
import $ from 'jquery';

import DataVar from '../../variables/data';

// reactstrap components
import { Card, Container, Row, CardHeader, CardBody, CardFooter, Col, Button,FormGroup, Input, TabContent,
	TabPane,
	NavItem,
	NavLink,
	Nav, } from "reactstrap";

import UncontrolledLottie from '../../components/UncontrolledLottie/UncontrolledLottie'

import routes from "routes.js";
// core components
import HeaderDefault from "components/Headers/HeaderDefault.js";
// mapTypeId={google.maps.MapTypeId.ROADMAP}

var firebase = require('firebase');

class Review extends React.Component {

  state = {
		tabs: 1
	  };
	  toggleNavs = (e, state, index) => {
		e.preventDefault();
		this.setState({
		  [state]: index
		});
	  };

  componentDidMount(){

    var colorArray = ['#E6EE9C', '#B6EDD8', '#FFCDD3', '#90CAF9', '#E1BEE7', '#A5D6A7', '#B3E2E3', '#BCAAA4', '#E0E0E0', '#FFAB00', '#64DD17', '#00B8D4', '#00BFA5']

    var filename = '';
    var docname = '';
    var Email = {
			send: function(a) {
				return new Promise(function(n, e) {
					// eslint-disable-next-line no-unused-expressions
					a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send";
					var t = JSON.stringify(a);
					Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function(e) {
						n(e)
					})
				})
			},
			ajaxPost: function(e, n, t) {
				var a = Email.createCORSRequest("POST", e);
				// eslint-disable-next-line no-unused-expressions
				a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function() {
					var e = a.responseText;
					null != t && t(e)
				}, a.send(n)
			},
			ajax: function(e, n) {
				var t = Email.createCORSRequest("GET", e);
				// eslint-disable-next-line no-unused-expressions
				t.onload = function() {
					var e = t.responseText;
					null != n && n(e)
				}, t.send()
			},
			createCORSRequest: function(e, n) {
				var t = new XMLHttpRequest();
				return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XMLHttpRequest()).open(e, n) : t = null, t
			}
		};

    var modal = document.querySelectorAll(".modal")
    modal[0].style.display = "block";
    var userid = "";
    var email='';
    var droptoggle = 0;
    firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {

        userid=user.uid;
        console.log(userid);
        try {
          var leadsRef = firebase.database().ref('Users/'+userid)
			console.log('found ref');
		leadsRef.on('value', function(snapshot) {
			var Child = snapshot.val();
        email = Child.UserEmail; 

        try {
          var mainurl = document.location.hash,
        params = mainurl.split('?')[1].split('&'),
        data = {}, tmp;
            for (var i = 0, l = params.length; i < l; i++) {
           tmp = params[i].split('=');
           data[tmp[0]] = tmp[1];
            }
         filename = data.id;
         docname = DataVar.DocName;
         
         console.log(userid);
         console.log(filename);

          var people=[];
          people = DataVar.RecepientArray;
          people.forEach(function(item, index) {
            var li = document.createElement('li');
            li.innerHTML=`<div>
            <div>
            <strong><span class="summarylabelspan" id="summary-recepient-name">`+people[index].name+`</span></strong>
            </div>
            <div>
            <span class="summarylabelspan" id="summary-recepient-name">`+people[index].email+`</span>
            </div>
            <div>
            <span class="summarylabelspan" id="summary-recepient-name">`+people[index].option+`</span>
            </div>
            </div>`;
            $( "#reviewrecepientstable" ).append(li);
          
        });
        modal[0].style.display = "none";


        } catch (error) {
          modal[0].style.display = "none";
        }
      
  });

        } catch (error) {
          modal[0].style.display = "none";
        }

    }
    else{
      
      window.location.hash = "#/auth/login";
      modal[0].style.display = "none";
      
    }
  });

    
   

 
 $( "#reviewnextbtn" ).click(function() {
  modal[1].style.display = "block";
  var url = 'https://pappayasign.surge.sh/#/admin/sign?id='+filename+'&type=db&u='+userid+''; 
  var today = new Date().toLocaleString().replace(",","");

  var subject = document.getElementById('input-email-subject').value;
	var emailmessage = document.getElementById('input-email-message').value;


  var people=[];
  people = DataVar.RecepientArray;
  if(DataVar.SignOrder === true){
    var firstRecepientEmail = people[0].email;
    var firstRecepientName = people[0].name;
    var ref = firebase.database().ref('Users/');
                ref.orderByChild('UserEmail').equalTo(people[0].email).on("value", function(snapshotchild) {
            console.log(snapshotchild);
            snapshotchild.forEach(function(datarecep){
            var data = datarecep.val();
            console.log(data);
            var useridData = data.UserID;
            firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('DocumentName').set(docname);
            firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('DocumentID').set(filename);
            firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('From').set(userid);
            firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('FromEmail').set(email);
            firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('RecipientDateStatus').set(today);
            firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('RecipientStatus').set('Need to Sign');
            });
            
          });
    Email.send({
      Host : "mail.pappaya.com",
      Username : "devsign@pappaya.com",
      Password : "Pappaya@2020",
      To : firstRecepientEmail,
      From : "devsign@pappaya.com",
      Subject : "PappayaSign: "+subject+"",
      Body : `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign Activation.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, `+firstRecepientName+`</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. <p>Personal Message: `+emailmessage+`</p></p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="`+url+`" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`
    }).then(
      message => {
        
      }
    );
    people.forEach(function(item, index) {
      var recepientName = people[index].name;
      var recepientEmail = people[index].email;
      var firstRecepientEmail = people[0].email;
      var recepientOption = people[index].option;
      var recepientColor = colorArray[index];
      if(recepientOption == 'Needs to Sign' || recepientOption == 'Needs to View'){
      console.log(recepientEmail + ',' + recepientName);
  
         
          
          
            firebase.database().ref(userid + '/Documents/'+filename+'/').child('Status').set('Waiting for Others');
            firebase.database().ref(userid + '/Documents/'+filename+'/').child('SignOrder').set(true);
            firebase.database().ref(userid + '/Documents/'+filename+'/').child('DateSent').set(today);
            firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientName').set(recepientName);
            firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('DocumentName').set(docname);
            firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientEmail').set(recepientEmail);
            firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientColor').set(recepientColor);
            firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientOption').set(recepientOption);
            firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientStatus').set('Sent');
            firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientDateStatus').set(today);
          
          
          }
    });
    modal[1].style.display = "none"
    window.location.hash = "#/admin/sendsuccess";
  }
  else{
	people.forEach(function(item, index) {
		var recepientName = people[index].name;
		var recepientEmail = people[index].email;
		var recepientOption = people[index].option;
		var recepientColor = colorArray[index];
		if(recepientOption == 'Needs to Sign' || recepientOption == 'Needs to View'){
		console.log(recepientEmail + ',' + recepientName);

			var ref = firebase.database().ref('Users/');
              ref.orderByChild('UserEmail').equalTo(recepientEmail).on("value", function(snapshotchild) {
				  console.log(snapshotchild);
				  snapshotchild.forEach(function(datarecep){
					var data = datarecep.val();
					console.log(data);
					var useridData = data.UserID;
					firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('DocumentName').set(docname);
					firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('DocumentID').set(filename);
					firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('From').set(userid);
					firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('FromEmail').set(email);
					firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('RecipientDateStatus').set(today);
					firebase.database().ref('Users/'+useridData+'/Requests/'+filename).child('RecipientStatus').set('Need to Sign');
				  });
					
			  });

				Email.send({
					Host : "mail.pappaya.com",
					Username : "devsign@pappaya.com",
					Password : "Pappaya@2020",
					To : recepientEmail,
					From : "devsign@pappaya.com",
					Subject : "PappayaSign: "+subject+"",
					Body : `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign Activation.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, `+recepientName+`</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. <p>Personal Message: `+emailmessage+`</p></p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="`+url+`" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`
				}).then(
				  message => {
					  
					}
        );
        
          firebase.database().ref(userid + '/Documents/'+filename+'/').child('Status').set('Waiting for Others');
          firebase.database().ref(userid + '/Documents/'+filename+'/').child('DateSent').set(today);
          firebase.database().ref(userid + '/Documents/'+filename+'/').child('SignOrder').set(false);
          firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientName').set(recepientName);
          firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('DocumentName').set(docname);
          firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientEmail').set(recepientEmail);
          firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientColor').set(recepientColor);
          firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientOption').set(recepientOption);
          firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientStatus').set('Sent');
          firebase.database().ref(userid + '/Documents/'+filename+'/Reciever/'+index).child('RecepientDateStatus').set(today);
			  
			  
				}
  });
  modal[1].style.display = "none"
  window.location.hash = "#/admin/sendsuccess";
  }   
  
  
});

  }
  render() {
    return (
      <>
          <HeaderDefault />
          {/* Page content */}
        <Container className="mt--9 pb-8">
        <Card className="shadow border-0 pb-2 mb-3 bg-dark">
              <CardBody>
                <Row>
              <Col lg="12" className="form-check form-check-inline">
              <div className="stepwizard">
              <div className="stepwizard-row">
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">1</button>
                      <p className="steplabel">Add</p>
                  </div>
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">2</button>
                      <p className="steplabel">Select</p>
                  </div>
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">3</button>
                      <p className="steplabel">Process</p>
                  </div> 
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">4</button>
                      <p className="steplabel">Review</p>
                  </div> 
              </div>
          </div>
              </Col>
              </Row>
              </CardBody>
              </Card>
        <div className="modal">
        <div className="modal-content">
          <div><p>Please wait while we fetch your details.</p><div className="lds-dual-ring"></div></div>
        
        </div>
      </div>

      <div className="modal">
        <div className="modal-content">
          <div><p>Sending.</p><div className="lds-dual-ring"></div></div>
        
        </div>
      </div>

      <div className="modal">
        <div className="modal-content">
          <div><p>Please wait.</p><div className="lds-dual-ring"></div></div>
        
        </div>
      </div>
        
          <Row>
            <div className="col  pb-2">
              <Card className="shadow border-0">
              <CardHeader className=" bg-transparent">
                  <h3>Review and Send!</h3>
                </CardHeader>
                <CardBody> 
                <Row>
                  <Col lg="6" className="">
                <Col lg="12">
                <h4 className="py-3">Message to Recepients!</h4>
                <FormGroup>
                  <span className="emaillabelspan"><strong>Email Subject*</strong></span>
                  <Input
                    id="input-email-subject"
                    placeholder="Email Subject"
                    type="text"
                  />
                  <span className="emaillabelspan">Max Characters: 100</span>
                  </FormGroup>
                  </Col>
                  <Col lg="12">
                  <FormGroup className="">
                  <span className="emaillabelspan"><strong>Email Body*</strong></span>
                  <Input
                          id="input-email-message"
                          placeholder="Enter message here ..."
                          rows="3"
                          type="textarea"
                        />
                  <span className="emaillabelspan">Max Characters: 10000</span>
                  </FormGroup>
                  </Col>
                  </Col>
                  <Col lg="6" className="reviewcontainer">
	 
	 <div className="nav-wrapper">
          <Nav
            className="nav-fill flex-column flex-md-row"
            id="tabs-icons-text"
            pills
            role="tablist"
          >
            <NavItem>
              <NavLink
                aria-selected={this.state.tabs === 1}
                className={classnames("mb-sm-1 mb-md-0", {
                  active: this.state.tabs === 1
                })}
                onClick={e => this.toggleNavs(e, "tabs", 1)}
                href="#pablo"
                role="tab"
              >
                Summary
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                aria-selected={this.state.tabs === 2}
                className={classnames("mb-sm-1 mb-md-0", {
                  active: this.state.tabs === 2
                })}
                onClick={e => this.toggleNavs(e, "tabs", 2)}
                href="#pablo"
                role="tab"
              >
                
                Options
              </NavLink>
            </NavItem>
          </Nav>
          <hr className="my-3" />
        </div>
            <TabContent activeTab={"tabs" + this.state.tabs} id="tabcontent">
              <TabPane tabId="tabs1">
                <Row>
                  <Col lg="12" className="pb-3">
                  <strong><span className="summarylabelspan py-2"><strong>Documents:</strong></span></strong>
                  <span className="summarylabelspan">docname</span>
                  <hr className="my-3" />
                  <strong><span className="summarylabelspan py-2"><strong>Recepients:</strong></span></strong>
                  
                  </Col>
                  <Col lg="12">
                  <div className="reviewrecepientstable">
                  <ul id="reviewrecepientstable">
                  
                    </ul> 
                  </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="tabs2">
			  
              </TabPane>
            </TabContent>
                  </Col>
                  </Row>
                
                </CardBody>
                <CardFooter>
                  <Row>
                  <Col lg="12">
                    <Button className="float-right px-4" color="primary" id="reviewnextbtn">Next</Button>
                    </Col>
                  </Row>
                </CardFooter>
                
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Review;
