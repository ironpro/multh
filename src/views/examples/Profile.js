
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";

var firebase = require('firebase');

class Profile extends React.Component {
  componentDidMount(){

    var modal = document.querySelectorAll(".modal")

    var userid = "";
    var URI = "";
    modal[0].style.display = "block";
    firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {

        userid = user.uid;
        console.log(userid);
        try {
          var storageRef = firebase.storage().ref();
          storageRef.child(userid + '/ProfilePic/profilepic.png').getDownloadURL().then(function(url){
          // `url` is the download URL for 'images/stars.jpg'
        
          // This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function(event) {
          var blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
        
            // Or inserted into an <img> element:
            console.log(url)
            var img = document.getElementById('profilepicmodal');
            img.setAttribute('crossOrigin', 'anonymous');
          img.src = url;

          var img2 = document.getElementById('settingsprofilepic');
            img2.setAttribute('crossOrigin', 'anonymous');
          img2.src = url;
          modal[0].style.display = "none";
          
          
            }).catch(function(error) {
              modal[0].style.display = "none";
            // Handle any errors
        });
        } catch (error) {
          modal[0].style.display = "none";
          
        }
        

        

        var leadsRef = firebase.database().ref('Users/'+userid)
			console.log('found ref');
		leadsRef.on('value', function(snapshot) {
			var Child = snapshot.val();
        var name = Child.UserFirstName;
        var number = Child.UserNumber;
        var email = Child.UserEmail;
        console.log(name + email + number);
        document.getElementById('input-username').value = name;
        document.getElementById('input-number').value = number;
        document.getElementById('input-email').value = email;
        document.getElementById('defaultname').innerText  = name;
        document.getElementById('defaultemail').innerHTML  = email;

                

        if(name!='' || name!= null){
          
        }
        
  });
  
  

      }
      else{
        
        window.location.hash = "#/auth/login";
        
      }
    });

    var profilepicbtn = document.getElementById('profilepicbtn');
    profilepicbtn.addEventListener('click', function(event) {
		modal[1].style.display = "block";
    });
    
    var uploadprofilepicbtn = document.getElementById('uploadprofilepicbtn');
    uploadprofilepicbtn.addEventListener('click', function(event) {
      console.log('pressed');
        document.getElementById("inputprofilepicbtn").click();
    });

    
document.getElementById('inputprofilepicbtn').addEventListener('input', function(input) {
	try {
		console.log(input.target.value);
	console.log(input.srcElement.files[0].name);

    var file = input.srcElement.files[0];
	console.log(input.srcElement.files[0].name);

  var reader = new FileReader();
    reader.readAsDataURL(file);

  reader.onload = function() {
    URI = file;
    document.getElementById('profilepicmodal').src = reader.result;
    document.getElementById('settingsprofilepic').src = reader.result;
     var url = reader.result;
	
  };

  reader.onerror = function() {
    console.log(reader.error);
    alert('Error Opening File');
  };
	} catch (error) {
		console.log(error);
	}
	
});

var closeprofilepicbtn = document.getElementById('closeprofilepicbtn');
closeprofilepicbtn.addEventListener('click', function(event) {
		modal[1].style.display = "none";
    });

    var saveprofilepicbtn = document.getElementById('saveprofilepicbtn');
    saveprofilepicbtn.addEventListener('click', function(event) {
    modal[0].style.display = "block";
    modal[1].style.display = "none";
    if(URI == ''){
      alert('No Image Selected');
    }
    else{
      var filename = 'profilepic';
          var storageRef = firebase.storage().ref(userid + '/ProfilePic/'+filename+'.png');
        var task = storageRef.put(URI);
        task.on('state_changed', function progress(snapshot) {
          console.log('started')
        }, function error(err) {
        
          console.log(err)
        },function complete() {
          console.log('complete')
          
          modal[0].style.display = "none";
          window.location.reload(false);
          
          
        });
    }
    
    });


    function convertURIToImageData(URI) {
      return new Promise(function(resolve, reject) {
        if (URI == null) return reject();
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            image = new Image();
        image.addEventListener('load', function() {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        }, false);
        image.src = URI;
      });
    }
    


    
  }
  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
        <div className="modal">
        <div className="modal-content">
          <div><p>Please wait while we fetch your details.</p><div className="lds-dual-ring"></div></div>
        
        </div>
      </div>
      <div className="modal">
        <div className="modal-content">
        <img crossOrigin="anonymous"  id="profilepicmodal" className="profilepicmodal" ></img>
        <Row id="profilepicupdatediv">
        <Col lg="3">
        <Button id="uploadprofilepicbtn" className=" px-3" color="success" type="button">Upload</Button>
        <input id="inputprofilepicbtn" type="file" accept="image/*"></input>
        </Col>
        <Col lg="3">
        <Button id="saveprofilepicbtn" className=" px-3" color="primary" type="button">Save</Button>
        </Col>
        <Col lg="3">
        <Button id="closeprofilepicbtn" className=" px-4" color="neutral" type="button">Close</Button>
        </Col>
        </Row>
        
        </div>
      </div>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image" id="card-profile-image">
                      <a href="#pablo" id="profilepicbtn" onClick={e => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          id="settingsprofilepic"
                          src="./team-4-800x800.jpg"
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                    <Button
                      className="mr-4"
                      color="info"
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                      size="sm"
                    >
                      Upgrade
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                        
                      </div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3 id="defaultname">
                      Name
                    </h3>
                    <div className="h5 font-weight-300">
                        <p id="defaultemail">
                          Email
                        </p>
                    </div>
                    
                    
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-username"
                              placeholder="Name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="Email"
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Contact information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-number"
                            >
                              Phone Number
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-number"
                              placeholder="Phone Number"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      
                    </div>
                    
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Profile;
