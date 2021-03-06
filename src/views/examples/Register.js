import React from "react";
import { Link, NavLink } from "react-router-dom";
import $ from 'jquery';


import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  NavItem,
  Nav,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";


var firebase = require('firebase');


class Register extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.verifyCallbackRegister = this.verifyCallbackRegister.bind(this);
  }


verifyCallbackRegister(recaptchaToken) {
  // Here you will get the final recaptchaToken!!!  
  console.log('disabled');
  try {
    document.getElementById('registerfinishbtn').style.visibility = "visible";
  document.getElementById('modal2errorspan').innerHTML = "";
  } catch (error) {
    
  }
  

}


  componentDidMount() {

    try {
      var mainurl = document.location.hash,
    params = mainurl.split('?')[1].split('&'),
    data = {}, tmp;
        for (var i = 0, l = params.length; i < l; i++) {
       tmp = params[i].split('=');
       data[tmp[0]] = tmp[1];
        }
     var filename = data.id;
     var fileid= data.id;
     var type = data.type;
     var useridother = data.u;
     console.log(type);
     console.log(useridother);
     firebase.database().ref('Users/'+useridother).child('UserActivated').set(true);
     window.location.hash = "#/admin/login";
    } catch (error) {
      
    }


    
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



var randomString = function (len, bits)
{
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len)
    {
        newStr = Math.random().toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
};

var random = randomString(7);


    var modal = document.querySelectorAll(".modal")
    //modal[1].style.display = "block";
    document.getElementById('registerfinishbtn').style.visibility = "hidden";
    document.getElementById('modal2errorspan').innerHTML = "Please wait while we verify captha.";

    window.onclick = function(e){
      if(e.target == modal[0] || e.target == modal[1]){
      modal[0].style.display = "none";
      modal[1].style.display = "none";
      }
    }

    var registerbtn = document.getElementById('registerbtn');
    registerbtn.addEventListener('click', function(event) {

      var registeremail = document.getElementById('registeremail').value;
		var registerpassword = document.getElementById('registerpassword').value;
		var reregisterpassword = document.getElementById('reregisterpassword').value;
		var registerfirstname = document.getElementById('registerfirstname').value;
		var registerlastname = document.getElementById('registerlastname').value;
		var registertitle = document.getElementById('registertitle').value;
    var registernumber = document.getElementById('registernumber').value;
    var industryselect = document.getElementById('industryselect');
    var industryselectval = industryselect.options[industryselect.selectedIndex].value;

    var countryselect = document.getElementById('countryselect');
    var countryselectval = countryselect.options[countryselect.selectedIndex].value;
    

      if (registeremail.length > 4) {
        if(registerfirstname == '' || registerlastname == '' || registernumber == '' || registertitle == '' || industryselectval == '' || countryselectval == ''){
            //alert('Please fill all the details.');
            document.getElementById('mainerrorspan').innerHTML = "Please fill all the details";
        }
        else{
          modal[0].style.display = "block";
          document.getElementById('mainerrorspan').innerHTML = "";
        }
      }
      else{
             //alert('Please enter a valid email address.');
            document.getElementById('mainerrorspan').innerHTML = "Please enter a valid email address.";
      }




 });
    
 
 var registersecondbtn = document.getElementById('registersecondbtn');
 registersecondbtn.addEventListener('click', function(event) {

  var company = document.getElementById('registercompany').value;

  var companysizeselect = document.getElementById('companysizeselect');
  var companysizeselectval = companysizeselect.options[companysizeselect.selectedIndex].value;

  var reasonselect = document.getElementById('reasonselect');
  var reasonselectval = reasonselect.options[reasonselect.selectedIndex].value;

  var thirdpartyselect = document.getElementById('thirdpartyselect');
  var thirdpartyselectval = thirdpartyselect.options[thirdpartyselect.selectedIndex].value;
  var registeremail = document.getElementById('registeremail').value;
  var registername = document.getElementById('registerfirstname').value;

  if(companysizeselect == '' || company == '' || thirdpartyselectval == '' || reasonselectval == ''){
    //alert('please fill in all the details');
    document.getElementById('modal1errorspan').innerHTML = "please fill in all the details.";
  }
  else{
    document.getElementById('modal1errorspan').innerHTML = "please wait.";
    modal[0].style.display = "none";
    modal[1].style.display = "block";
    
  }

 });



 var registerfinishbtn = document.getElementById('registerfinishbtn');
 registerfinishbtn.addEventListener('click', function(event) {

  var password = document.getElementById('registerpassword').value;
	var repassword = document.getElementById('reregisterpassword').value;
	var registerquestionanswer = document.getElementById('registerquestionanswer').value;

  var questionselect = document.getElementById('questionselect');
  var questionselectval = questionselect.options[questionselect.selectedIndex].value;
 

  if(repassword == '' || password == '' || registerquestionanswer == ''){
    //alert('please fill in all the details');
    document.getElementById('modal2errorspan').innerHTML = "please fill in all the details.";
  }
  else{
    if(password == repassword){
      register();
    }
    else{
      document.getElementById('modal2errorspan').innerHTML = "password dont match.";
    }
    
    
  }

 });
	
	  
function register() {
	var registeremail = document.getElementById('registeremail').value;
		var registerpassword = document.getElementById('registerpassword').value;
		var reregisterpassword = document.getElementById('reregisterpassword').value;
		var registerfirstname = document.getElementById('registerfirstname').value;
		var registerlastname = document.getElementById('registerlastname').value;
		var registertitle = document.getElementById('registertitle').value;
    var registernumber = document.getElementById('registernumber').value;
    var industryselect = document.getElementById('industryselect');
    var industryselectval = industryselect.options[industryselect.selectedIndex].value;

    var countryselect = document.getElementById('countryselect');
    var countryselectval = countryselect.options[countryselect.selectedIndex].value;

    var company = document.getElementById('registercompany').value;

  var companysizeselect = document.getElementById('companysizeselect');
  var companysizeselectval = companysizeselect.options[companysizeselect.selectedIndex].value;

  var reasonselect = document.getElementById('reasonselect');
  var reasonselectval = reasonselect.options[reasonselect.selectedIndex].value;

  var thirdpartyselect = document.getElementById('thirdpartyselect');
  var thirdpartyselectval = thirdpartyselect.options[thirdpartyselect.selectedIndex].value;

  var password = document.getElementById('registerpassword').value;
	var repassword = document.getElementById('reregisterpassword').value;
	var registerquestionanswer = document.getElementById('registerquestionanswer').value;

  var questionselect = document.getElementById('questionselect');
  var questionselectval = questionselect.options[questionselect.selectedIndex].value;
  

    document.getElementById('modal2errorspan').innerHTML = "Please wait.";
  firebase.auth().createUserWithEmailAndPassword(registeremail, registerpassword).then(function(user) {
    var user = firebase.auth().currentUser;
    logUser(user); // Optional
}, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      document.getElementById('modal2errorspan').innerHTML = "password is too weak";
} else {
  //alert(errorMessage);
  document.getElementById('modal2errorspan').innerHTML = errorMessage;
}
console.log(error);
});
}


