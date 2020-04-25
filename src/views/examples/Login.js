
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
  Nav,
  NavItem,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

var firebase = require('firebase');
var app = firebase.initializeApp({
apiKey: "AIzaSyCQCOnRw9BS26_fO-VumQHIVxUOZTfDI14",
authDomain: "connectmessenger-66b24.firebaseapp.com",
databaseURL: "https://connectmessenger-66b24.firebaseio.com",
projectId: "connectmessenger-66b24",
storageBucket: "connectmessenger-66b24.appspot.com",
messagingSenderId: "360288484526",
appId: "1:360288484526:web:c7d430cf2524023fea813f"
});

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.verifyCallback = this.verifyCallback.bind(this);
  }



verifyCallback(recaptchaToken) {
  // Here you will get the final recaptchaToken!!!  
  try {
  document.getElementById('loginerrorspan').innerHTML = "";
  } catch (error) {
    
  }
  
}

  componentDidMount() { 

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
    //modal[0].style.display = "block";

    window.onclick = function(e){
      if(e.target == modal[0] ){
      modal[0].style.display = "none";
      }
    }

    document.getElementById('loginerrorspan').innerHTML = "Please wait while we verify captha.";

    var loginemail = document.getElementById('loginemail')
		var loginpassword = document.getElementById('loginpassword')
    var loginbtn = document.getElementById('loginbtn')
    loginbtn.addEventListener('click', function(event) {
      signin();
 });

    window.onload = function() {
			document.getElementById('loginemail').value='';
			document.getElementById('loginpassword').value='';
			
		}
		
	if(loginemail){
	    loginemail.addEventListener("keyup", function(e) {
	      e.preventDefault();
	      if (e.keyCode == 13) {
		loginbtn.click();
	      }
	    });
	  }
	  
	if(loginpassword){
	    loginpassword.addEventListener("keyup", function(e) {
	      e.preventDefault();
	      if (e.keyCode == 13) {
		loginbtn.click();
	      }
	    });
    }



    var forgotpasswordbtn = document.getElementById('forgotpasswordbtn');
    forgotpasswordbtn.addEventListener('click', function(event) {
      modal[0].style.display = "block";
    });

    var forgotbtnnext = document.getElementById('forgotbtnnext')
    function alertFunc(){
      modal[0].style.display = "none";
    }

    forgotbtnnext.addEventListener('click', function(event) {
      var forgotemail = document.getElementById('forgotemail').value;
      if(forgotemail == ''){
        document.getElementById('forgot1errorspan').innerHTML = "Please enter an email address.";
      }
      else{
        firebase.auth().sendPasswordResetEmail(forgotemail).then(function() {
          // Email sent.
          console.log('Email Sent');
          document.getElementById('forgot1errorspan').innerHTML = "Passowrd reset link has been sent to your email address.";
          var timer = setTimeout(alertFunc, 5000);
          
        }).catch(function(error) {
          // An error happened.
          document.getElementById('forgot1errorspan').innerHTML = error;
        });
      }
 });

		
function signin() {

	var email = document.getElementById('loginemail').value;
        var password = document.getElementById('loginpassword').value;
        if (email.length < 4) {
          document.getElementById('loginerrorspan').innerHTML = "Please enter an email address.";
	  
          return;
        }
        if (password.length < 4) {
          document.getElementById('loginerrorspan').innerHTML = "Please enter a password.";
	  
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
      var user = firebase.auth().currentUser;
      var userid = user.uid;
      var leadsRef = firebase.database().ref('Users/'+userid+'/UserActivated')
				console.log(leadsRef);
					leadsRef.once('value', function(snapshot) {
            var data = snapshot.val();
            if(data == true){
              logUser(user); // Optional
            }
            else{
              document.getElementById('loginerrorspan').innerHTML = "Please activate your account to continue.";
            }
          })
          
      
	}, function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            //alert('Wrong password.');
            document.getElementById('loginerrorspan').innerHTML = "wrong password.";
	    
          } else {
            //alert(errorMessage);
            document.getElementById('loginerrorspan').innerHTML = errorMessage;
          }
          console.log(error);
	  
          // [END_EXCLUDE]
        });
        // [END authwithemail]
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
        document.getElementById('loginerrorspan').innerHTML = "Please wait";
	    console.log("Login Successful:"+user.uid);
		    setCookie('uid',user.uid, 10);
		
	    
	    console.log(getCookie('uid'));
	    var uid = getCookie('uid');
	    console.log(uid);
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
        var userid = user.uid;
        var leadsRef = firebase.database().ref('Users/'+userid+'/SignID')
				console.log(leadsRef);
					leadsRef.once('value', function(snapshot) {
            var data = snapshot.val();
            if(data == true){
              //logUser(user); // Optional
              console.log('data ther');
              try {
                document.getElementById('loginerrorspan').innerHTML = "Please wait";
              window.location.hash = "#/admin/index";
              } catch (error) {
                
              }
              
            }
            else{
              try {
                document.getElementById('loginerrorspan').innerHTML = "Please wait";
                window.location.hash = "#/admin/signature";
              } catch (error) {
                
              }
              
            }
          })
       
		  }
		});
		$('#load').fadeOut('slow'); // or however you wish to update the node
	}

  }

  render() {
    return (
      <>
      <div className="modal">
        <div className="modal-content">
        <Col lg="12" md="8" className="p-2 pb-2">
        <CardBody className="px-lg-3 py-lg-3">
              <div className="text-center text-muted mb-3 mt-2">
                <span>Please enter your email</span>
              </div>
              <Form role="form">
                <Row className="px-2">
              <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="forgotemail" placeholder="Email" type="email"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <div className="text-muted font-italic">
                  <small>
                    <span id="forgot1errorspan"  className="text-error font-weight-700"></span>
                  </small>
                </div>
                
                <div className="text-center">
                  <Button id="forgotbtnnext" className="mt-3 px-4" color="primary" type="button">
                    Next
                  </Button>
                </div>
                </Form>
                </CardBody>
                </Col>
        </div>
        
      </div>


        <Col lg="6" md="7" className="p-5 pb-8">
          <Card className="bg-secondary shadow border-0">
           
            <CardBody className="px-lg-3 py-lg-3 ">
              <div className="text-center text-muted mb-3 mt-2">
                <span>Sign in with credentials</span>
              </div>
              <Form role="form">
                <FormGroup className="mb-1">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="loginemail" placeholder="Email" type="email" autoComplete="new-email"/>
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="loginpassword" placeholder="Password" type="password" autoComplete="new-password"/>
                  </InputGroup>
                </FormGroup>
                
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheck2"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheck2"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-muted font-italic">
                  <small>
                    <span id="loginerrorspan" className="text-warning font-weight-700"></span>
                  </small>
                </div>
                <GoogleReCaptchaProvider reCaptchaKey="6LcPcuwUAAAAAL2ebX2lgNSUH8uzqnMDXFTr06wT">
    <GoogleReCaptcha onVerify={this.verifyCallback} />
  </GoogleReCaptchaProvider>
                <div className="text-center">
                  <Button id="loginbtn" className="my-2 px-4" color="primary" type="button">
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-1">
          
            <Col xs="6 py-2">
                            <Button
                            color="neutral"
                            id="forgotpasswordbtn"
                            >
                            <span className="d-none d-md-block text-gray">Forgot password ?</span>
                            <span className="d-md-none text-gray">Forgot password ?</span>
                            </Button>
            </Col>
            <Col className="text-right py-2" xs="6">
            <Nav className="justify-content-end" pills>
                        
                        <NavItem>
                          <NavLink className="py-2 px-1"   to="/auth/register" tag={Link}>
                            <Button
                            color="neutral"
                            >
                            <span className="d-none d-md-block text-gray">No Account? Sign Up for Free</span>
                            <span className="d-md-none text-gray">Create new account</span>
                            </Button>
                            
                          </NavLink>
                        </NavItem>
                      </Nav>
            </Col>
            
          </Row>
        </Col>

        <Row>
        <Col>
        
        </Col>
        </Row>
      </>
    );
  }
}

export default Login;