function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}



function logUser(user) {
  console.log("User Registered");
  var registeremail = document.getElementById('registeremail').value;
  var registerpassword = document.getElementById('registerpassword').value;
  var reregisterpassword = document.getElementById('reregisterpassword').value;
  var registerfirstname = document.getElementById('registerfirstname').value;
  var registerlastname = document.getElementById('registerlastname').value;
  var registertitle = document.getElementById('registertitle').value;
  var registernumber = document.getElementById('registernumber').value;
  var industryselect = document.getElementById('industryselect');
  var industryselectval = industryselect.options[industryselect.selectedIndex].value;

  var countryselect = document.getElementById('countryselect');
  var countryselectval = countryselect.options[countryselect.selectedIndex].value;

  var company = document.getElementById('registercompany').value;

var companysizeselect = document.getElementById('companysizeselect');
var companysizeselectval = companysizeselect.options[companysizeselect.selectedIndex].value;

var reasonselect = document.getElementById('reasonselect');
var reasonselectval = reasonselect.options[reasonselect.selectedIndex].value;

var thirdpartyselect = document.getElementById('thirdpartyselect');
var thirdpartyselectval = thirdpartyselect.options[thirdpartyselect.selectedIndex].value;

var password = document.getElementById('registerpassword').value;
var repassword = document.getElementById('reregisterpassword').value;
var registerquestionanswer = document.getElementById('registerquestionanswer').value;

var questionselect = document.getElementById('questionselect');
var questionselectval = questionselect.options[questionselect.selectedIndex].value;

setCookie('uid',user.uid, 1);
 console.log(user.uid)
 firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var userid = user.uid;
    firebase.database().ref('Users/'+userid).child('UserID').set(userid);
    firebase.database().ref('Users/'+userid).child('UserEmail').set(registeremail);
    firebase.database().ref('Users/'+userid).child('UserFirstName').set(registerfirstname);
    firebase.database().ref('Users/'+userid).child('UserLastName').set(registerlastname);
    firebase.database().ref('Users/'+userid).child('UserTitle').set(registertitle);
    firebase.database().ref('Users/'+userid).child('UserCompany').set(company);
    firebase.database().ref('Users/'+userid).child('UserIndustry').set(industryselectval);
    firebase.database().ref('Users/'+userid).child('UserCountry').set(countryselectval);
    firebase.database().ref('Users/'+userid).child('UserReason').set(reasonselectval);
    firebase.database().ref('Users/'+userid).child('UserThirdPartyIntegration').set(thirdpartyselectval);
    firebase.database().ref('Users/'+userid).child('UserSecurityQuestion').set(registerquestionanswer);
    firebase.database().ref('Users/'+userid).child('UserSecurityAnswer').set(questionselectval);
    firebase.database().ref('Users/'+userid).child('UserActivated').set(false);
    console.log('User Details Added');
    Email.send({
      Host : "mail.pappaya.com",
      Username : "devsign@pappaya.com",
      Password : "Pappaya@2020",
      To : registeremail,
      From : "devsign@pappaya.com",
      Subject : "PappayaSign: Activation",
      Body : `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Activation</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign Activation.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Welcome to PappayaSign, `+registerfirstname+`</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We are just a few steps away from activating your account. Click the link below to activate your account.</p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="http://pappayasign.surge.sh/#/auth/register?activatelink=86hjw4ius&type=mail&u=`+userid+`" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border: solid 1px #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Activate Account</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`
    }).then(
      message => {
        alert('An activation link is sent to your email, activate your account and login again to continue.');
        window.location.hash = "#/auth/login";
      }
    );
    
    
  }
});
$('#load').fadeOut('slow'); // or however you wish to update the node
}



  }

  render() {
    return (
      <>
        <Col lg="7" md="8" className="p-2 pb-8">
          <Card className="bg-secondary shadow border-0 pb-2">
            
            <CardBody className="px-lg-3 py-lg-3">
              <div className="text-center text-muted mb-3 mt-2">
                <span>Sign up with credentials</span>
              </div>
              <Form role="form">
                <Row className="px-2">
              <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="registerfirstname" placeholder="First Name" type="text"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="registerlastname" placeholder="Last Name" type="text"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <Row className="px-2">
              <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-mobile-button" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="registernumber" placeholder="Number" type="text"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="registeremail" placeholder="Email" type="email" autoComplete="new-email"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <Row className="px-2">
                <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-briefcase-24" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="registertitle" placeholder="Job Title" type="text"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-folder-17" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <select id="industryselect" className="form-control  form-control-md" >
                      <option value="">Industry</option>
                      <option value="accounting">Accounting and Tax</option>
                      <option value="business">Business Services / Consulting</option>
                      <option value="construction">Construction</option>
                      <option value="education">Education</option>
                      <option value="financial">Financial Services</option>
                      <option value="government">Government</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="insurance">Insurance</option>
                      <option value="legal">Legal</option>
                      <option value="life science">Life Sciences</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="mortgage">Mortgage</option>
                      <option value="nonprofit">Not for Profit</option>
                      <option value="real estate commercial">Real Estate - Commercial</option>
                      <option value="real estate residential">Real Estate - Residential</option>
                      <option value="retail">Retail</option>
                      <option value="student">Student</option>
                      <option value="technology">Technology</option>
                      <option value="other">Other</option>
                    </select>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <Row className="px-2">
                <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-world" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <select id="countryselect" className="form-control  form-control-md" >
                      <option value="">Country</option>
                      <option value="AFG">Afghanistan</option>
                      <option value="ALA">Åland Islands</option>
                      <option value="ALB">Albania</option>
                      <option value="DZA">Algeria</option>
                      <option value="ASM">American Samoa</option>
                      <option value="AND">Andorra</option>
                      <option value="AGO">Angola</option>
                      <option value="AIA">Anguilla</option>
                      <option value="ATA">Antarctica</option>
                      <option value="ATG">Antigua and Barbuda</option>
                      <option value="ARG">Argentina</option>
                      <option value="ARM">Armenia</option>
                      <option value="ABW">Aruba</option>
                      <option value="AUS">Australia</option>
                      <option value="AUT">Austria</option>
                      <option value="AZE">Azerbaijan</option>
                      <option value="BHS">Bahamas</option>
                      <option value="BHR">Bahrain</option>
                      <option value="BGD">Bangladesh</option>
                      <option value="BRB">Barbados</option>
                      <option value="BLR">Belarus</option>
                      <option value="BEL">Belgium</option>
                      <option value="BLZ">Belize</option>
                      <option value="BEN">Benin</option>
                      <option value="BMU">Bermuda</option>
                      <option value="BTN">Bhutan</option>
                      <option value="BOL">Bolivia, Plurinational State of</option>
                      <option value="BES">Bonaire, Sint Eustatius and Saba</option>
                      <option value="BIH">Bosnia and Herzegovina</option>
                      <option value="BWA">Botswana</option>
                      <option value="BVT">Bouvet Island</option>
                      <option value="BRA">Brazil</option>
                      <option value="IOT">British Indian Ocean Territory</option>
                      <option value="BRN">Brunei Darussalam</option>
                      <option value="BGR">Bulgaria</option>
                      <option value="BFA">Burkina Faso</option>
                      <option value="BDI">Burundi</option>
                      <option value="KHM">Cambodia</option>
                      <option value="CMR">Cameroon</option>
                      <option value="CAN">Canada</option>
                      <option value="CPV">Cape Verde</option>
                      <option value="CYM">Cayman Islands</option>
                      <option value="CAF">Central African Republic</option>
                      <option value="TCD">Chad</option>
                      <option value="CHL">Chile</option>
                      <option value="CHN">China</option>
                      <option value="CXR">Christmas Island</option>
                      <option value="CCK">Cocos (Keeling) Islands</option>
                      <option value="COL">Colombia</option>
                      <option value="COM">Comoros</option>
                      <option value="COG">Congo</option>
                      <option value="COD">Congo, the Democratic Republic of the</option>
                      <option value="COK">Cook Islands</option>
                      <option value="CRI">Costa Rica</option>
                      <option value="CIV">Côte d'Ivoire</option>
                      <option value="HRV">Croatia</option>
                      <option value="CUB">Cuba</option>
                      <option value="CUW">Curaçao</option>
                      <option value="CYP">Cyprus</option>
                      <option value="CZE">Czech Republic</option>
                      <option value="DNK">Denmark</option>
                      <option value="DJI">Djibouti</option>
                      <option value="DMA">Dominica</option>
                      <option value="DOM">Dominican Republic</option>
                      <option value="ECU">Ecuador</option>
                      <option value="EGY">Egypt</option>
                      <option value="SLV">El Salvador</option>
                      <option value="GNQ">Equatorial Guinea</option>
                      <option value="ERI">Eritrea</option>
                      <option value="EST">Estonia</option>
                      <option value="ETH">Ethiopia</option>
                      <option value="FLK">Falkland Islands (Malvinas)</option>
                      <option value="FRO">Faroe Islands</option>
                      <option value="FJI">Fiji</option>
                      <option value="FIN">Finland</option>
                      <option value="FRA">France</option>
                      <option value="GUF">French Guiana</option>
                      <option value="PYF">French Polynesia</option>
                      <option value="ATF">French Southern Territories</option>
                      <option value="GAB">Gabon</option>
                      <option value="GMB">Gambia</option>
                      <option value="GEO">Georgia</option>
                      <option value="DEU">Germany</option>
                      <option value="GHA">Ghana</option>
                      <option value="GIB">Gibraltar</option>
                      <option value="GRC">Greece</option>
                      <option value="GRL">Greenland</option>
                      <option value="GRD">Grenada</option>
                      <option value="GLP">Guadeloupe</option>
                      <option value="GUM">Guam</option>
                      <option value="GTM">Guatemala</option>
                      <option value="GGY">Guernsey</option>
                      <option value="GIN">Guinea</option>
                      <option value="GNB">Guinea-Bissau</option>
                      <option value="GUY">Guyana</option>
                      <option value="HTI">Haiti</option>
                      <option value="HMD">Heard Island and McDonald Islands</option>
                      <option value="VAT">Holy See (Vatican City State)</option>
                      <option value="HND">Honduras</option>
                      <option value="HKG">Hong Kong</option>
                      <option value="HUN">Hungary</option>
                      <option value="ISL">Iceland</option>
                      <option value="IND">India</option>
                      <option value="IDN">Indonesia</option>
                      <option value="IRN">Iran, Islamic Republic of</option>
                      <option value="IRQ">Iraq</option>
                      <option value="IRL">Ireland</option>
                      <option value="IMN">Isle of Man</option>
                      <option value="ISR">Israel</option>
                      <option value="ITA">Italy</option>
                      <option value="JAM">Jamaica</option>
                      <option value="JPN">Japan</option>
                      <option value="JEY">Jersey</option>
                      <option value="JOR">Jordan</option>
                      <option value="KAZ">Kazakhstan</option>
                      <option value="KEN">Kenya</option>
                      <option value="KIR">Kiribati</option>
                      <option value="PRK">Korea, Democratic People's Republic of</option>
                      <option value="KOR">Korea, Republic of</option>
                      <option value="KWT">Kuwait</option>
                      <option value="KGZ">Kyrgyzstan</option>
                      <option value="LAO">Lao People's Democratic Republic</option>
                      <option value="LVA">Latvia</option>
                      <option value="LBN">Lebanon</option>
                      <option value="LSO">Lesotho</option>
                      <option value="LBR">Liberia</option>
                      <option value="LBY">Libya</option>
                      <option value="LIE">Liechtenstein</option>
                      <option value="LTU">Lithuania</option>
                      <option value="LUX">Luxembourg</option>
                      <option value="MAC">Macao</option>
                      <option value="MKD">Macedonia, the former Yugoslav Republic of</option>
                      <option value="MDG">Madagascar</option>
                      <option value="MWI">Malawi</option>
                      <option value="MYS">Malaysia</option>
                      <option value="MDV">Maldives</option>
                      <option value="MLI">Mali</option>
                      <option value="MLT">Malta</option>
                      <option value="MHL">Marshall Islands</option>
                      <option value="MTQ">Martinique</option>
                      <option value="MRT">Mauritania</option>
                      <option value="MUS">Mauritius</option>
                      <option value="MYT">Mayotte</option>
                      <option value="MEX">Mexico</option>
                      <option value="FSM">Micronesia, Federated States of</option>
                      <option value="MDA">Moldova, Republic of</option>
                      <option value="MCO">Monaco</option>
                      <option value="MNG">Mongolia</option>
                      <option value="MNE">Montenegro</option>
                      <option value="MSR">Montserrat</option>
                      <option value="MAR">Morocco</option>
                      <option value="MOZ">Mozambique</option>
                      <option value="MMR">Myanmar</option>
                      <option value="NAM">Namibia</option>
                      <option value="NRU">Nauru</option>
                      <option value="NPL">Nepal</option>
                      <option value="NLD">Netherlands</option>
                      <option value="NCL">New Caledonia</option>
                      <option value="NZL">New Zealand</option>
                      <option value="NIC">Nicaragua</option>
                      <option value="NER">Niger</option>
                      <option value="NGA">Nigeria</option>
                      <option value="NIU">Niue</option>
                      <option value="NFK">Norfolk Island</option>
                      <option value="MNP">Northern Mariana Islands</option>
                      <option value="NOR">Norway</option>
                      <option value="OMN">Oman</option>
                      <option value="PAK">Pakistan</option>
                      <option value="PLW">Palau</option>
                      <option value="PSE">Palestinian Territory, Occupied</option>
                      <option value="PAN">Panama</option>
                      <option value="PNG">Papua New Guinea</option>
                      <option value="PRY">Paraguay</option>
                      <option value="PER">Peru</option>
                      <option value="PHL">Philippines</option>
                      <option value="PCN">Pitcairn</option>
                      <option value="POL">Poland</option>
                      <option value="PRT">Portugal</option>
                      <option value="PRI">Puerto Rico</option>
                      <option value="QAT">Qatar</option>
                      <option value="REU">Réunion</option>
                      <option value="ROU">Romania</option>
                      <option value="RUS">Russian Federation</option>
                      <option value="RWA">Rwanda</option>
                      <option value="BLM">Saint Barthélemy</option>
                      <option value="SHN">Saint Helena, Ascension and Tristan da Cunha</option>
                      <option value="KNA">Saint Kitts and Nevis</option>
                      <option value="LCA">Saint Lucia</option>
                      <option value="MAF">Saint Martin (French part)</option>
                      <option value="SPM">Saint Pierre and Miquelon</option>
                      <option value="VCT">Saint Vincent and the Grenadines</option>
                      <option value="WSM">Samoa</option>
                      <option value="SMR">San Marino</option>
                      <option value="STP">Sao Tome and Principe</option>
                      <option value="SAU">Saudi Arabia</option>
                      <option value="SEN">Senegal</option>
                      <option value="SRB">Serbia</option>
                      <option value="SYC">Seychelles</option>
                      <option value="SLE">Sierra Leone</option>
                      <option value="SGP">Singapore</option>
                      <option value="SXM">Sint Maarten (Dutch part)</option>
                      <option value="SVK">Slovakia</option>
                      <option value="SVN">Slovenia</option>
                      <option value="SLB">Solomon Islands</option>
                      <option value="SOM">Somalia</option>
                      <option value="ZAF">South Africa</option>
                      <option value="SGS">South Georgia and the South Sandwich Islands</option>
                      <option value="SSD">South Sudan</option>
                      <option value="ESP">Spain</option>
                      <option value="LKA">Sri Lanka</option>
                      <option value="SDN">Sudan</option>
                      <option value="SUR">Suriname</option>
                      <option value="SJM">Svalbard and Jan Mayen</option>
                      <option value="SWZ">Swaziland</option>
                      <option value="SWE">Sweden</option>
                      <option value="CHE">Switzerland</option>
                      <option value="SYR">Syrian Arab Republic</option>
                      <option value="TWN">Taiwan, Province of China</option>
                      <option value="TJK">Tajikistan</option>
                      <option value="TZA">Tanzania, United Republic of</option>
                      <option value="THA">Thailand</option>
                      <option value="TLS">Timor-Leste</option>
                      <option value="TGO">Togo</option>
                      <option value="TKL">Tokelau</option>
                      <option value="TON">Tonga</option>
                      <option value="TTO">Trinidad and Tobago</option>
                      <option value="TUN">Tunisia</option>
                      <option value="TUR">Turkey</option>
                      <option value="TKM">Turkmenistan</option>
                      <option value="TCA">Turks and Caicos Islands</option>
                      <option value="TUV">Tuvalu</option>
                      <option value="UGA">Uganda</option>
                      <option value="UKR">Ukraine</option>
                      <option value="ARE">United Arab Emirates</option>
                      <option value="GBR">United Kingdom</option>
                      <option value="USA">United States</option>
                      <option value="UMI">United States Minor Outlying Islands</option>
                      <option value="URY">Uruguay</option>
                      <option value="UZB">Uzbekistan</option>
                      <option value="VUT">Vanuatu</option>
                      <option value="VEN">Venezuela, Bolivarian Republic of</option>
                      <option value="VNM">Viet Nam</option>
                      <option value="VGB">Virgin Islands, British</option>
                      <option value="VIR">Virgin Islands, U.S.</option>
                      <option value="WLF">Wallis and Futuna</option>
                      <option value="ESH">Western Sahara</option>
                      <option value="YEM">Yemen</option>
                      <option value="ZMB">Zambia</option>
                      <option value="ZWE">Zimbabwe</option>
                    </select>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <div className="text-muted font-italic">
                  <small>
                    <span id="mainerrorspan"  className="text-error font-weight-700"></span>
                  </small>
                </div>
                <Row className="my-3">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      
                        <span className="text-muted">
                        By clicking the 'Get Started' button below, you agree to the{" "}
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                          Terms & Conditions and Privacy Policy.
                          </a>
                        </span>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button id="registerbtn" className="mt-3 px-3" color="primary" type="button">
                    Get Started
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        <Row>
          
        


          <Col xs="6 py-2">
          
          </Col>
          <Col className="text-right py-2" xs="6">
          <Nav className="justify-content-end" pills>
                      
                      <NavItem>
                        <NavLink className="py-2 px-1"   to="/auth/login" tag={Link}>
                          <Button
                          color="neutral"
                          >
                          <span className="d-none d-md-block text-gray">Already Have an Account? Sign In</span>
                          <span className="d-md-none text-gray">Sign In</span>
                          </Button>
                          
                        </NavLink>
                      </NavItem>
                    </Nav>
          </Col>
          
        </Row>
            </Col>




            <div className="modal">
        <div className="modal-content">
            
            <CardBody className="px-lg-3 py-lg-3">
              <div className="text-center text-muted mb-3 mt-2">
                <span>This information will help personalize your experience</span>
              </div>
              <Form role="form">
                <Row className="px-2">
              <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-building" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="registercompany" placeholder="Company" type="text"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-badge" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <select id="companysizeselect" className="form-control  form-control-md" >
                      <option value="">Company Size</option>
                      <option value="0-5">0-5 employees</option>
                      <option value="6-50">6-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-2000">201-2000 employees</option>
                      <option value="2001">2001+ employees</option>
                    </select>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <Row className="px-2">
                <div className="text-left text-muted mb-3 mt-2 px-3">
                <span>I'm trying to use Pappayasign because?</span>
              </div>
              <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-chart-bar-32" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <select id="reasonselect" className="form-control  form-control-md" >
                      <option value="">Select One</option>
                      <option value="business">I'm evaluating it for my business.</option>
                      <option value="personal">I'm evaluating it for my personal Use.</option>
                      <option value="developer">I'm a Developer</option>
                      <option value="general">I just need to sign a document today.</option>
                    </select>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <Row className="px-2">
                <div className="text-left text-muted mb-3 mt-2 px-3">
                <span>Need 3rd party integration? (CRM, ERP, etc)</span>
              </div>
              <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-settings" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <select id="thirdpartyselect" className="form-control  form-control-md" >
                      <option value="">Select One</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="notsure">I'm not sure</option>
                    </select>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <div className="text-muted font-italic">
                  <small>
                    <span id="modal1errorspan"  className="text-warning font-weight-700"></span>
                  </small>
                </div>
                <Row className="my-3">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        defaultChecked
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                        I agree to receive marketing communications and promotional offers from Pappayasign
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button id="registersecondbtn" className="mt-3 px-3" color="primary" type="button">
                    Next
                  </Button>
                </div>
              </Form>
            </CardBody>
        
        </div>
      </div>







      <div className="modal">
        <div className="modal-content">
            
            <CardBody className="px-lg-3 py-lg-3">
              <Form role="form">
              <Row className="px-2">
              <div className="text-left text-muted mb-3 mt-2 px-3">
                <span>Please enter your password and security question to continue.</span>
              </div>
               
                </Row>
                <Row className="px-2">
              <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="registerpassword" placeholder="Password" type="password" />
                  </InputGroup>
                </FormGroup>
                </Col>
                <Col lg="6" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="reregisterpassword" placeholder="Confirm Password" type="password" />
                  </InputGroup>
                  
                </FormGroup>
                </Col>
                </Row>
                <Row className="px-2">
                <div className="text-center text-muted mb-3 mt-2 px-2">
                <span>Select a security question?</span>
              </div>
                <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-air-baloon" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <select id="questionselect" className="form-control  form-control-md" >
                      <option value="">Select One</option>
                      <option value="pet">What was the name of your first pet?</option>
                      <option value="company">What was the first company that you worked for?</option>
                      <option value="school">Where did you go to high school/college?</option>
                      <option value="book">What Is your favorite book?</option>
                    </select>
                  </InputGroup>
                </FormGroup>
                </Col>
                <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-air-baloon" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="registerquestionanswer" placeholder="Answer" />
                  </InputGroup>
                  
                </FormGroup>
                </Col>
                </Row>
                <div className="text-muted font-italic">
                  <small>
                    <span id="modal2errorspan" className="text-warning font-weight-700"></span>
                  </small>
                </div>
                
        <GoogleReCaptchaProvider reCaptchaKey="6LcPcuwUAAAAAL2ebX2lgNSUH8uzqnMDXFTr06wT">
    <GoogleReCaptcha onVerify={this.verifyCallbackRegister} />
  </GoogleReCaptchaProvider>
                <div className="text-center">
                  <Button id="registerfinishbtn" className="mt-3 px-3" color="primary" type="button">
                    Finish
                  </Button>
                </div>
              </Form>
            </CardBody>
        
        </div>
      </div>
      </>
    );
  }
}

export default Register;
